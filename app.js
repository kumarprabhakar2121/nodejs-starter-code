const express = require("express");
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/database/connection.js");
require("./src/config/globals.js");

// Create the Express application
const app = express();

// Database connection
connectDB();

// Middleware setup
console.log("⚙️ Setting up middleware...");
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev", { stream: logger.stream }));
app.use(express.urlencoded({ extended: true }));

// Add a simple root route for testing
app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Routes
app.use(require("./router"));

// Export the app for use in server.js
module.exports = app;