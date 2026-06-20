const db = require('../config/db');

// Create Comment
exports.createComment = (req, res) => {
    const { project_id, comment } = req.body;
    const user_id = req.user.id;

    if (!project_id || !comment) {
        return res.status(400).json({ message: 'Project ID and comment text are required' });
    }

    db.run(`INSERT INTO comments (project_id, user_id, comment) 
            VALUES (?, ?, ?)`,
        [project_id, user_id, comment],
        function(err) {
            if (err) return res.status(500).json({ message: 'Error posting comment' });

            res.status(201).json({
                message: 'Comment posted successfully',
                comment_id: this.lastID
            });
        }
    );
};

// Get Comments for a Project
exports.getProjectComments = (req, res) => {
    const { project_id } = req.params;

    db.all(`SELECT c.*, u.username, u.full_name 
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.project_id = ?
            ORDER BY c.created_at DESC`, 
        [project_id], (err, comments) => {
            if (err) return res.status(500).json({ message: 'Error fetching comments' });
            res.json(comments);
        }
    );
};