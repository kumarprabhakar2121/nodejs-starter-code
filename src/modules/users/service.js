const UserModel = require("./model");
const AppError = require("../../utils/AppError");
const AppResponder = require("../../utils/AppResponder");
const errorHandler = require("../../utils/errorHandler");
const bcrypt = require("bcrypt");

const createUser = async (data) => {
    try {
        const userDetails = await UserModel.findOne({ email: data.email });
        logger.debug(`userDetails for user ${data.email} found ${userDetails}`);
        if (userDetails) {
            throw new AppError("User already exist", 409);
        }

        const newUser = new UserModel({
            email: data.email,
            password: data.password,
        });

        await newUser.save();

        return AppResponder.responder("User created successfully", 201, { userId: newUser._id });
    } catch (error) {
        errorHandler("createUser system error", error);
    }
};

const getUser = async (userId) => {
    try {
        const userDetails = await UserModel.findById(userId);
        logger.debug(`userDetails for user ${userId} found ${userDetails}`);
        if (!userDetails) {
            throw new AppError("User not found", 404);
        }
        return AppResponder.responder("User retrieved successfully", 200, userDetails);
    } catch (error) {
        errorHandler("getUser system error", error);
    }
};

const updateUser = async (userId, data) => {
    try {
        const userDetails = await UserModel.findById(userId);
        logger.debug(`userDetails for user ${userId} found ${userDetails}`);
        if (!userDetails) {
            throw new AppError("User not found", 404);
        }
        const updatedUser = await UserModel.findByIdAndUpdate(userId, data, { new: true });
        return AppResponder.responder("User updated successfully", 200, updatedUser);
    } catch (error) {
        errorHandler("updateUser system error", error);
    }
};
const deleteUser = async (userId) => {
    try {
        const userDetails = await UserModel.findById(userId);
        logger.debug(`userDetails for user ${userId} found ${userDetails}`);
        if (!userDetails) {
            throw new AppError("User not found", 404);
        }
        await UserModel.findByIdAndDelete(userId);
        return AppResponder.responder("User deleted successfully", 200, null);
    } catch (error) {
        errorHandler("deleteUser system error", error);
    }
};
const getAllUsers = async (filters = {}) => {
    try {
        // pagination and filtering logic can be added here
        const { page = 1, limit = 10, searchText } = filters;
        const skip = (page - 1) * limit;
        const totalUsers = await UserModel.countDocuments();
        const totalPages = Math.ceil(totalUsers / limit);
        const regexFilter = searchText
            ? {
                $or: [
                    { email: { $regex: searchText, $options: "i" } },
                    { name: { $regex: searchText, $options: "i" } },
                ],
            }
            : {};
        const users = await UserModel.find(regexFilter).skip(skip).limit(limit);
        return AppResponder.responder("Users retrieved successfully", 200, {
            totalUsers,
            totalPages,
            currentPage: page,
            users,
        });
    } catch (error) {
        errorHandler("getAllUsers system error", error);
    }
};

const changePassword = async (userId, data) => {
    try {
        const userDetails = await UserModel.findById(userId);
        logger.debug(`userDetails for user ${userId} found ${userDetails}`);
        if (!userDetails) {
            throw new AppError("User not found", 404);
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        userDetails.password = hashedPassword;
        await userDetails.save();
        return AppResponder.responder("Password changed successfully", 200, userDetails);
    } catch (error) {
        errorHandler("changePassword system error", error);
    }
};

const getUserByEmail = async (email) => {
    try {
        const userDetails = await UserModel.find({ email });
        logger.debug(`userDetails for user ${email} found ${userDetails}`);
        if (!userDetails) {
            throw new AppError("User not found", 404);
        }
        return AppResponder.responder("User retrieved successfully", 200, userDetails);
    } catch (error) {
        errorHandler("getUserByEmail system error", error);
    }
};

module.exports = {
    createUser,
    getUser,
    updateUser,
    deleteUser,
    getAllUsers,
    changePassword,
    getUserByEmail,
};

