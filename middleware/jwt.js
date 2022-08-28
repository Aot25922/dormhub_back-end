const jwt = require('jsonwebtoken');
const secret = "TEST"
const generateAccessToken = (userId) => {
    return jwt.sign(userId , secret);
}

const authenticateToken = async (req, res, next) => {
    const token = req.cookies.token   
    if(req.path == "/login" && token == null){
        return next()
    }
    if (token == null ) return res.sendStatus(401)
    jwt.verify(token, secret, (err, userId) => {
        console.log(err)

        if (err) return res.sendStatus(403)

        req.userId = userId
        
        next()
    })
}

exports.generateAccessToken = generateAccessToken
exports.authenticateToken = authenticateToken