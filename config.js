let config = {
  dbUrl:
    process.env.NODE_ENV === 'local_db_test'
      ? 'mongodb://localhost:27017/poster-app-test'
      : process.env.NODE_ENV === 'global_db_test'
      ? 'mongodb+srv://davidko5:zxcvbn333@cluster0.dabkofd.mongodb.net/poster-app-testing?retryWrites=true&w=majority'
      : 'mongodb+srv://davidko5:zxcvbn333@cluster0.dabkofd.mongodb.net/poster-app?retryWrites=true&w=majority',
};

module.exports = config;
