const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(`${process.env.MONGO_DB_URL}/${process.env.MONGO_DB_NAME}`, {});
        mongoose.set("strictQuery", false);
        mongoose.connection.on("connected", () => {
            logger.info("MongoDB connected...");
        });
        mongoose.connection.on("error", (err) => {
            logger.info("MongoDB connection error:", err);
        });
        mongoose.connection.on("disconnected", () => {
            logger.info("MongoDB disconnected...");
        });
        mongoose.connection.on("reconnected", () => {
            logger.info("MongoDB reconnected...");
        });
        mongoose.connection.on("close", () => {
            logger.info("MongoDB connection closed...");
        });
        mongoose.connection.on("timeout", () => {
            logger.info("MongoDB connection timeout...");
        });
        mongoose.connection.on("open", () => {
            logger.info("MongoDB connection opened...");
        });
        mongoose.connection.on("fullsetup", () => {
            logger.info("MongoDB full setup...");
        });
        mongoose.connection.on("all", () => {
            logger.info("MongoDB all...");
        });
        mongoose.connection.on("topologyDescriptionChanged", () => {
            logger.info("MongoDB topology description changed...");
        });
        mongoose.connection.on("serverOpening", () => {
            logger.info("MongoDB server opening...");
        });
        mongoose.connection.on("serverClosed", () => {
            logger.info("MongoDB server closed...");
        });
        mongoose.connection.on("serverHeartbeatStarted", () => {
            logger.info("MongoDB server heartbeat started...");
        });
        mongoose.connection.on("serverHeartbeatSucceeded", () => {
            logger.info("MongoDB server heartbeat succeeded...");
        });

        mongoose.connection.on("serverHeartbeatFailed", () => {
            logger.info("MongoDB server heartbeat failed...");
        });
        mongoose.connection.on("serverHeartbeatInterval", () => {
            logger.info("MongoDB server heartbeat interval...");
        });

        mongoose.connection.on("serverDescriptionChanged", () => {
            logger.info("MongoDB server description changed...");
        });

        mongoose.connection.on("MongooseServerSelectionError", () => {
            logger.info("MongoDB server selection error...");
        });
        mongoose.connection.on("MongooseConnectionError", () => {
            logger.info("MongoDB connection error...");
        });
        mongoose.connection.on("MongooseTimeoutError", () => {
            logger.info("MongoDB timeout error...");
        });
        mongoose.connection.on("MongooseServerClosedError", () => {
            logger.info("MongoDB server closed error...");
        });
        logger.info("Server connected to MongoDB...");
    } catch (error) {
        logger.info("Server is not connected to MongoDB...");
        logger.error(error);

        process.exit(1); // Exit process with failure
    }
}

module.exports = connectDB;

