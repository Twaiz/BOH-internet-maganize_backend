import express from 'express';
import { logIn, signUp, forgotPassword } from '../Controllers';

const route = express.Router();

route.post('/signup', signUp);
route.post('/login', logIn);

route.post('/forgotPassword', forgotPassword);

export { route as authRoute };
