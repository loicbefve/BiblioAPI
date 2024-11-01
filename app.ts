import createError, { HttpError } from 'http-errors';
import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
require('dotenv').config();

import indexRouter from './routes';
import { config } from './config/config';

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use('/', indexRouter);
app.use('/fiches', express.static(config.fichesPath));
console.log(`Serving fiches from ${config.fichesPath}`);

// If none of the routes above match, I will return a 404 error that will be caught by the error handler
app.use(function (req:Request, res:Response, next: NextFunction) {
  next(createError(404));
});

// error handler
const errorHandler: ErrorRequestHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  // Set the status code for the response
  const errStatus = err instanceof HttpError ? err.status : 500;

  // Log the error (optional)
  console.error(err);

  // Send a JSON response
  res.status(errStatus).json({
    error: {
      message: err.message,
      status: errStatus,
      ...(req.app.get('env') === 'development' ? { stack: err.stack } : {})
    }
  });
};
app.use(errorHandler);

const port = config.apiPort || 3000;
app.listen(port);
console.log(`Server started on port ${port}`);
