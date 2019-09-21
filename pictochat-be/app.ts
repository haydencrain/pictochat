import process from 'process';
import path from 'path';
import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { Sequelize } from 'sequelize';
import { apiRouter } from './routes/api-route';
import { makeFrontEndRouter } from './routes/front-end-route';
import { makeCORSMiddleware } from './middleware/cors-middleware';
import { SequelizeConnectionService } from './services/sequelize-connection-service';
import { loadTestData } from './utils/load-test-data';
import { initialisePassport } from './middleware/passport-middleware';

// CONSTANTS
const PORT = process.env.PICTOCHAT_BACKEND_PORT || 443;
// Default path is relative to the compiled app.js file's location in the build directory
const WEB_CONTENT_DIR = process.env.PICTOCHAT_FRONTEND_DIR || path.join(__dirname, '../pictochat-fe');
const FRONTEND_REQUEST_ORIGIN = process.env.PICTOCHAT_FRONTEND_REQUEST_ORIGIN || 'http://localhost:3000';
const API_PATH = '/api';

// Database Connection

const sequelize: Sequelize = SequelizeConnectionService.getInstance();
sequelize
  .authenticate()
  .then(async () => {
    console.log('Sucessfully connected to pictochat database');
    // FIXME: Move test data loading into testing framework
    // (cleaner to always assume NODE_ENV = production when app.ts is run)
    if (process.env.NODE_ENV !== 'production') {
      await loadTestData();
    }
  })
  .catch(error => console.log('An error occured attempting to connect to the pictochat database', error));

//// APP ////
const app = express();

/// MIDDLEWARE ///
app.use(makeCORSMiddleware(FRONTEND_REQUEST_ORIGIN));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(initialisePassport());

/// ROUTES ///

// Frontend
const frontEndRouter = makeFrontEndRouter(WEB_CONTENT_DIR);
app.use('/', frontEndRouter);

// API
app.use(API_PATH, apiRouter);

// Enable client-side routing
app.use('*', (req, res, next) => {
  // Prevents redirects to front-end when clients attempt to request non-existant API URLs
  if (!req.baseUrl.startsWith(`${API_PATH}/`)) {
    return res.sendFile(path.join(WEB_CONTENT_DIR, 'index.html'));
  }
  next();
});

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
