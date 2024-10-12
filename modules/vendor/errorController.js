// controllers/errorController.js
const globalErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        message: err.message
    });
};

export default globalErrorHandler;
