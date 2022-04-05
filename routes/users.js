const express = require("express");
const { User } = require("../models/user");
const admin = require("../config/firebase-config");
const { validateRegister } = require("../services/validation");
const bcrypt = require('bcrypt');
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/profile", auth, async (req, res) => {
	const user = await User.findById(req.user._id).select("-password");
	res.send(user);
});

router.post("/register", async (req, res) => {
    const { error } = validateRegister(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
 
    const userRecord = await admin.auth().createUser({
        email: req.body.email,
        password: password,
        displayName: req.body.firstName + " " + req.body.lastName,
    })

    user = new User({
        uid: userRecord.uid,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: password,
        gender: req.body.gender,
    });

    await user.save();
    res.status(201).send({"data": "User Created Successfully."})
});

module.exports = router