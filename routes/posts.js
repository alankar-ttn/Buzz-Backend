const express = require("express");
const auth = require("../middleware/auth");
const { validatePost, Post } = require("../models/post");
const { validateComment } = require("../services/validation");
const router = express.Router();

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

router.get("/", auth, async (req, res) => {
	const posts = await Post.find().sort({ dateCreated: -1 });
	res.send(posts);
});

router.post("/:id/likes", auth, async (req, res) => {
	const post = await Post.findById(req.params.id);
	if (!post) return res.status(404).send("Post not found.");

	await Post.updateOne(
		{ _id: req.params.id },
		{
			$push: {
				likes: {
					user: req.user.user,
					name: req.user.firstName + " " + req.user.lastName,
				},
			},
		}
	);
	return res.status(200).send(post.likes);
});

router.post("/:id/:likeId/unlikes", auth, async (req, res) => {
	const post = await Post.findById(req.params.id);
	if (!post) return res.status(404).send("Post not found.");

    const like = await Post.findById(req.params.id);
    console.log(like)
    console.log(like.likes.find(like => like._id === req.params.likeId)); 
    if (!like) return res.status(404).send("Like not found.");

	await Post.updateOne(
		{ _id: req.params.id },
		{
			$pull: {
				likes: {
					_id: req.params.likeId,
				},
			},
		}
	);
	return res.status(200).send("Post Unliked");
});

router.get("/:id/comments", auth, async (req, res) => {
	const post = await Post.findById(req.params.id);
	if (!post) return res.status(404).send("Post not found.");

	res.status(200).send(post.comments);
});

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
					comment: req.body.comment
				}, 
			},
		}
	);
	return res.status(200).send(post.comments);
});

module.exports = router;
