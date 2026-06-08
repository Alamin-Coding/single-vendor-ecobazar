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

app.post("/api/v1/register", (req, res) => {
  const { email, password, confirmPassword, acceptTerms } = req.body;
  if (!email || !password || !confirmPassword || acceptTerms === undefined) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      message: "Passwords do not match",
    });
  }

  if (typeof acceptTerms !== "boolean" || acceptTerms === false) {
    return res.status(400).json({
      message: "You must accept the terms and conditions",
    });
  }

  res.json({
    message: "User registration successful",
    data: req.body,
  });
});

dbConnect();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server is running at port: " + PORT);
});
