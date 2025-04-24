// users/router.js
const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const { isAuthorized } = require("../../middleware/auth.middleware.js");
const { validateUserUpdate } = require("./user.validation");

// All routes require authentication
router.use(isAuthorized("admin"));
///home/prabhakar/Desktop/Coding/nodejs-starter-code/src/modules/users/user.router.js
router
    .route("/:userId")
    .get(userController.getUserById)
    .put(validateUserUpdate, userController.updateUserById)
    .delete(userController.deleteUserById);

router.route("/").get(userController.getAllUsers).post(userController.createUser);

router.route("/email/:email").get(userController.getUserByEmail);

module.exports = router;

