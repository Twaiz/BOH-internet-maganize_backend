import express from 'express';
import { logIn, signUp } from '../Controllers';

const route = express.Router();

route.post('/signup', signUp);
route.post('/login', logIn);

export { route as authRoute };
