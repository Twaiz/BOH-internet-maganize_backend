import express from 'express';
import { logIn, signUp, forgotPassword, resetPassword } from '../Controllers';

const route = express.Router();

route.post('/signup', signUp);
route.post('/login', logIn);

route.post('/forgotPassword', forgotPassword);
route.post('/resetPassword/:token', resetPassword);

export { route as authRoute };
