import express from 'express';
import {
  logIn,
  signUp,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  getMe,
  getUser,
  updateMe,
} from '../Controllers';

const route = express.Router();

route.post('/signup', signUp);
route.post('/login', logIn);

route.post('/forgotPassword', forgotPassword);
route.post('/resetPassword/:token', resetPassword);

route.use(protect);

route.patch('/updatePassword', updatePassword);

route.get('/me', getMe, getUser);
route.patch('/updateMe', getMe, updateMe);

export { route as authRoute };
