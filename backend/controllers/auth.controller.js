const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, email, password, full_name, country } = req.body;

    try {
        // Check if user exists
        db.get('SELECT * FROM users WHERE email = ? OR username = ?', [email, username], async (err, user) => {
            if (user) return res.status(400).json({ message: 'User already exists' });

            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);

            db.run(`INSERT INTO users (username, email, password_hash, full_name, country) 
                    VALUES (?, ?, ?, ?, ?)`,
                [username, email, password_hash, full_name, country],
                function(err) {
                    if (err) return res.status(500).json({ message: 'Error creating user' });

                    const token = jwt.sign({ id: this.lastID }, process.env.JWT_SECRET, { expiresIn: '7d' });
                    res.status(201).json({ message: 'User registered successfully', token });
                }
            );
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                full_name: user.full_name
            }
        });
    });
};