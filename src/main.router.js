const AppError = require("./utils/AppError");
const sortObjectKeys = require("./utils/sortPayload");
const router = require("express").Router();

// Define routes
const routes = [
    { path: "/api/auth", module: "./modules/auth/auth.router.js" },
    { path: "/api/users", module: "./modules/user/user.router.js" }
];

// Load and apply routes
routes.forEach(({ path, module }) => {
    try {
        const route = require(module);
        router.use(path, route);
    } catch (error) {
        logger.error(`Failed to load route ${module}:`, error);
    }
});

router.use((_req, _res, next) => {
    console.log("fsfgv");
    next(
        new AppError("ROUTE_NOT_EXISTS", 404)
    );
});

router.use((result, req, res, _next) => {
    const response = {
        message: result.message,
        status: result.status,
        statusCode: result.statusCode,
        error: result.error,
        meta: {
            path: req.originalUrl,
            method: req.method,
            requestId: req.headers.requestId || null,
        },
        data: result.data,
    };

    if (result?.cookie) {
        const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
        res.cookie(result.cookie.cookieKey, result.cookie.cookieValue, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            expires: new Date(Date.now() + THREE_DAYS_IN_MS),
        });
    }

    if (result instanceof AppError) {
        if (parseInt(result.statusCode / 100) === 5) {
            result.logErrorWithStackTrace();
        }
        response.error.message = result.message;
    }

    res.status(result.statusCode || 500).json(sortObjectKeys(response));
});

module.exports = router;
