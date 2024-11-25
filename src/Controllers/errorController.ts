import { NextFunction, Response, Request } from 'express';
import { AppError } from '../Utils';

interface ErrorWithDetails extends Error {
  statusCode?: number;
  status?: string;
  errmsg?: string;
  errors?: Record<string, { message: string }>;
  code?: number;
  path?: string;
  value?: string;
}

const handleCastError = (error: ErrorWithDetails): AppError => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

const handleDublicateError = (error: ErrorWithDetails): AppError => {
  const matchResult = String(error.errmsg).match(/(["'])(\\?.)*?\1/);

  if (!matchResult) {
    throw new Error('Invalid errmsg format');
  }

  const value = matchResult[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationError = (error: ErrorWithDetails): AppError => {
  const errors = Object.values(error.errors!).map(err => err.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = (): AppError => {
  return new AppError('Invalid token. Please log in again!', 401);
};

const handleTokenExpiredError = (): AppError => {
  return new AppError('Token has expired. Please log in again!', 401);
};

const sendErrorDev = (res: Response, error: AppError): void => {
  res.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProd = (res: Response, error: AppError): void => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.log('ERROR!!!', error);

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong...',
    });
  }
};

export const globalErrorHandler = (
  error: ErrorWithDetails,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(res, error as AppError);
  } else if (process.env.NODE_ENV === 'production') {
    let errorInstance: ErrorWithDetails = {
      ...error,
      name: error.name,
      message: error.message,
      errmsg: error.errmsg ?? '',
    };

    if (errorInstance.name === 'CastError') {
      errorInstance = handleCastError(errorInstance);
    }
    if (errorInstance.code === 11000) {
      errorInstance = handleDublicateError(errorInstance);
    }
    if (errorInstance.name === 'ValidationError') {
      errorInstance = handleValidationError(errorInstance);
    }
    if (errorInstance.name === 'JsonWebTokenError') {
      errorInstance = handleJWTError();
    }
    if (errorInstance.name === 'TokenExpiredError') {
      errorInstance = handleTokenExpiredError();
    }

    sendErrorProd(res, errorInstance as AppError);
  }
};
