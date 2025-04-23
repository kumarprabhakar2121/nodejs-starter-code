// logger.js
const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");
const path = require("path");
const fs = require("fs");

// Ensure logs directory exists
const logDir = "logs";
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

// Custom format for different log levels
const customLevelFormat = format((info) => {
    // For error and warn levels, include the full stack trace if available
    if (info.level === "error" || info.level === "warn") {
        if (info.stack) {
            info.message = `${info.message}\n${info.stack}`;
        }
        return info;
    }

    // For other levels, just include the message (no stack trace)
    if (info.stack) {
        delete info.stack;
    }
    return info;
})();

const consoleFormat = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    customLevelFormat,
    format.colorize(),
    format.printf(({ timestamp, level, message, ...meta }) => {
        // Extract stack trace for error logging, but keep it out of regular output
        const { stack, ...cleanMeta } = meta;

        // Level-specific emojis to improve log readability
        const levelEmojis = {
            error: "❌",
            warn: "⚠️",
            info: "ℹ️",
            http: "🌐",
            verbose: "📝",
            debug: "🔍",
            silly: "🤪",
        };

        // Get the appropriate emoji based on log level
        // eslint-disable-next-line no-useless-escape
        const emoji = levelEmojis[level.toLowerCase().replace(/[\[\]]/g, "")] || "";

        // Only include meta in the output if it contains meaningful data
        // Exclude common fields that don't provide additional context
        const meaningfulMeta = Object.fromEntries(
            Object.entries(cleanMeta).filter(([key]) => !["service", "timestamp"].includes(key))
        );

        // Format meta object if there are meaningful properties
        const metaString = Object.keys(meaningfulMeta).length
            ? `\n${JSON.stringify(meaningfulMeta, null, 2)}`
            : "";

        // Format stack trace if present and it's an error log
        const stackTrace = stack && level.includes("error") ? `\n${stack}` : "";

        // Get calling file/location information
        const callInfo = getCallerInfo();
        // Include function name in location info if available
        const functionPart = callInfo.function ? ` in ${callInfo.function}()` : "";
        const locationInfo = callInfo ? ` [${callInfo.file}:${callInfo.line}${functionPart}]` : "";

        // Check if message already has an emoji prefix
        const hasEmoji = /^\p{Emoji}/u.test(message);
        const formattedMessage = hasEmoji ? message : `${emoji} ${message}`;

        return `${timestamp} [${level}]${locationInfo}: ${formattedMessage}${metaString}${stackTrace}`;
    })
);

/**
 * Get caller file and line information for better log context
 * @returns {Object|null} Object containing file, line, and function info
 */
function getCallerInfo() {
    try {
        const err = new Error();
        const stack = err.stack.split("\n");

        // Skip logger-related functions to find the actual caller
        const projectRoot = process.cwd();
        const skipPatterns = [
            "node_modules",
            "internal/",
            "at getCallerInfo",
            "at format.printf",
            "logger.js",
            "winston",
            "Printf.template",
        ];

        // Find the first stack line that's from application code
        for (let i = 1; i < stack.length; i++) {
            const line = stack[i].trim();

            // Skip any lines matching our patterns
            if (skipPatterns.some((pattern) => line.includes(pattern))) {
                continue;
            }

            // This should be our actual caller
            const match =
                line.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/) ||
                line.match(/at\s+(.*):(\d+):(\d+)/);

            if (match) {
                // Format depends on whether we have a function name
                const hasFunction = match.length === 5;
                const filePath = hasFunction ? match[2] : match[1];
                const functionName = hasFunction ? match[1] : null;

                // Convert absolute path to project-relative path for cleaner output
                let displayPath = filePath;
                if (filePath.startsWith(projectRoot)) {
                    displayPath = filePath.substring(projectRoot.length);
                    // Ensure path starts with / for clarity
                    if (!displayPath.startsWith("/")) {
                        displayPath = "/" + displayPath;
                    }
                }

                return {
                    function: functionName,
                    file: displayPath,
                    line: hasFunction ? match[3] : match[2],
                };
            }
        }

        return null;
    } catch (_e) {
        // Silently fail if we can't get caller info
        return null;
    }
}

// Custom format for file logs (JSON for easier parsing)
const fileFormat = format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    customLevelFormat,
    format.json()
);

// Configure daily rotate file for all logs
const allLogsRotateTransport = new transports.DailyRotateFile({
    filename: path.join(logDir, "application-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxFiles: "10d", // Keep logs for the last 10 days
    auditFile: path.join(logDir, "audit.json"),
    format: fileFormat,
    zippedArchive: true, // Compress older logs to save space
});

// Configure daily rotate file specifically for errors
const errorLogsRotateTransport = new transports.DailyRotateFile({
    filename: path.join(logDir, "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxFiles: "10d", // Keep logs for the last 10 days
    level: "error",
    auditFile: path.join(logDir, "error-audit.json"),
    format: fileFormat,
    zippedArchive: true, // Compress older logs to save space
});

// Configure console transport (used in both dev and prod, but with different levels)
const consoleTransport = new transports.Console({
    format: consoleFormat,
    handleExceptions: true,
});

// Create the logger
const logger = createLogger({
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
    // defaultMeta: {
    //     service: process.env.SERVICE_NAME || "api-service"
    // },
    transports: [errorLogsRotateTransport, allLogsRotateTransport, consoleTransport],
    // Handle uncaught exceptions
    exceptionHandlers: [
        new transports.DailyRotateFile({
            filename: path.join(logDir, "exceptions-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            maxFiles: "10d",
            format: fileFormat,
            zippedArchive: true,
        }),
        consoleTransport,
    ],
    // Don't exit on handled exceptions
    exitOnError: false,
    // Handle promise rejections
    rejectionHandlers: [
        new transports.DailyRotateFile({
            filename: path.join(logDir, "rejections-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            maxFiles: "10d",
            format: fileFormat,
            zippedArchive: true,
        }),
        consoleTransport,
    ],
});

// Log rotation events
allLogsRotateTransport.on("rotate", function (oldFilename, newFilename) {
    logger.info(`Log rotation happened. Old: ${oldFilename}, New: ${newFilename}`);
});

// Add middleware-compatible stream
logger.stream = {
    write: (message) => {
        logger.info(message.trim());
    },
};

// Add a simple stream for Express/Morgan integration if needed
logger.stream = {
    write: (message) => {
        logger.info(message.trim());
    },
};

module.exports = logger;
