const jwt = require('jsonwebtoken');
const db = require('../db/index')
const { userAccount, Op } = db;
const secret = "TEST"
const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, secret, { expiresIn: 60 * 60 }, { algorithm: 'RS256' });
}

const authenticateToken = async (req, res, next) => {
    // const authHeader = req.headers['authorization']
    const token = req.cookies.token
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