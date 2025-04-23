// users/router.js
const express = require("express");
const router = express.Router();
const userController = require("./controller");
const { isAuthorized } = require("../../middleware/auth");
const { validateUserUpdate } = require("./validation");

// All routes require authentication
router.use(isAuthorized("admin"));

router
    .route("/:userId")
    .get(userController.getUserById)
    .put(validateUserUpdate, userController.updateUserById)
    .delete(userController.deleteUserById);

router.route("/").get(userController.getAllUsers).post(userController.createUser);

router.route("/email/:email").get(userController.getUserByEmail);

module.exports = router;

