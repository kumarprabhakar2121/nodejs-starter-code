// utils/AppError.js

const httpCodes = {
    2: true,
    4: false,
    5: false,
};

class AppError extends Error {
    constructor(message, statusCode, options = {}) {
        super(message);

        this.message = message;
        this.statusCode = statusCode;
        this.status = httpCodes[`${statusCode}`[0]];
        this.data = null;
        this.error = options.error || {};
        this.error.message = `${message}`;
        // this.error.stackTrace = this.stack;
        if (parseInt(statusCode / 100) === 5) {
            this.error.stackTrace = this.stack;
        }
    }
    /**
     * Log a detailed error with stack trace in a formatted single log entry
     */
    logErrorWithStackTrace() {
        logger.error(
            [
                "",
                "========== ERROR LOG START ==========", // Decorative header
                `🧾 Error Type  : ${this.constructor.name}`,
                `💬 Message     : ${this.message}`,
                `📊 Status      : ${this.status}`,
                `📟 Status Code : ${this.statusCode}`,
                "🧵 Stack Trace :",
                `  ${this.stack?.replace(/\n/g, "\n  ")}`, // Indent stack trace lines
                "=========== 🔚 ERROR LOG END 🔚 ===========",
                "",
            ].join("\n")
        );
    }
}

module.exports = AppError;
