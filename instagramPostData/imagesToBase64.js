let Restaurant = require("../models/restaurant.model");
const mongoose = require("mongoose");

const uri =
  "mongodb+srv://abdurrahmanmudasiru:SA121l%40m@cluster0.rbhxxoa.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
  Restaurant.find()
    .then((restaurants) => {
      let menu = restaurants[0].menu;
      console.log(menu);
      changeSrcToBase64(menu);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

function changePictureSrcsToBase64(menuListItem) {
  let menuListItems = menuListItem.menuListItems;
}
