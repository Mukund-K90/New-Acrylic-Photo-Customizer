const { status } = require("http-status");
const bcrypt = require("bcrypt");
const userDao = require("../dao/userDao");
const { errorResponse, successResponse } = require("../utils/apiResponse");
const { createUserSession } = require("../utils/jwt");
const { generateToken, checkToken, updateToken } = require("../dao/authTokenDao");
const { ERROR_MESSAGES } = require("../helper/errorMessages");
const { SUCCESS_MESSAGES } = require("../helper/successMessages");

//User Registration
const userRegister = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const isExistingUser = await userDao.findUser(email);
        if (isExistingUser) {
            return errorResponse(req, res, status.CONFLICT, ERROR_MESSAGES.USER_ALREADY_REGISTERED);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userDao.createUser({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        if (!newUser) {
            return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.ERROR_REGISTER_USER);
        }

        const sessionResponse = await createUserSession(newUser);
        await generateToken(newUser._id, sessionResponse.sessionToken);

        return successResponse(req, res, status.CREATED, SUCCESS_MESSAGES.USER_REGISTER, {
            token: sessionResponse.sessionToken,
            user: newUser,
        });
    } catch (error) {
        console.log(error);
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message);
    }
};

//User Login
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userDao.findUser(email);
        if (!user) {
            return errorResponse(req, res, status.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return errorResponse(req, res, status.UNAUTHORIZED, ERROR_MESSAGES.WRONG_PASSWORD);
        }

        const sessionResponse = await createUserSession(user);
        const token = await checkToken(user._id);
        if (token) {
            await updateToken(user._id, sessionResponse.sessionToken);
        }
        else {
            await generateToken(user._id, sessionResponse.sessionToken);
        }
        return successResponse(req, res, status.OK, SUCCESS_MESSAGES.USER_LOGGED_IN, { token: sessionResponse.sessionToken, user: user });
    } catch (error) {
        console.log(error);
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message);
    }
};

//change password
const changeUserPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;
        const user = await userDao.findUserById(userId);
        if (!user) {
            return errorResponse(req, res, status.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
        }
        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordMatch) {
            return errorResponse(req, res, status.UNAUTHORIZED, ERROR_MESSAGES.WRONG_PASSWORD);
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await userDao.changePassword(userId, hashedPassword);
        return successResponse(req, res, status.OK, SUCCESS_MESSAGES.PASSWORD_CHANGED);
    } catch (error) {
        console.log(error);
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message);
    }
}

module.exports = { userRegister, userLogin, changeUserPassword };
