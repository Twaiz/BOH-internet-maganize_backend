export { globalErrorHandler } from './errorController';
export { getCatalogs } from './catalogController';
export {
  protect,
  restrictTo,
  signUp,
  logIn,
  forgotPassword,
  resetPassword,
  updatePassword,
} from './authController';
export { getMe, getUser } from './userController';
export { factory } from './handlerController';
