const router = require("express").Router();
const serverless = require("serverless-http");

let Restaurant = require("../models/restaurant.model");

router.route("/").get((req, res) => {
  Restaurant.find()
    .then((restaurants) => res.json(restaurants))
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

router.route("/updateName").post((req, res) => {
  let { name, newName } = req.body;

  Restaurant.updateOne(
    { name: name },
    {
      $set: {
        name: newName,
      },
    }
  ).then(() => res.json("Restaurant updated!"));
});

router.route("/delete").delete((req, res) => {
  let { name } = req.body;

  Restaurant.deleteOne({ name: name }).then(() =>
    res.json("Restaurant deleted!")
  );
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
  ).then(() => {
    Restaurant.findOne({ name: name }).then((updatedRestaurant) => {
      res.json(updatedRestaurant.menu);
    });
  });
});

app.use(`/.netlify/functions/api`, router);

module.exports = router;
module.exports.handler = serverless(app);
