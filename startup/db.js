const mongoose = require('mongoose');

module.exports = function() {
  const db = "mongodb://localhost/buzz";
  mongoose.connect(db)
    .then(() => console.info(`Connected to ${db}...`))
    .catch((err) => console.error(err))
}