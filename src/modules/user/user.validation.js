// users/validation.js
const { body, validationResult, param, query } = require("express-validator");
const { validationFailed } = require("../../utils/validationHelper");

const validateUserUpdate = [
    param("userId")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid User ID format"),
    body("email").optional().isEmail().withMessage("Please provide a valid email").normalizeEmail(),
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long"),
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
    body("newPassword")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters long")
        .trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

const validateUserCreation = [
    body("email").isEmail().withMessage("Please provide a valid email").normalizeEmail(),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .trim(),
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationFailed(errors);
        }
        next();
    }
];
const validateUserDeletion = [
    param("userId")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid User ID format"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationFailed(errors);
        }
        next();
    }
];
const validateUserId = [
    param("userId")
        .notEmpty()
        .withMessage("User ID is required")
        .isMongoId()
        .withMessage("Invalid User ID format"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationFailed(errors);
        }
        next();
    }
];

const validateUserFilters = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive integer"),
    query("limit")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Limit must be a positive integer"),
    query("searchText")
        .optional()
        .isString()
        .withMessage("Search text must be a string"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return validationFailed(errors);
        }
        next();
    }
];


module.exports = {
    validateUserUpdate,
    validatePasswordChange,
    validateUserCreation,
    validateUserDeletion,
    validateUserId,
    validateUserFilters,
};
