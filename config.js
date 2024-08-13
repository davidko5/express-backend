let config = {
    dbUrl:
    process.env.NODE_ENV === 'test' ? 'mongodb://localhost:27017/poster-app-test' : "mongodb+srv://davidko5:zxcvbn333@cluster0.dabkofd.mongodb.net/poster-app?retryWrites=true&w=majority",
  };
  
  module.exports = config;