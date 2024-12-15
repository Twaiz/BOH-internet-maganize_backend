import { IUser } from 'Controllers';

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
