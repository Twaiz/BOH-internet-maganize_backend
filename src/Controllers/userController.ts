import { NextFunction } from 'express';
import { factory } from './handlerController';
import { User } from '../Models';
import { AppError, catchAsync } from '../Utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type objType = Record<string, any>;

const filterObj = (obj: objType, ...allowedFields: string[]) => {
  const newObj: objType = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getMe = (req: any, _res: any, next: NextFunction) => {
  req.params.id = req.user.id;
  next();
};

const getUser = factory.getOne(User);

const updateMe = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm } = req.body;
  if (password || passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400,
      ),
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'surname', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export { getMe, getUser, updateMe };
