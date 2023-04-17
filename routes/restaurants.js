const router = require("express").Router();
let Restaurant = require("../models/restaurant.model");

router.route("/").get((req, res) => {
  Restaurant.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const name = req.body.name;

  const newRestaurant = new Restaurant({
    name: name,
    menu: {
      name: "Menu",
      menuListItems: [],
      addons: [],
      type: "Section of sections",
    },
  });

  newRestaurant
    .save()
    .then(() => res.json("Restaurant added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/updateMenu").post((req, res) => {
  let { name, menu } = req.body;

  Restaurant.updateOne(
    { name: name },
    {
      $set: {
        menu,
      },
    }
  ).then(() => res.json("Menu updated!"));
});

module.exports = router;
