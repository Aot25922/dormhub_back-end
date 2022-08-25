const jwt = require('jsonwebtoken');
const secret = "TEST"
const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, secret, { expiresIn: 60 * 60 }, { algorithm: 'RS256' });
}

const authenticateToken = async (req, res, next) => {
    const token = req.cookies.token
    console.log(req.cookies)
    if(req.path == "/login" && token == null){
        return next()
    }
    if (token == null ) return res.sendStatus(401)
    jwt.verify(token, secret, (err, user) => {
        console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user
        
        next()
    })
}

exports.generateAccessToken = generateAccessToken
exports.authenticateToken = authenticateToken