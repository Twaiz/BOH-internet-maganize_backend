//?Imports?\\
import express from 'express';
import morgan from 'morgan';

const app = express();

//?Middlewares?\\
app.use(express.json());
app.use(morgan('dev'));

//?Routes?\\

//?All errors?\\

//?Exports?\\
export { app };
