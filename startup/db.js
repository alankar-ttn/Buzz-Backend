const mongoose = require("mongoose");

module.exports = function () {
	const db =
		"mongodb+srv://admin:admin@growthassignment.slf7dls.mongodb.net/?retryWrites=true&w=majority&appName=GrowthAssignment";
	mongoose
		.connect(db)
		.then(() => console.info(`Connected to ${db}...`))
		.catch((err) => console.error(err));
};
