const express = require("express")
const app = express()
const cors = require("cors")

// Applying cors middleware
app.use(cors())

// Importing all the required modules
require("./startup/db")()
require("./startup/routes")(app)
require('./startup/validation')();
require('./startup/prod')(app);

const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.info(`Listening on port ${port}...`));

module.exports = server;
