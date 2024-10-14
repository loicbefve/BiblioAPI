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

// If none of the routes above match, I will return a 404 error that will be caught by the error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
const errorHandler: ErrorRequestHandler = function (err: Error, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  let errStatus = err instanceof HttpError ? err.status : 500;
  res.status(errStatus || 500);
  res.render('error');
}
app.use(errorHandler);

app.listen(3000);
