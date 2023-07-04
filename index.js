const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const config = require("./config");
const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");

// mongoose.set("useNewUrlParser", true);
// mongoose.set("useFindAndModify", false);
// mongoose.set("useCreateIndex", true);

app.use(logger("dev"));

const dbUrl = config.dbUrl;

var options = {
    // keepAlive: true,
    connectTimeoutMS: 30000,
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
};

// mongoose.connect(dbUrl, options, (err) => {
//     if (err) console.log(err);
// });
mongoose.connect(dbUrl, options);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/posts", postsRouter);
app.use("/users", usersRouter);
// const playersRouter = require("./routes/players");
// app.use("/players", playersRouter);

const port = process.env.PORT || 3001;

app.listen(port, function () {
  console.log("Runnning on " + port);
});

module.exports = app;
