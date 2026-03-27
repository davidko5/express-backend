require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");

const mongoose = require("mongoose");
const config = require("./config");

const postsRouter = require("./routes/posts");
const utilsRouter = require("./routes/utils");
const cryptoAppRouter = require("./routes/crypto-app");
const posterAuthRouter = require("./routes/poster-auth");
const cookieParser = require("cookie-parser");
const { HttpError } = require("./utils/errors");

app.use(cookieParser());

app.use(logger("dev"));

mongoose.connect(config.dbUrl, {
  connectTimeoutMS: 30000,
});

const allowedOrigins = ["http://localhost:5173", "https://davidko5.github.io"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/posts", postsRouter);
app.use("/auth", posterAuthRouter);
// Conditionally adding test routes only if in testing mode
if (
  process.env.APP_MODE === "local_db_test_url" ||
  process.env.APP_MODE === "global_db_test_url"
) {
  app.use("/test", require("./routes/testing"));
}
app.use("/utils", utilsRouter);
app.use("/crypto-app", cryptoAppRouter);

// Global errror handler
app.use((err, req, res, next) => {
  if (err.response) {
    // axios error
    console.error("axios:", err.response.status, err.response.data);
  } else {
    console.error(err.message);
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message });
  } else if (err.response?.status) {
    // axios error from BE to BE call
    return res.status(err.response.status).json({ error: err.response.data });
  }
  res.status(500).json({ error: "Internal" });
});

const port = process.env.PORT || 5012;

app.listen(port, function () {
  console.log("Runnning on " + port);
});

module.exports = app;
