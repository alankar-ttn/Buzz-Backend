const Joi = require("joi");

const validateGoogleRegister = (user) => {
	const schema = Joi.object({
		uid: Joi.string().min(5).max(255).required(),
		firstName: Joi.string().min(2).max(50).required(),
		lastName: Joi.string().max(50),
		email: Joi.string().min(5).max(255).required().email(),
		profileImage: Joi.string().min(5).max(255),
	});
	return schema.validate(user);
};

const validateLogin = (user) => {
	const schema = Joi.object({
		email: Joi.string().min(5).max(255).required().email(),
		password: Joi.string().min(5).max(255).required(),
	});
	return schema.validate(user);
};

const validateComment = (comment) => {
	const schema = Joi.object({
		comment: Joi.string().min(1).max(255).required(),
	});
	return schema.validate(comment);
};

exports.validateGoogleRegister = validateGoogleRegister;
exports.validateLogin = validateLogin;
exports.validateComment = validateComment;
