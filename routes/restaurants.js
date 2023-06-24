const router = require("express").Router();
const axios = require("axios");
const fs = require("fs");
let Restaurant = require("../models/restaurant.model");
const SORT_ACTIONS = {
  MOVE_TO_UNASSIGNED: "moveToUnassigned",
  MOVE_TO_DISCARD: "moveToDiscard",
};

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

router.route("/addImages").post(async (req, res) => {
  let { name, pictures } = req.body;

  // {
  //   httpLink: ""
  //   label: ""
  // }

  let IMAGE_FOLDER_PATH = "/Users/I554934/Restaurant-app-server/images";

  let restaurant = await Restaurant.findOne({ name });
  console.log(restaurant.menu);
  let existingImages = [];
  console.log(typeof existingImages);
  let nextImageNum = existingImages.length + 1;

  let destDir = `${IMAGE_FOLDER_PATH}\/${name}`;
  fs.mkdirSync(destDir, { recursive: true });

  let picturesToAssign = [];

  for (let picture of pictures) {
    let { httpLink, label } = picture;
    let filename = `img${nextImageNum}.jpg`;
    picturesToAssign.push({
      filename,
      label,
    });
    let path = `${destDir}\/${filename}`;
    downloadImage(httpLink, path);
    nextImageNum++;
  }

  Restaurant.updateOne(
    { name: name },
    {
      $set: {
        picturesToAssign,
      },
    }
  ).then(() => res.json("Images added!"));
});

router.route("/updateImages").post(async (req, res) => {
  let { name, images } = req.body;

  Restaurant.updateOne(
    { name: name },
    {
      $set: {
        images,
      },
    }
  ).then(() => res.json("Images updated!"));
});

router.route("/sortPictures").post(async (req, res) => {
  let { name, sortAction, index } = req.body;

  let restaurant = await Restaurant.findOne({ name });
  let { picturesToAssign, picturesToDiscard } = restaurant;
  if (sortAction === SORT_ACTIONS.MOVE_TO_UNASSIGNED) {
    let pictureToMove = picturesToDiscard.at(index);
    picturesToDiscard.splice(index, 1);
    picturesToAssign.unshift(pictureToMove);
    Restaurant.updateOne(
      { name: name },
      {
        $set: {
          picturesToAssign,
          picturesToDiscard,
        },
      }
    ).then(() => res.json({ picturesToAssign, picturesToDiscard }));
  } else if (sortAction === SORT_ACTIONS.MOVE_TO_DISCARD) {
    let pictureToMove = picturesToAssign.at(index);
    picturesToAssign.splice(index, 1);
    picturesToDiscard.unshift(pictureToMove);
    Restaurant.updateOne(
      { name: name },
      {
        $set: {
          picturesToAssign,
          picturesToDiscard,
        },
      }
    ).then(() => res.json({ picturesToAssign, picturesToDiscard }));
  } else {
    res.json("Invalid sort action provided");
  }
});

function downloadImage(url, filePath) {
  return new Promise(function (resolve, reject) {
    axios({
      url,
      responseType: "stream",
    })
      .then((response) => {
        let writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        writer.on("close", () => {
          resolve("Image saved successfully");
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports = router;
