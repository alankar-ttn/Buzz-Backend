const express = require("express");
const auth = require("../middleware/auth");
const { validatePost, Post } = require("../models/post");
const { validateComment } = require("../services/validation");
const router = express.Router();

// Create a new post
router.post("/", auth, async (req, res) => {
	const { error } = validatePost(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	let post = new Post({
		caption: req.body.caption,
		images: req.body.images,
		videos: req.body.videos,
		user: {
			_id: req.user._id,
			firstName: req.user.firstName,
			lastName: req.user.lastName,
			profileImage: req.user.profileImage,
		},
	});

	await post.save();
	res.status(201).send(post);
});

// Get all posts
router.get("/", auth, async (req, res) => {
	const skip =
		req.query.skip && /^\d+$/.test(req.query.skip)
			? Number(req.query.skip)
			: 0;
	const posts = await Post.find().sort({ dateCreated: -1 });
	res.send(posts);
});

// Report a particular post
router.post("/:postId/report", auth, async (req, res) => {
	const post = await Post.findById(req.params.postId);
	if (!post) return res.status(404).send("Post not found");

	await post.updateOne({
		reported: req.body.reported,
	});
	return res.status(200).send("Post reported");
});

// React to a particular post: Like and Dislike
router.post("/:postId/reaction", auth, async (req, res) => {
	const post = await Post.findById(req.params.postId);
	if (!post) return res.status(404).send("Post not found.");

	const reaction = req.body.reaction;

	if (reaction === "like") {
		await post.updateOne({
			$push: {
				likes: {
					name: req.user.firstName + " " + req.user.lastName,
					profileImage: req.user.profileImage,
					user: req.user.uid,
				},
			},
			$pull: {
				dislikes: {
					name: req.user.firstName + " " + req.user.lastName,
					profileImage: req.user.profileImage,
					user: req.user.uid,
				},
			},
		});
		return res.status(200).send("Like added.");
	} else if (reaction === "dislike") {
		await post.updateOne({
			$pull: {
				likes: {
					name: req.user.firstName + " " + req.user.lastName,
					profileImage: req.user.profileImage,
					user: req.user.uid,
				},
			},
			$push: {
				dislikes: {
					name: req.user.firstName + " " + req.user.lastName,
					profileImage: req.user.profileImage,
					user: req.user.uid,
				},
			},
		});
		return res.status(200).send("Dislike added.");
	} else {
		return res.status(400).send("Invalid reaction");
	}
});

// Get comments of a particular post
router.get("/:id/comments", auth, async (req, res) => {
	const post = await Post.findById(req.params.id);
	if (!post) return res.status(404).send("Post not found.");

	res.status(200).send(post.comments);
});

// Create a new comment on a particular post
router.post("/:id/comments", auth, async (req, res) => {
	const post = await Post.findById(req.params.id);
	if (!post) return res.status(404).send("Post not found.");

	const { error } = validateComment(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	await Post.updateOne(
		{ _id: req.params.id },
		{
			$push: {
				comments: {
					user: req.user.user,
					name: req.user.firstName + " " + req.user.lastName,
					profileImage: req.user.profileImage,
					comment: req.body.comment,
				},
			},
		}
	);
	return res.status(200).send(post.comments);
});

module.exports = router;
