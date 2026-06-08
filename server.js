const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const dbConnect = require("./config/db.config");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Server is running successfully",
  });
});

dbConnect();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server is running at port: " + PORT);
});
