import express from 'express';
import { signUp } from '../Controllers';

const route = express.Router();

route.post('/signup', signUp);

export { route as authRoute };
