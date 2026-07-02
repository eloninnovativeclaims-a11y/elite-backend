const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { pool } = require('../config/database');

router.post('/create', auth, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    const { shipping_address, billing_address, payment_method } = req.body;

    const cartItems = await client.query(
      `SELECT c.*, p.price, p.title
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [req.user.id]
    );

    if (cartItems.rows.length === 0) {
      throw new Error('Cart is empty');
    }

    const total = cartItems.rows.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const orderNumber = 'EL-2026-' + String(Math.floor(Math.random() * 9000) + 1000);

    const orderResult = await client.query(
      `INSERT INTO orders (order_number, user_id, total_amount, payment_method, shipping_address, billing_address, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING *`,
      [orderNumber, req.user.id, total, payment_method, JSON.stringify(shipping_address), JSON.stringify(billing_address)]
    );

    const order = orderResult.rows[0];

    for (const item of cartItems.rows) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
        [order.id, item.product_id, item.quantity, item.price]
      );
    }

    await client.query('DELETE FROM cart WHERE user_id = $1', [req.user.id]);

    await client.query('COMMIT');

    res.status(201).json({
      message: 'Order created successfully',
      order: {
        id: order.id,
        order_number: order.order_number,
        total: order.total_amount,
        status: order.status
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  } finally {
    client.release();
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const orderResult = await pool.query(
      'SELECT * FROM orders WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderResult.rows[0];

    const itemsResult = await pool.query(
      `SELECT oi.*, p.title, p.image_url, p.slug
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = $1`,
      [order.id]
    );

    res.json({
      ...order,
      items: itemsResult.rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/track/:orderNumber', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE order_number = $1',
      [req.params.orderNumber]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
