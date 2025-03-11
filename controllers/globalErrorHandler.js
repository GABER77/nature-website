const AppError = require('../utils/appError');

const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (error) => {
  const value = error.errorResponse.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `${value} already exists, please try a unique value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token, Please login again', 401);

const handleJWTExpiredError = () =>
  new AppError('Your session is expired, Please login again', 401);

const sendErrorDev = (err, req, res) => {
  // 1) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }
  // 2) Rendered website
  console.log('❌ERROR:', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // Programming or 3rd party error: don't leak error details
    console.log('❌ERROR:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
  // 2) Rendered website
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
  // Programming or 3rd party error: don't leak error details
  console.log('❌ERROR:', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later',
  });
};

// When we give 4 argument to a middleware function, it will be recognize as error handling middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // 500 for internal server error
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    const errorName = err.name;
    let error = { ...err };
    error.message = err.message;

    if (errorName === 'CastError') error = handleCastErrorDB(error); // Invalid data like ID
    if (error.code === 11000) error = handleDuplicateFieldsDB(error); // unUnique value
    if (errorName === 'ValidationError') error = handleValidationErrorDB(error);
    if (errorName === 'JsonWebTokenError') error = handleJWTError();
    if (errorName === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
