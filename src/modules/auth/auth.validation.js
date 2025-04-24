// auth/validation.js
const { body, validationResult, param } = require("express-validator");
const { validationFailed } = require("../../utils/validationHelper");

const validateSignup = [
    body("email").isEmail().withMessage("Please provide a valid email").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long").trim(),
    body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters long"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationFailed(errors);
        }
        next();
    }
];

const validateLogin = [
    body("email").isEmail().withMessage("Please provide a valid email").normalizeEmail(),
    body("password").isLength({ min: 6 }).notEmpty().withMessage("Password is required"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationFailed(errors);
        }
        next();
    }
];

const validateUserUpdate = [
    param("userId").notEmpty().withMessage("User ID is required").isMongoId().withMessage("Invalid User ID format"),
    body("email").optional().isEmail().withMessage("Please provide a valid email").normalizeEmail(),
    body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters long"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationFailed(errors);
        }
        next();
    }
];

const validatePasswordChange = [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters long").trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateSignup,
    validateLogin,
    validateUserUpdate,
    validatePasswordChange,
};
