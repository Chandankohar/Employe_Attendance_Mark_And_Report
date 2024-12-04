const mongoose = require("mongoose");

 function databaseConnect() {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then((res) => {
      console.log("database connection successful");
    })
    .catch((err) => {
      console.log("database connection failed ", err);
    });
}

 module.exports = databaseConnect
