const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let UserSchema = new Schema(
  {
    userName: {
      type: String,
    },
    image: {
      png: { type: String },
      webp: { type: String },
    },
  },
  { timestamps: true }
);

let User = mongoose.model("User", UserSchema);

module.exports = User;
