const db = require('../config/db');

// Create Project
exports.createProject = (req, res) => {
    const { title, description, goal_amount, deadline } = req.body;
    const user_id = req.user.id;

    if (!title || !goal_amount || !deadline) {
        return res.status(400).json({ message: 'Title, goal_amount and deadline are required' });
    }

    db.run(`INSERT INTO projects (user_id, title, description, goal_amount, deadline, status) 
            VALUES (?, ?, ?, ?, ?, 'active')`,
        [user_id, title, description, goal_amount, deadline],
        function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error creating project' });
            }

            res.status(201).json({
                message: 'Project created successfully',
                project_id: this.lastID
            });
        }
    );
};

// Get All Projects
exports.getAllProjects = (req, res) => {
    db.all(`SELECT p.*, u.username, u.full_name 
            FROM projects p 
            JOIN users u ON p.user_id = u.id 
            ORDER BY p.created_at DESC`, 
        [], (err, projects) => {
            if (err) return res.status(500).json({ message: 'Error fetching projects' });
            res.json(projects);
        }
    );
};

// Get Single Project
exports.getProjectById = (req, res) => {
    const { id } = req.params;

    db.get(`SELECT p.*, u.username, u.full_name 
            FROM projects p 
            JOIN users u ON p.user_id = u.id 
            WHERE p.id = ?`, 
        [id], (err, project) => {
            if (err) return res.status(500).json({ message: 'Error fetching project' });
            if (!project) return res.status(404).json({ message: 'Project not found' });
            res.json(project);
        }
    );
};