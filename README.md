#  express backend for "Poster" app

Backend that serves needs of two of my projects: "Poster"(poster-frontend) and "Crypto-wallet"(crypto-app-landing-vue).In case of "Poster" it handles requests from frontend and communicates with MongoDB instance on Atlas, performing CRUD operations.In case of "Crypto-wallet" it acts as a proxy to prompt Coinmarketcap API as an easy way to satisfy CORS policy.

## Testing mode

It was created for poster frontend testing needs with Playwright. It relies on local mongodb database and provides database resetting endpoints so db state is same(empty) for every test.