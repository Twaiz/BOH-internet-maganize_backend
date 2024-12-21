import { NextFunction } from 'express';
import { factory } from './handlerController';
import { User } from '../Models';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getMe = (req: any, _res: any, next: NextFunction) => {
  req.params.id = req.user.id;
  next();
};

const getUser = factory.getOne(User);

export { getMe, getUser };
