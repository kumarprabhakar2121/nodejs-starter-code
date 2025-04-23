const AppError = require("./src/utils/AppError");
const sortObjectKeys = require("./src/utils/sortPayload");
const router = require("express").Router();

// Define routes
const routes = [
    { path: "/api/auth", module: "./src/modules/auth/router" },
    { path: "/api/users", module: "./src/modules/users/router" },
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

router.use((_req, _res) => {
    throw new AppError(`METHOD: '${_req.method}' with URL: '${_req.originalUrl}' not exists `, 404, {
        error: "Route not found",
        meta: {},
    });
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

    if(result?.cookie){
        const THREE_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
        res.cookie(result.cookie.cookieKey, result.cookie.cookieValue, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            expires: new Date(Date.now() + THREE_DAYS_IN_MS),
        });
    }

    if (result instanceof AppError) {
        if(result.statusCode === 500){
            result.logErrorWithStackTrace();
        }
        response.error.message = result.message;
    }

    res.status(result.statusCode || 500).json(sortObjectKeys(response));
});

module.exports = router;
