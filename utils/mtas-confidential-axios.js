const axios = require("axios");

const mtasConfidentialAxios = axios.create({
  baseURL: process.env.MTAS_URL,
  auth: {
    username: process.env.MTAS_APP_ID,
    password: process.env.MTAS_SECRET,
  },
});

module.exports = { mtasConfidentialAxios };