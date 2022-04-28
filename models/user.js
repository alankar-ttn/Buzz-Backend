const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	uid: {
		type: String,
		required: true,
	},
	firstName: {
		type: String,
		required: true,
		minlength: 2,
		maxlength: 50,
	},
	lastName: {
		type: String,
		maxlength: 50,
	},
	email: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 255,
		unique: true,
	},
	isAdmin: {
        type: Boolean,
        default: false
    },
	dateCreated: {
		type: Date,
		default: Date.now,
	},
	designation: {
		type: String,
		required: false,
		minlength: 5,
		maxlength: 50,
	},
	website: {
		type: String,
		required: false,
		maxlength: 50,
	},
	gender: {
		type: String,
		required: false,
		minlength: 4,
		maxlength: 6,
	},
	dateOfBirth: {
		type: Date,
		required: false,
	},
	city: {
		type: String,
		required: false,
		minlength: 3,
		maxlength: 50,
	},
	state: {
		type: String,
		required: false,
		minlength: 3,
		maxlength: 50,
	},
	pincode: {
		type: String,
		required: false,
		minlength: 6,
		maxlength: 6,
	},
	profileImage: {
		type: String,
		required: false,
		default: "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png"
	},
	coverImage: {
		type: String,
		required: false,
	},
	friends: {
		type: Array,
		required: false,
	},
	friendRequestsSent: {
		type: Array,
		required: false,
	},
	friendRequestsReceived: {
		type: Array,
		required: false,
	},
	profileViews: {
		type: Number,
		required: false,
		default: 0,
	},
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
	const schema = Joi.object({
		firstName: Joi.string().min(2).max(50).required(),
		lastName: Joi.string().max(50),
		email: Joi.string().min(5).max(255).required().email(),
		isAdmin: Joi.boolean(),
		designation: Joi.string().min(5).max(50),
		website: Joi.string().max(50),
		gender: Joi.string().min(4).max(6).required(),
		dateOfBirth: Joi.date(),
		city: Joi.string().min(3).max(50),
		state: Joi.string().min(3).max(50),
		pincode: Joi.string().min(6).max(6),
		profileImage: Joi.string().min(5).max(255),
		coverImage: Joi.string().min(5).max(255),
		friends: Joi.array(),
		friendRequestsSent: Joi.array(),
		friendRequestsReceived: Joi.array(),
		profileViews: Joi.number(),
	});
	return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
