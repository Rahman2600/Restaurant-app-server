const router = require("express").Router();
const axios = require("axios");
const fs = require("fs");
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
  let { name, images: newImageURLs } = req.body;

  let IMAGE_FOLDER_PATH = "/Users/I554934/images";

  let restaurant = await Restaurant.findOne({ name });
  let existingImages = restaurant.images;

  let nextImageNum = existingImages.length + 1;

  for (let url of newImageURLs) {
    let path = `${IMAGE_FOLDER_PATH}\/img${nextImageNum}.jpg`;
    downloadImage(url, path);
    nextImageNum++;
  }

  Restaurant.updateOne(
    { name: name },
    {
      $set: {
        images: existingImages
          ? existingImages.concat(newImageURLs)
          : newImageURLs,
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

router.route("/sortImages").post(async (req, res) => {
  let { name, imagesToAssign, discardedImages } = req.body;

  Restaurant.updateOne(
    { name: name },
    {
      $set: {
        imagesToAssign,
        discardedImages,
      },
    }
  ).then(() => res.json("Image Sort updated!"));
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
