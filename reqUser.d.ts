import { IUser } from 'Models';

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
