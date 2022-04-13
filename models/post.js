const Joi = require("joi");
const mongoose = require("mongoose");
Joi.objectId = require('joi-objectid')(Joi)

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255
    },
    images: {
        type: Array,
        required: false,
    },
    videos: {
        type: Array,
        required: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: Object,
        ref: "User",
        required: true
    },
    likes: [
        {
            user: {
                type: String,
                required: true,
                // unique: true
            },
            name: {
                type: String, 
                required: true
            },
            profileImage: {
                type: String,
                required: true
            }
        }
    ],
    dislikes: [
        {
            user: {
                type: String,
                required: true,
                //unique: true
            },
            name: {
                type: String, 
                required: true
            },
            profileImage: {
                type: String,
                required: true
            }
        }
    ],
    comments: [
        {
            user: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            profileImage: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 255
            },
            dateCreated: {
                type: Date,
                default: Date.now,
            }
        }
    ],
    reported: {
        type: Boolean,
        default: false
    }
});

const Post = mongoose.model("Post", postSchema);

function validatePost(post) {
    const schema = Joi.object({
        caption: Joi.string()
            .min(1)
            .max(255)
            .required(),
        images: Joi.array(),
        videos: Joi.array(),
        likes: Joi.array(),
        dislikes: Joi.array(),
        comments: Joi.array(),
        reported: Joi.boolean()
    });

    return schema.validate(post);
}

exports.Post = Post
exports.validatePost = validatePost