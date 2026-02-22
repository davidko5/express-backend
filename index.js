require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');

const mongoose = require('mongoose');
const config = require('./config');

const postsRouter = require('./routes/posts');
const utilsRouter = require('./routes/utils');
const cryptoAppRouter = require('./routes/crypto-app');

app.use(logger('dev'));

mongoose.connect(config.dbUrl, {
  connectTimeoutMS: 30000,
});

const allowedOrigins = [
  'http://localhost:5173',
  'https://davidko5.github.io'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/posts', postsRouter);
// Conditionally adding test routes only if in testing mode
if (
  process.env.APP_MODE === 'local_db_test_url' ||
  process.env.APP_MODE === 'global_db_test_url'
) {
  app.use('/test', require('./routes/testing'));
}
app.use('/utils', utilsRouter);
app.use('/crypto-app', cryptoAppRouter);

const port = process.env.PORT || 3001;

app.listen(port, function () {
  console.log('Runnning on ' + port);
});

module.exports = app;
