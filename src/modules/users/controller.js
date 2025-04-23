const UserService = require("./service");

const createUser = async (req, res, next) => {
    try {
        next(await UserService.createUser(req.body));
    } catch (error) {
        next(error);
    }
};
const getUser = async (req, res, next) => {
    try {
        next(await UserService.getUser(req.params.userId));
    } catch (error) {
        next(error);
    }
};
const getUserById = async (req, res, next) => {
    try {
        next(await UserService.getUserById(req.params.userId));
    } catch (error) {
        next(error);
    }
};
const updateUserById = async (req, res, next) => {
    try {
        next(await UserService.updateUser(req.params.userId, req.body));
    } catch (error) {
        next(error);
    }
};
const deleteUserById = async (req, res, next) => {
    try {
        next(await UserService.deleteUser(req.params.userId));
    } catch (error) {
        next(error);
    }
};
const getAllUsers = async (req, res, next) => {
    try {
        next(await UserService.getAllUsers());
    } catch (error) {
        next(error);
    }
};

const getUserByEmail = async (req, res, next) => {
    try {
        next(await UserService.getUserByEmail(req.params.email));
    } catch (error) {
        next(error);
    }
};

const getMyProfile = async (req, res, next) => {
    try {
        next(await UserService.getMyProfile(req.user._id));
    } catch (error) {
        next(error);
    }
};

const updateMyProfile = async (req, res, next) => {
    try {
        next(await UserService.updateMyProfile(req.user._id, req.body));
    } catch (error) {
        next(error);
    }
};
const deleteMyProfile = async (req, res, next) => {
    try {
        next(await UserService.deleteMyProfile(req.user._id));
    } catch (error) {
        next(error);
    }
};

const changePassword = async (req, res, next) => {
    try {
        next(await UserService.changePassword(req.user._id, req.body));
    } catch (error) {
        next(error);
    }
};


module.exports = {
    createUser,
    getUser,
    updateUserById,
    deleteUserById,
    getAllUsers,
    getMyProfile,
    getUserByEmail,
    updateMyProfile,
    deleteMyProfile,
    getUserById,
    changePassword,
};
