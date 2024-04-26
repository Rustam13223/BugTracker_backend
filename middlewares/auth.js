const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).end()
        }

        const accessToken = authHeader.split(' ')[1] // authHeader = "Bearer TOKEN"
        if (!accessToken) {
            return res.status(401).end()
        }

        const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
        if (!userData) {
            return res.status(401).end()
        }

        req.authUser = userData
        next()

    } catch(e) {
        return res.status(500).end()
    }
}

module.exports = auth