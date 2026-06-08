const mongoose = require("mongoose");

const dbConnect = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Mongodb connected");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

module.exports = dbConnect;
