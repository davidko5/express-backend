console.log(process.env[process.env.APP_MODE]);
let config = {
  dbUrl: process.env[process.env.APP_MODE],
};

module.exports = config;
