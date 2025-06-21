const User = require("../models/userModel");

const findUserByEmailFromDB = (email) => {
    return User.findOne({ email });
};

const findUserByEmailWithPasswordFromDB = (email) => {
    return User.findOne({ email }).select('+password');
};

const findUserByIdFromDB = (id) => {
    return User.findOne({ _id: id });
};

const createUserInDB = async (userData) => {
    const newUser = new User(userData);
    const savedUser = await newUser.save();
    return savedUser;
};

module.exports = {
    findUserByEmailFromDB,
    findUserByEmailWithPasswordFromDB,
    findUserByIdFromDB,
    createUserInDB
};
