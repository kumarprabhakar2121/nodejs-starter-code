// middleware/auth.js
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const isAuthorized = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // Get token from header
            const authHeader = req.header("Authorization") || req?.cookies?.token;
            if (!authHeader) {
                throw new AppError("TOKEN_MISSING", 401);
            }

            const token = authHeader.split(" ")[1];
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Add user info to request
            req.user = decoded;
            if (!req.user) {
                return next(new AppError("Not authenticated", 401));
            }

            if (!allowedRoles.includes(req.user.role)) {
                return next(
                    new AppError("Access denied", 403, { error: { currentUserRole: req.user.role } })
                );
            }
            next();
        } catch (error) {
            if (error.name === "JsonWebTokenError") {
                throw new AppError("INVALID_TOKEN", 401, { error });
            } else if (error.name === "TokenExpiredError") {
                throw new AppError("TOKEN_EXPIRED", 401, { error });
            }
            throw error;
        }

    };
};

module.exports = { isAuthorized };

