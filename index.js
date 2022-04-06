const express = require("express")
const app = express()
const cors = require("cors")

app.use(cors())
require("./startup/db")()
require("./startup/routes")(app)
require('./startup/validation')();

const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.info(`Listening on port ${port}...`));

module.exports = server;
