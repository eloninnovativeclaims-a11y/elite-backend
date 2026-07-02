const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const auth = require('../middleware/auth');

// Middleware to check if user is admin (you can modify this logic)
const isAdmin = async (req, res, next) => {
    try {
        // For now, let's say user ID 1 is admin
        if (req.user.id === 1) {
            next();
        } else {
            res.status(403).json({ error: 'Admin access required' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all users
router.get('/users', auth, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, uid, first_name, last_name, email, phone, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single user
router.get('/users/:id', auth, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, uid, first_name, last_name, email, phone, created_at FROM users WHERE id = $1',
            [req.params.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user profile
router.put('/users/:id', auth, isAdmin, async (req, res) => {
    try {
        const { first_name, last_name, email, phone } = req.body;
        
        const result = await pool.query(
            `UPDATE users 
             SET first_name = $1, last_name = $2, email = $3, phone = $4, updated_at = CURRENT_TIMESTAMP
             WHERE id = $5
             RETURNING id, uid, first_name, last_name, email, phone, created_at`,
            [first_name, last_name, email, phone, req.params.id]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            message: 'User updated successfully',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete user
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
    try {
        // Don't allow deleting yourself
        if (parseInt(req.params.id) === req.user.id) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }
        
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [req.params.id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Reset user password
router.post('/users/:id/reset-password', auth, isAdmin, async (req, res) => {
    try {
        const { new_password } = req.body;
        
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(new_password, salt);
        
        await pool.query(
            'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [passwordHash, req.params.id]
        );
        
        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all orders (admin view)
router.get('/orders', auth, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT o.*, u.first_name, u.last_name, u.email
             FROM orders o
             JOIN users u ON o.user_id = u.id
             ORDER BY o.created_at DESC`
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
// Get single order with items
router.get('/orders/:id', auth, isAdmin, async (req, res) => {
    try {
        const orderResult = await pool.query(
            `SELECT o.*, u.first_name, u.last_name, u.email, u.phone
             FROM orders o
             JOIN users u ON o.user_id = u.id
             WHERE o.id = $1`,
            [req.params.id]
        );

        if (orderResult.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const order = orderResult.rows[0];

        // Get order items
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
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update order status
router.put('/orders/:id/status', auth, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        
        // Validate status
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const result = await pool.query(
            `UPDATE orders 
             SET status = $1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $2
             RETURNING id, order_number, status, updated_at`,
            [status, req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({
            message: 'Order status updated successfully',
            order: result.rows[0]
        });
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete order
router.delete('/orders/:id', auth, isAdmin, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM orders WHERE id = $1 RETURNING id', [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Delete order error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
module.exports = router;
