const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//  Register a new user
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body);

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//  Get all users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude password for security
        res.json(users);
        console.log(users);
        console.log(req.body);


    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//  Login user
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ error: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ error: "Invalid email or password" });

        const token = jwt.sign({ userId: user._id }, "secret_key", { expiresIn: "1h" });

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
