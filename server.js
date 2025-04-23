const cluster = require("cluster");
const os = require("os");
const app = require("./app");

const port = process.env.PORT || 3000;
const numCPUs = os.cpus().length;
const isDev = process.env.NODE_ENV === "development" || process.env.npm_lifecycle_event === "dev";

// Global error handlers to prevent app from exiting on uncaught errors
process.on("uncaughtException", (err) => {
    console.error("🔥 Uncaught Exception:", err);
    // Don't exit the process
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("⚠️ Unhandled Rejection at:", promise, "reason:", reason);
    // Don't exit the process
});

// Check if we're in development mode or production
if (isDev) {
    // Development mode - run single instance
    console.log("🧪 Running in development mode (single CPU)");
    startServer();
} else if (cluster.isMaster) {
    // Production mode with clustering - master process
    console.log(`🚀 Master process ${process.pid} is running in production mode`);
    console.log(`Creating ${numCPUs} worker processes...`);

    // Fork workers based on CPU cores
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Handle worker crashes
    cluster.on("exit", (worker, code, signal) => {
        console.log(`⚠️ Worker ${worker.process.pid} died (${signal || code}). Restarting...`);
        cluster.fork(); // Replace the dead worker
    });
} else {
    // Production mode with clustering - worker process
    startServer();
}

// Function to start the server (used in both dev and prod modes)
function startServer() {
    try {
        console.log("🚀 Starting server initialization...");

        // Start the server
        const server = app.listen(port, () => {
            if (isDev) {
                console.log(`🌟 Development server running on port ${port} (PID: ${process.pid})`);
            } else {
                console.log(`🌟 Worker ${process.pid} started and running on port ${port}`);
            }
        });

        // Handle server errors
        server.on("error", (error) => {
            console.error(`💥 Server error${isDev ? "" : ` in worker ${process.pid}`}:`, error);
        });

        console.log("🎉 Server startup complete, waiting for connections...");
    } catch (error) {
        console.log("💔 Server initialization failed:", {
            message: error.message,
            stack: error.stack,
        });
    }
}