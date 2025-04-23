const AppError = require("./AppError");

function validationFailed(errors) {
    throw new AppError("API_VALIDATION_ERROR", 400, {
        error: { apiValidationError: errors.array() },
    });
}

module.exports = {
    validationFailed,
};
