import express from 'express';
import {
  logIn,
  signUp,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} from '../Controllers';

const route = express.Router();

route.post('/signup', signUp);
route.post('/login', logIn);

route.post('/forgotPassword', forgotPassword);
route.post('/resetPassword/:token', resetPassword);

route.use(protect);

route.patch('/updatePassword', updatePassword);

export { route as authRoute };
