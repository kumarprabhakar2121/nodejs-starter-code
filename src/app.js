const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDB = require("./database/connection.js");
require("./config/globals.js");
const logger = require("./config/logger.js"); // assuming logger is here

// Create the Express application
const app = express();

try {
    // Database connection
    connectDB();

    // Middleware setup
    console.log("⚙️ Setting up middleware...");
    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());
    app.use(morgan("dev", { stream: logger.stream }));
    app.use(express.urlencoded({ extended: true }));

    // Routes
    app.get("/", (req, res) => {
        res.send("Server is running!");
    });

    app.use(require("./main.router.js"));

} catch (error) {
    console.error("❌ Error during app initialization:", error);
    // Optional: You might want to exit the process here
    process.exit(1); // Exit with failure
}

// Export the app for use in server.js
module.exports = app;
