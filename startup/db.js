const mongoose = require('mongoose');

module.exports = function() {
  const db = "mongodb+srv://admin:admin@buzzz.erp96.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  mongoose.connect(db)
    .then(() => console.info(`Connected to ${db}...`))
    .catch((err) => console.error(err))
}