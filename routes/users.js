const express = require("express");
const { User } = require("../models/user");
const admin = require("../config/firebase-config");
const {
	validateRegister,
	validateGoogleRegister,
} = require("../services/validation");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/profile", auth, async (req, res) => {
	const user = await User.findById(req.user._id).select("-password");
	res.send(user);
}); 

// user : update profile

router.post("/:id/userprofile", async (req, res) => {
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
			_id: updatedUser._id,
			firstName: updatedUser.firstName,
			lastName: updatedUser.lastName,
			designation: updatedUser.designation,
			website: updatedUser.website,
			gender: updatedUser.gender,
			dateOfBirth: updatedUser.dateOfBirth,
			city: updatedUser.city,
			state: updatedUser.state,
			pincode: updatedUser.pincode,
			profileImage: updatedUser.profileImage,
		});
	} else {
		res.status(404);
		throw new Error("User not found !");
	}
});

// user - friend request sent and received

router.put("/:id/friendRequest", async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);
			if (!user.friendRequestsSent.includes(req.body.userId)) {
				await user.updateOne({
					$push: { friendRequestsSent: req.body.userId },
				});
				await currentUser.updateOne({
					$push: { friendRequestsReceived: req.params.id },
				});
				res.status(200).send("the request has been sent");
			} else {
				res.status(403).send(
					"you already sent the request to this user"
				);
			}
		} catch (err) {
			res.status(500).send("Error", err);
		}
	} else {
		res.status(403).send("you cant send request");
	}
});

// user - friend request delete

router.put("/:id/friendRequestDelete", async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.friendRequestsSent.includes(req.body.userId)){
                await user.updateOne({ $pull: { friendRequestsSent: req.body.userId } });
                await currentUser.updateOne({ $pull: { friendRequestsReceived: req.params.id } });
                res.status(200).send("the request has been deleted");
            } else{
                res.status(403).send("you already deleted the request to this user")
            }
        }catch(err){
            res.status(500).send("Error",err)
        }
    }else{
        res.status(403).send("you cant delete friend request")
    }
})

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
	});

	user = new User({
		uid: userRecord.uid,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: password,
		gender: req.body.gender,
	});

	await user.save();
	res.status(201).send({ data: "User Created Successfully." });
});

router.post("/register/google", async (req, res) => {
	const { error } = validateGoogleRegister(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({ email: req.body.email });
	if (user) {
		return res.status(200).send(user);
	} else {
		user = new User({
			uid: req.body.uid,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: "123456",
			profileImage: req.body.profileImage,
		});

		await user.save();
		res.status(201).send({ data: "User Created Successfully." });
	}
});

module.exports = router;
