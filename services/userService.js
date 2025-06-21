const bcrypt = require('bcryptjs');

const validatePassword = (userEnteredPassword, actualPassword) => {
    return bcrypt.compare(userEnteredPassword, actualPassword);
};

module.exports = {
    validatePassword
};
