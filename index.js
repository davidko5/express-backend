require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');

const mongoose = require('mongoose');
const config = require('./config');

const postsRouter = require('./routes/posts');
const usersRouter = require('./routes/users');
const utilsRouter = require('./routes/utils');
const cryptoAppRouter = require('./routes/crypto-app');

app.use(logger('dev'));

mongoose.connect(config.dbUrl, {
  connectTimeoutMS: 30000,
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
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
