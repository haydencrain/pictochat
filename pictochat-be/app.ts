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

// Frontend
const frontEndRouter = makeFrontEndRouter(WEB_CONTENT_DIR);
app.use('/', frontEndRouter);

// API
app.use('/api', apiRouter);

// Enable client-side routing
app.use('*', (req, res) => res.sendFile(path.join(WEB_CONTENT_DIR, 'index.html')));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


/// ERROR HANDLERS ///

// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

app.listen(PORT, () => console.log(`Pictochat server is listening on ${PORT}`));
