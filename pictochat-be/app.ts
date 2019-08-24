import process from 'process';
import path from 'path';
import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { apiRouter } from './routes/api-route';
import { makeFrontEndRouter } from './routes/front-end-route';
import { makeCORSMiddleware } from './middleware/cors-middleware';

// CONSTANTS
const PORT = process.env.PICTOCHAT_BACKEND_PORT || 443;
// Default path is relative to the compiled app.js file's location in the build directory
const WEB_CONTENT_DIR = process.env.PICTOCHAT_FRONTEND_DIR || path.join(__dirname, '../pictochat-fe');
const FRONTEND_REQUEST_ORIGIN = process.env.PICTOCHAT_FRONTEND_REQUEST_ORIGIN || '';
console.log('WEB_CONTENT_DIR: ' + WEB_CONTENT_DIR);


//// APP ////
const app = express();


/// MIDDLEWARE ///

app.use(makeCORSMiddleware(FRONTEND_REQUEST_ORIGIN));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


/// ROUTES ///

app.use('/', makeFrontEndRouter(WEB_CONTENT_DIR));
app.use('/api', apiRouter);

/// ERROR HANDLERS ///

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.listen(PORT, () => console.log(`Pictochat server is listening on ${PORT}`));
