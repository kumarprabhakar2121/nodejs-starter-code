// auth/controller.js
const authService = require("./auth.service");
const login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body);
        next(result);
    } catch (error) {
        next(error);
    }
};

const signup = async (req, res, next) => {
    try {
        const result = await authService.signup(req.body);
        next(result);
    } catch (error) {
        next(error);
    }
};
const getMyProfile = async (req, res, next) => {
    try {
        next(await authService.getMyProfile(req.user._id));
    } catch (error) {
        next(error);
    }
};

const updateMyProfile = async (req, res, next) => {
    try {
        next(await authService.updateMyProfile(req.user._id, req.body));
    } catch (error) {
        next(error);
    }
};
const deleteMyProfile = async (req, res, next) => {
    try {
        next(await authService.deleteMyProfile(req.user._id));
    } catch (error) {
        next(error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        next(await authService.changePassword(req.user._id, req.body));
    } catch (error) {
        next(error);
    }
};
const logout = async (req, res, next) => {
    try {
        next(await authService.logout());
    } catch (error) {
        next(error);
    }
};

const getVerificationTokenEmail = async (req, res, next) => {
    try {
        const result = await authService.getVerificationTokenEmail(req.user._id);
        next(result);
    } catch (error) {
        next(error);
    }
};
const verifyVerificationToken = async (req, res, next) => {
    try {
        const result = await authService.verifyVerificationToken(req.params.token);
        next(result);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    signup,
    getMyProfile,
    updateMyProfile,
    deleteMyProfile,
    changePassword,
    logout,
    getVerificationTokenEmail,
    verifyVerificationToken,
};

