// utils/AppError.js
class AppError extends Error {
    constructor(message, statusCode, status = 'error') {
        super(message);
        this.statusCode = statusCode;
        this.status = status;
        this.isOperational = true; // To differentiate operational errors from programming or other unknown errors

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;
