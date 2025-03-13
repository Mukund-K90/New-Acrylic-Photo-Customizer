const User = require("../Model/User");

// Create a new user
module.exports.createUser = async (user) => {
    try {
        const newUser = new User(user);
        return await newUser.save();
    } catch (error) {
        throw Error(error);
    }
}

// Find a user
module.exports.findUser = async (email) => {
    try {
        return await User.findOne({
            email
        });
    }
    catch (error) {
        throw Error(error);
    }
}

//Find User By Id
module.exports.findUserById = async (id) => {
    try {
        return await User.findById(id);
    } catch (error) {
        throw Error(error);
    }
}

//change user password
module.exports.changePassword = async (id, password) => {
    try {
        return await User.findByIdAndUpdate(id, { password: password }, { new: true });
    } catch (error) {
        throw Error(error);
    }
}