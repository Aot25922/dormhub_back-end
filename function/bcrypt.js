var bcrypt = require('bcrypt');

exports.cryptPassword = function (password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash
};

exports.comparePassword = function (plainPass, hashword) {
    return bcrypt.compareSync(plainPass, hashword);
};

