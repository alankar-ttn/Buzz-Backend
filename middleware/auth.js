const admin = require("../config/firebase-config");
const { User } = require("../models/user");

module.exports = async function (req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        const user = await User.findOne({
            uid: decodedToken.uid
        });
        if (!user) {
            return res.status(401).send("Unauthorized");
        }
        req.user = user;
        next(); 
    } catch (error) {
        return res.status(401).send("Unauthorized");
    }
};
