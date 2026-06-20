const db = require('../config/db');

// Get User Profile
exports.getProfile = (req, res) => {
    const user_id = req.user.id;

    db.get(`SELECT id, username, email, full_name, bio, profile_picture, 
            cover_picture, country, created_at 
            FROM users WHERE id = ?`, 
        [user_id], (err, user) => {
            if (err) return res.status(500).json({ message: 'Error fetching profile' });
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json(user);
        }
    );
};

// Update Profile
exports.updateProfile = (req, res) => {
    const user_id = req.user.id;
    const { full_name, bio, profile_picture, cover_picture, country } = req.body;

    db.run(`UPDATE users 
            SET full_name = ?, bio = ?, profile_picture = ?, 
                cover_picture = ?, country = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
        [full_name, bio, profile_picture, cover_picture, country, user_id],
        function(err) {
            if (err) return res.status(500).json({ message: 'Error updating profile' });
            res.json({ message: 'Profile updated successfully' });
        }
    );
};

// Get Public User Profile (by ID)
exports.getPublicProfile = (req, res) => {
    const { id } = req.params;

    db.get(`SELECT id, username, full_name, bio, profile_picture, 
            cover_picture, country, created_at 
            FROM users WHERE id = ?`, 
        [id], (err, user) => {
            if (err) return res.status(500).json({ message: 'Error fetching profile' });
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json(user);
        }
    );
};