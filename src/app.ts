//?Imports?\\
import express from 'express';
import morgan from 'morgan';

import { AppError } from './Utils';
import { globalErrorHandler } from './Controllers';
import { authRoute, catalogRoute } from './Routes';

const app = express();

// //?Varibles?\\
const URL_CATALOG = '/api/v1/catalog';
const URL_USERS = '/api/v1/users';

//?Middlewares?\\
app.use(express.json());
app.use(morgan('dev'));

// //?Routes?\\
app.use(URL_CATALOG, catalogRoute);
app.use(URL_USERS, authRoute);

//?Error Handling -> Not Found Route?\\
app.all('*', (req, _res, next) => {
  const errorMessage = `Ooops... Can't find ${req.originalUrl} on this server❗`;
  const errorStatusCode = 404;

  next(new AppError(errorMessage, errorStatusCode));
});

//?All Errors?\\
app.use(globalErrorHandler);

//?Exports?\\
export { app };
