const express = require("express");
const users = require("../routes/users");
const posts = require("../routes/posts");

module.exports = function (app) {
	app.use(express.json());
	app.use("/api/auth/", users);
	app.use("/api/posts/", posts);
};
