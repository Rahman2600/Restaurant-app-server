const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const restaurantsRouter = require("./routes/restaurants");
const bodyParser = require("body-parser");

const app = express();

require("dotenv").config({ path: "./config.env" });

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use("/", restaurantsRouter);
app.use(express.static("images"));
app.use("/static", express.static("images"));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
