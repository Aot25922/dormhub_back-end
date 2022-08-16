const jwt = require('jsonwebtoken');
const secret = "TEST"
const generateAccessToken = (userId) => {
    return jwt.sign({userId}, secret, { expiresIn: 60 * 60 },{ algorithm: 'RS256'});
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, secret, (err, user) => {
        console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user

        next()
    })
}

exports.generateAccessToken = generateAccessToken
exports.authenticateToken = authenticateToken