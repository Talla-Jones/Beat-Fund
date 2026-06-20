const db = require('../config/db');

// Send Message
exports.sendMessage = (req, res) => {
    const { conversation_id, message_text } = req.body;
    const sender_id = req.user.id;

    db.run(`INSERT INTO messages (conversation_id, sender_id, message_text) 
            VALUES (?, ?, ?)`,
        [conversation_id, sender_id, message_text],
        function(err) {
            if (err) return res.status(500).json({ message: 'Error sending message' });

            res.status(201).json({
                message: 'Message sent',
                message_id: this.lastID
            });
        }
    );
};

// Get Messages in Conversation
exports.getMessages = (req, res) => {
    const { conversation_id } = req.params;

    db.all(`SELECT m.*, u.username, u.full_name 
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE m.conversation_id = ?
            ORDER BY m.created_at ASC`, 
        [conversation_id], (err, messages) => {
            if (err) return res.status(500).json({ message: 'Error fetching messages' });
            res.json(messages);
        }
    );
};