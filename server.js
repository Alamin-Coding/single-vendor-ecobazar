const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const dbConnect = require("./config/db.config");
const authRoute = require("./routes/authRoute");
const productRoute = require("./routes/productRoute");

app.use(express.json());

app.get("/", (req, res) => {
	res.json({
		message: "Server is running successfully",
	});
});

app.use("/api/v1", authRoute);
app.use("/product", productRoute);

dbConnect();

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
	console.log("Server is running at port: " + PORT);
});
