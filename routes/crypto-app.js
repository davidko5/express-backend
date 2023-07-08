const express = require("express");
const router = express.Router();
require("dotenv").config()

const COINTKETCAP_API_KEY = process.env.COINTKETCAP_API_KEY
// API key is on your stud email not your gmail !!!

router.get('/price-change', (req, res) => { //request for prices and changes of some currencies
    const axios = require('axios');

    let response = null;
    new Promise(async (resolve, reject) => {
        try {
            response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC,ETH,ADA,XRP&convert=USD', {
            headers: {
                'X-CMC_PRO_API_KEY': COINTKETCAP_API_KEY,
            },
            });
        } catch(ex) {
            response = null;
            console.log(ex);
            reject(ex);
        }
        if (response) {
            const json = response.data;
            res.send(json)
            resolve(json);
        }
    });
    
});

router.get('/historicals', (req, res) => {//request for historical data of some currencies
  const axios = require('axios');      // but with sandbox/testing apikey cause it is not free 

  let response = null;
  new Promise(async (resolve, reject) => {
      try {
          response = await axios.get('https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/quotes/historical?symbol=BTC,ETH,ADA,XRP&convert=USD', {
          headers: {
              'X-CMC_PRO_API_KEY': 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c',
          },
          });
      } catch(ex) {
          response = null;
          // error
          console.log(ex);
          reject(ex);
      }
      if (response) {
          const json = response.data;
          res.send(json)
          resolve(json);
      }
  });
  
});

module.exports = router;
