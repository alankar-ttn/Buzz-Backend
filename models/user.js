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
		minlength: 5,
		maxlength: 50,
	},
	lastName: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50,
	},
	email: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 255,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 1024,
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
		minlength: 5,
		maxlength: 50,
	},
	gender: {
		type: String,
		required: true,
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
		minlength: 5,
		maxlength: 255,
	},
	coverImage: {
		type: String,
		required: false,
		minlength: 5,
		maxlength: 255,
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
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
	const schema = Joi.object({
		firstName: Joi.string().min(5).max(50).required(),
		lastName: Joi.string().min(5).max(50).required(),
		email: Joi.string().min(5).max(255).required().email(),
		password: Joi.string().min(5).max(255).required(),
		isAdmin: Joi.boolean(),
		designation: Joi.string().min(5).max(50),
		website: Joi.string().min(5).max(50),
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
	});
	return schema.validate(user);
}

exports.User = User;
exports.validateUser = validateUser;
