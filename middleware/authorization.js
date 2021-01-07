
const Global =  require('./../global_functions');
const jwt  = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'secret');

        req.user = decoded;
        req.user.token = token;

        next();

    } catch (error) {
        return Global.fail(res, {
            message: 'Unauthorized',
            content: 'No token provided'
        })
    }
};
