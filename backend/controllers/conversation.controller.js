const db = require('../config/db');

// Start or Get Conversation
exports.getOrCreateConversation = (req, res) => {
    const { user2_id } = req.body;
    const user1_id = req.user.id;

    if (user1_id === user2_id) {
        return res.status(400).json({ message: "Cannot message yourself" });
    }

    // Ensure user1_id is smaller
    const [smaller, larger] = [Math.min(user1_id, user2_id), Math.max(user1_id, user2_id)];

    db.get('SELECT * FROM conversations WHERE user1_id = ? AND user2_id = ?', 
        [smaller, larger], (err, conversation) => {
            if (conversation) {
                return res.json(conversation);
            }

            db.run('INSERT INTO conversations (user1_id, user2_id) VALUES (?, ?)', 
                [smaller, larger], function(err) {
                    if (err) return res.status(500).json({ message: 'Error creating conversation' });
                    res.status(201).json({ id: this.lastID, user1_id: smaller, user2_id: larger });
                }
            );
        }
    );
};

// Get User's Conversations
exports.getUserConversations = (req, res) => {
    const user_id = req.user.id;

    db.all(`SELECT c.*, 
            CASE WHEN c.user1_id = ? THEN u2.username ELSE u1.username END as other_user,
            CASE WHEN c.user1_id = ? THEN u2.full_name ELSE u1.full_name END as other_full_name
            FROM conversations c
            LEFT JOIN users u1 ON c.user1_id = u1.id
            LEFT JOIN users u2 ON c.user2_id = u2.id
            WHERE c.user1_id = ? OR c.user2_id = ?
            ORDER BY c.created_at DESC`, 
        [user_id, user_id, user_id, user_id], (err, conversations) => {
            if (err) return res.status(500).json({ message: 'Error fetching conversations' });
            res.json(conversations);
        }
    );
};