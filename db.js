const mongoose = require("mongoose");

const MONGO_URI = "mongodb://127.0.0.1:27017/Spotify-clone";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });
