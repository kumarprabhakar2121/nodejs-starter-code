const UserModel = require("../user/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AppError = require("../../utils/AppError");
const AppResponder = require("../../utils/AppResponder");
const errorHandler = require("../../utils/errorHandler");
const { sendActivationEmail } = require("../../utils/notifier");

const login = async (data) => {
    try {
        const userDetails = await UserModel.findOne({ email: data.email });
        // logger.debug(`userDetails for user ${data.email} found ${userDetails}`);
        if (!userDetails) {
            throw new AppError("User doesnt exist", 401);
        }
        const isPasswordValid = await bcrypt.compare(data.password, userDetails.password);
        if (!isPasswordValid) {
            throw new AppError("Incorrect  password", 401);
        }
        const token = jwt.sign(
            { _id: userDetails._id, email: userDetails.email, role: userDetails.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        return AppResponder.responder(
            "Login successful",
            200,
            { token },
            {
                cookieKey: "token",
                cookieValue: `Bearer ${token}`,
            }
        );
    } catch (error) {
        errorHandler("login system error", error);
    }
};

const signup = async (data) => {
    try {
        const userDetails = await UserModel.findOne({ email: data.email });
        // logger.debug(`userDetails for user ${data.email} found ${userDetails}`);
        if (userDetails) {
            throw new AppError("User already exist", 409);
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
        await UserModel.create(data);
        delete data.password; // Remove password from response
        return AppResponder.responder("User created successfully", 201, { user: data });
    } catch (error) {
        errorHandler("signup system error", error);
    }
};

const changePassword = async (userId, data) => {
    try {
        const userDetails = await UserModel.findById(userId);
        // logger.debug(`userDetails for user ${userId} found ${userDetails}`);
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
const getMyProfile = async (userId) => {
    try {
        const userDetails = await UserModel.findById(userId).select("-_id -password").lean();
        // logger.debug(`userDetails for user ${userId} found::`,userDetails);
        if (!userDetails) {
            throw new AppError("User not found", 404);
        }
        return AppResponder.responder("User retrieved successfully", 200, userDetails);
    } catch (error) {
        errorHandler("getUser system error", error);
    }
};

const updateMyProfile = async (userId, data) => {
    try {
        const userDetails = await UserModel.findById(userId);
        // logger.debug(`userDetails for user ${userId} found ${userDetails}`);
        if (!userDetails) {
            throw new AppError("User not found", 404);
        }
        const updatedUser = await UserModel.findByIdAndUpdate(userId, data, { new: true });
        return AppResponder.responder("User updated successfully", 200, updatedUser);
    } catch (error) {
        errorHandler("updateUser system error", error);
    }
};
const deleteMyProfile = async (userId) => {
    try {
        const userDetails = await UserModel.findById(userId);
        // logger.debug(`userDetails for user ${userId} found ${userDetails}`);
        if (!userDetails) {
            throw new AppError("User not found", 404);
        }
        await UserModel.findByIdAndDelete(userId);
        return AppResponder.responder("User deleted successfully", 200, null);
    } catch (error) {
        errorHandler("deleteUser system error", error);
    }
};

const logout = async () => {
    try {
        return AppResponder.responder("Logout successful", 200, null, { cookieKey: "token", cookieValue: "" });
    } catch (error) {
        errorHandler("logout system error", error);
    }
};

const getVerificationTokenEmail = async (userId) => {
    try {
        const userDetails = await UserModel.findById(userId);
        if (!userDetails) {
            throw new AppError("User not found", 404);
        }
        const generateVerificationToken = await bcrypt.hash(userId, 10);
        userDetails.verificationToken = generateVerificationToken;
        userDetails.verificationTokenExpiry = Date.now() + 3600000; // 1 hour

        await sendActivationEmail(userDetails.email, generateVerificationToken);

        await userDetails.save();
        return AppResponder.responder("Verification token generated successfully", 200, {
            verificationToken: generateVerificationToken,
        });
    } catch (error) {
        errorHandler("getUser system error", error);
    }
};

const verifyVerificationToken = async (token) => {
    try {
        const userDetails = await UserModel.findOne({ verificationToken: token });

        if (!userDetails) {
            throw new AppError("Invalid verification token", 400);
        }
        if (userDetails.verificationTokenExpiry < Date.now()) {
            throw new AppError("Verification token expired", 400);
        }
        userDetails.isVerified = true;
        userDetails.verificationToken = null;
        userDetails.verificationTokenExpiry = null;
        await userDetails.save();
        return AppResponder.responder("Verification token verified successfully", 200);
    } catch (error) {
        errorHandler("verifyVerificationToken system error", error);
    }
};

module.exports = {
    login,
    signup,
    changePassword,
    getMyProfile,
    updateMyProfile,
    deleteMyProfile,
    logout,
    getVerificationTokenEmail,
    verifyVerificationToken,
};
