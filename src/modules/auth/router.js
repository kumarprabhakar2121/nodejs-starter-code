// auth/router.js
const express = require("express");
const router = express.Router();
const authController = require("./controller");
const {
    validateSignup,
    validateLogin,
    validateUserUpdate,
    validatePasswordChange,
} = require("./validation.js");
const { isAuthorized } = require("../../middleware/auth.js");

router.route("/signup").post(validateSignup, authController.signup);
router.route("/login").post(validateLogin, authController.login);

router.use(isAuthorized("user", "admin"));
router.route("/logout").get(authController.logout);

router
    .route("/my-account")
    .get(authController.getMyProfile)
    .put(validateUserUpdate, authController.updateMyProfile)
    .delete(authController.deleteMyProfile);

router.route("/my-account/password").put(validatePasswordChange, authController.changePassword);
router.route("/my-account/verify").get(authController.getVerificationTokenEmail);
router.route("/my-account/verify/:token").get(authController.verifyVerificationToken);

module.exports = router;

