# Node.js Starter Code

This repository provides a comprehensive starter template for building Node.js applications with a modular architecture that is easy to scale and maintain.

## Features

- Modular and loosely coupled architecture
- Structured folder organization for better maintainability
- Standardized error handling with AppError
- Consistent API responses with AppResponder
- Authentication middleware
- MongoDB integration
- Request validation
- Logging system
- Environment configuration

## Requirements

- [Node.js](https://nodejs.org/) (version 14 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- MongoDB (local installation, Docker, or MongoDB Atlas)

## Getting Started

Follow these steps to get started with the project:

1. Clone the repository:
   ```bash
   git clone https://github.com/kumarprabhakar2121/nodejs-starter-code.git
   cd nodejs-starter-code
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy the `.env.example` file to create a new `.env` file
   ```bash
   cp .env.example .env
   ```
   - Update the MongoDB connection string in your `.env` file

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

This starter code can be used directly out of the box. You only need to set up your MongoDB connection link in the `.env` file. You can use MongoDB Atlas, Docker, or a locally installed MongoDB instance.

## Project Structure

```
./nodejs-starter-code
├── .env                        # Environment variables
├── .env.example                # Example environment variables template
├── eslint.config.mjs           # ESLint configuration
├── .gitignore                  # Git ignore file
├── logs                        # Application logs
├── nodemon.json                # Nodemon configuration
├── package.json                # Project dependencies and scripts
├── server.js                   # Entry point for the application
├── src
│   ├── app.js                  # Express app setup
│   ├── config                  # Configuration files
│   │   ├── globals.js          # Global configurations
│   │   └── logger.js           # Logger configuration
│   ├── database                # Database related files
│   │   └── connection.js       # MongoDB connection setup
│   ├── main.router.js          # Main router that connects all module routers
│   ├── middleware              # Custom middleware
│   │   └── auth.middleware.js  # Authentication middleware
│   ├── modules                 # Feature modules
│   │   ├── auth                # Authentication module
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.router.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.validation.js
│   │   └── user                # User module
│   │       ├── user.controller.js
│   │       ├── user.model.js
│   │       ├── user.router.js
│   │       ├── user.service.js
│   │       └── user.validation.js
│   └── utils                   # Utility functions
│       ├── AppError.js         # Custom error class
│       ├── AppResponder.js     # Standardized API response
│       ├── errorHandler.js     # Global error handler
│       ├── notifier.js         # Notification utility
│       ├── sortPayload.js      # Payload sorting utility
│       └── validationHelper.js # Validation helper functions
└── .vscode                     # VS Code configuration
    └── settings.json
```

## Adding New APIs

To add more APIs to the project:

1. Create a new folder in the `modules` directory inside `src`
2. Within your new module folder, create:
   - Router file (e.g., `newfeature.router.js`)
   - Controller file (e.g., `newfeature.controller.js`)
   - Service file (e.g., `newfeature.service.js`)
   - Validation file (e.g., `newfeature.validation.js`)
   - Model file if needed (e.g., `newfeature.model.js`)
3. Import and register your new router in `main.router.js`

Example structure for a new feature module:
```
src/modules/newfeature/
├── newfeature.controller.js
├── newfeature.model.js
├── newfeature.router.js
├── newfeature.service.js
└── newfeature.validation.js
```

## Key Components

### AppError

A custom error class that standardizes error handling throughout the application. It allows for consistent error responses with appropriate status codes and messages.

### AppResponder

A utility that ensures all API responses follow the same convention, making the API behavior predictable and easier to consume.

### Middleware

- `auth.middleware.js`: Handles authentication for protected routes

### Configuration

- `globals.js`: Contains global application settings
- `logger.js`: Configures application logging

## License

[MIT](LICENSE)

## Author

Prabhakar Kumar
