const express = require("express");
const auth = require("../middleware/auth");
const { validatePost, Post } = require("../models/post");
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
            profileImage: req.user.profileImage
        }
    });

    await post.save();
    res.status(201).send(post);
});

router.get("/", auth, async (req, res) => {
    const posts = await Post.find().sort({ dateCreated: -1 });
    res.send(posts);
})

router.put("/:id/likes", auth, async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).send("Post not found.");

    try {
        post.likes.filter(async (like) => {
            if (like.user.toString() === req.user._id.toString()) {
                await post.likes.pull(like);
                await post.save()
                return res.sendStatus(200);
            }
        });
     
        await post.likes.push({
            user: req.user._id,
            name: req.user.firstName + " " + req.user.lastName
        });
        await post.save();
        return res.status(200).send("Post Liked")
    } catch (error) {
        console.log(error) 
        return res.send(error);
    }
});




module.exports = router;
