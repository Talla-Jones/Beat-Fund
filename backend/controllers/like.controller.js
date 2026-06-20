const db = require('../config/db');

// Like a Project
exports.likeProject = (req, res) => {
    const { project_id } = req.body;
    const user_id = req.user.id;

    if (!project_id) {
        return res.status(400).json({ message: 'Project ID is required' });
    }

    // Check if already liked
    db.get('SELECT * FROM likes WHERE user_id = ? AND project_id = ?', 
        [user_id, project_id], (err, existing) => {
            if (existing) {
                // Unlike if already liked
                db.run('DELETE FROM likes WHERE user_id = ? AND project_id = ?', 
                    [user_id, project_id], (err) => {
                        res.json({ message: 'Project unliked' });
                    });
            } else {
                // Like the project
                db.run('INSERT INTO likes (user_id, project_id) VALUES (?, ?)', 
                    [user_id, project_id], (err) => {
                        if (err) return res.status(500).json({ message: 'Error liking project' });
                        res.status(201).json({ message: 'Project liked successfully' });
                    });
            }
        }
    );
};

// Get Likes for a Project
exports.getProjectLikes = (req, res) => {
    const { project_id } = req.params;

    db.all(`SELECT l.*, u.username, u.full_name 
            FROM likes l
            JOIN users u ON l.user_id = u.id
            WHERE l.project_id = ?`, 
        [project_id], (err, likes) => {
            if (err) return res.status(500).json({ message: 'Error fetching likes' });
            res.json(likes);
        }
    );
};