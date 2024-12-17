//? Imports
import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';

import { User, IUser, correctPassword } from '../Models';
import { AppError, catchAsync } from '../Utils';

const singToken = (id: string) => {
  const jwtSecretKey = process.env['JWT_SECRET'];
  const jwtExpiresIn = process.env['JWT_EXPIRES_IN'];
  if (!jwtSecretKey || !jwtExpiresIn) {
    console.log('jwtSecretKey and jwtExpiresIn is not defined');
    return;
  }

  return jwt.sign({ id }, jwtSecretKey, {
    expiresIn: jwtExpiresIn,
  });
};

const sendJwtToken = (
  user: IUser,
  statusCode: number,
  res: Response,
  message: string = '',
) => {
  const token = singToken(user.id);

  if (!token) {
    return res.status(500).json({
      status: 'error',
      message: 'Error generating token',
    });
  }

  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    data: {
      user,
    },
  });
};

//? Verification functions
const jwtVerifyPromisified = (token: string, secret: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, {}, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
};

interface DecodedToken {
  id: string;
  iat: number;
}

const protect = catchAsync(async (req, _res, next) => {
  let token: string;
  const headerAuth = req.headers.authorization;

  //* First
  if (headerAuth && headerAuth.startsWith('Bearer')) {
    token = headerAuth.split(' ')[1] || '';
  } else {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }

  //* Second
  const jwt_secret_code = process.env['JWT_SECRET'];
  if (!jwt_secret_code) {
    console.error('JWT_SECRET not found in environment variables.');
    return next(
      new AppError('Internal server error. JWT_SECRET not configured.', 500),
    );
  }

  let decoded: DecodedToken | unknown;
  try {
    decoded = await jwtVerifyPromisified(token, jwt_secret_code);
  } catch (err) {
    console.error('Error verifying JWT token:', err);
    return next(new AppError('Invalid token. Please log in again.', 401));
  }

  const isNoneDecoded =
    !decoded ||
    typeof decoded !== 'object' ||
    !('id' in decoded) ||
    !('iat' in decoded) ||
    typeof decoded.id !== 'string' ||
    typeof decoded.iat !== 'number';

  if (isNoneDecoded) {
    console.error('Decoded token does not have the expected structure.');
    return next(new AppError('Invalid token structure.', 401));
  }

  const decodedToken = decoded as DecodedToken;

  //* Third
  const freshUser = await User.findById(decodedToken.id);
  if (!freshUser) {
    console.error(`User with id ${decodedToken.id} not found.`);
    return next(
      new AppError('The user belonging to this token no longer exists.', 401),
    );
  }

  //* Fourth
  const passwordChangedAt = freshUser.passwordChangedAt;
  const isNonePasswordChangedAt = !(
    passwordChangedAt && passwordChangedAt instanceof Date
  );

  if (isNonePasswordChangedAt) {
    console.warn('No password change timestamp found for user.');
    return next(new AppError('Password change timestamp is missing.', 500));
  }

  const isChangedPasswordAfter =
    passwordChangedAt > new Date(decodedToken.iat * 1000);
  if (isChangedPasswordAfter) {
    console.warn('User changed password after token issued.');
    return next(
      new AppError('User recently changed password! Please log in again.', 401),
    );
  }

  req.user = freshUser;
  next();
});

const restrictTo = (...roles: string[]) => {
  return (req: { user: IUser }, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }

    next();
  };
};

//? Functions
const signUp = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm, role } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
  });

  sendJwtToken(newUser, 201, res, 'Account has been success created!');
});

const logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  const isCorrectPassword =
    user && (await correctPassword(password, user.password));

  if (!user || !isCorrectPassword) {
    return next(new AppError('Incorrect email or password!', 401));
  }

  sendJwtToken(
    user,
    200,
    res,
    'You have successfully logged into your account!',
  );
});

export { protect, restrictTo, signUp, logIn };
