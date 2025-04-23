 
const AppError = require("./AppError");

/**
 * Handles errors by wrapping non-AppError instances in an AppError
 * @param {string} msg - The error message to be displayed
 * @param {Error|AppError} error - The original error object
 * @throws {AppError} Throws either the original AppError or a new AppError with the provided message
 */
function errorHandler(msg = "INTERNAL_SERVER_ERROR", error = {}) {
    if (!(error instanceof AppError)) {
        throw new AppError(`${msg}: ${error?.message || ""}`, 500, { error });
    }
    throw error;
}

module.exports = errorHandler;
// This function is used to handle errors in a consistent way across the application.
