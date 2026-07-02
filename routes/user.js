const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { pool } = require('../config/database');

router.get('/wishlist', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT w.*, p.title, p.price, p.old_price, p.image_url, p.slug, p.category, p.subcategory
       FROM wishlist w
       JOIN products p ON w.product_id = p.id
       WHERE w.user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/wishlist/add', auth, async (req, res) => {
  try {
    const { product_id } = req.body;
    await pool.query(
      'INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, product_id]
    );
    res.json({ message: 'Added to wishlist' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/wishlist/remove/:productId', auth, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2',
      [req.user.id, req.params.productId]
    );
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/compare', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, p.title, p.price, p.old_price, p.image_url, p.slug, p.category, p.subcategory, p.era, p.material
       FROM compare c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/compare/add', auth, async (req, res) => {
  try {
    const { product_id } = req.body;
    
    const count = await pool.query(
      'SELECT COUNT(*) FROM compare WHERE user_id = $1',
      [req.user.id]
    );

    if (parseInt(count.rows[0].count) >= 4) {
      return res.status(400).json({ error: 'Compare list full (max 4)' });
    }

    await pool.query(
      'INSERT INTO compare (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, product_id]
    );
    res.json({ message: 'Added to compare' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/compare/remove/:productId', auth, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM compare WHERE user_id = $1 AND product_id = $2',
      [req.user.id, req.params.productId]
    );
    res.json({ message: 'Removed from compare' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/addresses', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/addresses', auth, async (req, res) => {
  try {
    const { type, name, line1, line2, city, state, zip, country, phone } = req.body;
    
    const result = await pool.query(
      `INSERT INTO addresses (user_id, type, name, line1, line2, city, state, zip, country, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [req.user.id, type, name, line1, line2, city, state, zip, country, phone]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { first_name, last_name, phone } = req.body;
    
    const result = await pool.query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, phone = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, uid, first_name, last_name, email, phone`,
      [first_name, last_name, phone, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
