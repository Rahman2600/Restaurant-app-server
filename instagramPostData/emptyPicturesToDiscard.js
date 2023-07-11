let Restaurant = require("../models/restaurant.model");
const mongoose = require("mongoose");

const uri =
  "mongodb+srv://abdurrahmanmudasiru:SA121l%40m@cluster0.rbhxxoa.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;

let restaurantName = "Earls Kitchen";
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
  Restaurant.updateOne(
    { name: restaurantName },
    {
      $set: {
        picturesToDiscard: [],
      },
    }
  ).then(() => console.log("Emptied pictures to discard"));
});
