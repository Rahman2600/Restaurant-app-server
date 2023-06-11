const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const restaurantsRouter = require("./routes/restaurants");

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

app.use("/restaurants", restaurantsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
