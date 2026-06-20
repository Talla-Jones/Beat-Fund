const db = require('../config/db');

// Create Notification
exports.createNotification = (req, res) => {
    const { user_id, type, reference_id } = req.body;

    db.run(`INSERT INTO notifications (user_id, type, reference_id, is_read) 
            VALUES (?, ?, ?, 0)`,
        [user_id, type, reference_id],
        function(err) {
            if (err) return res.status(500).json({ message: 'Error creating notification' });
            res.status(201).json({ message: 'Notification created' });
        }
    );
};

// Get User Notifications
exports.getUserNotifications = (req, res) => {
    const user_id = req.user.id;

    db.all(`SELECT * FROM notifications 
            WHERE user_id = ? 
            ORDER BY created_at DESC`, 
        [user_id], (err, notifications) => {
            if (err) return res.status(500).json({ message: 'Error fetching notifications' });
            res.json(notifications);
        }
    );
};

// Mark Notification as Read
exports.markAsRead = (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    db.run('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', 
        [id, user_id], (err) => {
            if (err) return res.status(500).json({ message: 'Error updating notification' });
            res.json({ message: 'Notification marked as read' });
        }
    );
};