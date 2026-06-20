const db = require('../config/db');

// Make a Donation
exports.createDonation = (req, res) => {
    const { project_id, amount, payment_reference } = req.body;
    const user_id = req.user.id;

    if (!project_id || !amount) {
        return res.status(400).json({ message: 'Project ID and amount are required' });
    }

    db.run(`INSERT INTO donations (project_id, user_id, amount, payment_reference) 
            VALUES (?, ?, ?, ?)`,
        [project_id, user_id, amount, payment_reference],
        function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error processing donation' });
            }

            res.status(201).json({
                message: 'Donation successful',
                donation_id: this.lastID
            });
        }
    );
};

// Get Donations for a Project
exports.getProjectDonations = (req, res) => {
    const { project_id } = req.params;

    db.all(`SELECT d.*, u.username, u.full_name 
            FROM donations d
            JOIN users u ON d.user_id = u.id
            WHERE d.project_id = ?
            ORDER BY d.created_at DESC`, 
        [project_id], (err, donations) => {
            if (err) return res.status(500).json({ message: 'Error fetching donations' });
            res.json(donations);
        }
    );
};