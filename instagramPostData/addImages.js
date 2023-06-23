const fs = require("fs");
const pictures = require("./processedData.json");
let Restaurant = require("../models/restaurant.model");
const axios = require("axios");
const mongoose = require("mongoose");

async function addImages() {
  let name = "Earls Kitchen";

  let IMAGE_FOLDER_PATH = "/Users/I554934/Restaurant-app-server/images";

  let existingImages = [];
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
    try {
      await downloadImage(httpLink, path);
      console.log(nextImageNum);
      nextImageNum++;
    } catch (error) {
      console.log("Couldn't download image");
    }
  }

  console.log("done");

  const uri =
    "mongodb+srv://abdurrahmanmudasiru:SA121l%40m@cluster0.rbhxxoa.mongodb.net/?retryWrites=true&w=majority";
  mongoose.connect(uri, { useNewUrlParser: true });
  const connection = mongoose.connection;

  connection.once("open", () => {
    console.log("MongoDB database connection established successfully");
    Restaurant.updateOne(
      { name: name },
      {
        $set: {
          picturesToAssign,
        },
      }
    ).then(() => console.log("Images added!"));
  });
}

function downloadImage(url, filePath) {
  return new Promise(function (resolve, reject) {
    axios({
      url,
      responseType: "stream",
      timeout: 10000,
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

addImages();
