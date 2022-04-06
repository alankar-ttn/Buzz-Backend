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

router.post("userprofile/:id" , async (req, res) =>  {
          const user = await User.findById(req.params.id);

          if (user) {
              user.firstName = req.body.firstName || user.firstName;
              user.lastName = req.body.lastName || user.lastName;
              user.designation = req.body.designation || user.designation;
              user.website = req.body.website || user.website;
              user.gender = req.body.gender || user.gender;
              user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
              user.city = req.body.city || user.city;
              user.state = req.body.state || user.state;
              user.pincode = req.body.pincode || user.pincode;
              user.profileImage = req.body.profileImage || user.profileImage;

              const updatedUser = await user.save();

              res.json({
                  _id:updatedUser._id,
                  firstName:updatedUser.firstName,
                  lastName:updatedUser.lastName,
                  designation:updatedUser.designation,
                  website:updatedUser.website,
                  gender:updatedUser.gender,
                  dateOfBirth:updatedUser.dateOfBirth,
                  city:updatedUser.city,
                  state:updatedUser.state,
                  pincode:updatedUser.pincode,
                  profileImage:updatedUser.profileImage,
                  token:generateToken(updatedUser._id),
              });
          } else {
              res.status(404);
              throw new Error("User not found !");
          }
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