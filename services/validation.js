const Joi = require("joi")

const validateRegister = (user) => {
    const schema = Joi.object({
        firstName: Joi.string().min(5).max(50).required(),
        lastName: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        gender: Joi.string().min(4).max(6).required(),
    });
    return schema.validate(user);
}

const validateGoogleRegister = (user) => {
    const schema = Joi.object({
        uid: Joi.string().min(5).max(255).required(),
        firstName: Joi.string().min(5).max(50).required(),
        lastName: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
    });
    return schema.validate(user);
}

const validateLogin = (user) => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });
    return schema.validate(user);
}

exports.validateRegister = validateRegister;
exports.validateGoogleRegister = validateGoogleRegister;
exports.validateLogin = validateLogin;