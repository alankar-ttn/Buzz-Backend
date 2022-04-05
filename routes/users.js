const express = require("express");
const { User } = require("../models/user");
const admin = require("../config/firebase-config");
const { validateLogin, validateRegister } = require("../services/validation");
const bcrypt = require('bcrypt');
const router = express.Router();

router.get("/profile", async (req, res) => {
	const user = await User.findById(req.user._id).select("-password");
	res.send(user);
});

router.post("/login", async (req, res) => {
	const { error } = validateLogin(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).send("Invalid email or password.");

	const validPassword = await bcrypt.compare(
		req.body.password,
		user.password
	);
	if (!validPassword)
		return res.status(400).send("Invalid email or password.");

	const token = user.generateAuthToken();
	res.send(token);
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

    const token = await admin.auth().createCustomToken(userRecord.uid)
    res.send(token);
});

module.exports = router