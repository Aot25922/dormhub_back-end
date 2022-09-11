var _ = require('lodash');

const checkForEmptyString = (input) => {
    return _.isNull(input) || _.isEqual(input, "")
}

exports.checkForEmptyString = checkForEmptyString