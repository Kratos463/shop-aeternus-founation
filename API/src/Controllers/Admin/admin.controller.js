const express = require('express');
const router = express.Router();
const Admin = require('../Models/admin.model');
const bcryptjs = require('bcryptjs');
const { verifyAdminJWT } = require('../middleware/auth');

// Middleware to protect routes - verify if admin
router.use(verifyAdminJWT);

// POST add a new admin
router.post('/admins', async (req, res) => {
    try {
        // Check if admin already exists with the given username or email
        const existingAdmin = await Admin.findOne({
            $or: [{ username: req.body.username }, { email: req.body.email }]
        });
        if (existingAdmin) {
            return res.status(400).json({ error: "Admin with this username or email already exists" });
        }

        // Create a new admin
        const newAdmin = new Admin(req.body);
        // Hash the password
        newAdmin.password = await bcryptjs.hash(req.body.password, 16);
        await newAdmin.save();
        res.status(201).json(newAdmin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT update admin
router.put('/admins/:id', async (req, res) => {
    try {
        const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }
        res.json(admin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT change password for admin
router.put('/admins/:id/change-password', async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        // Compare old password
        const isPasswordCorrect = await bcryptjs.compare(req.body.oldPassword, admin.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Old password is incorrect" });
        }

        // Hash and update new password
        admin.password = await bcryptjs.hash(req.body.newPassword, 16);
        await admin.save();
        
        res.json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
