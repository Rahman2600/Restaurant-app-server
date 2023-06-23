const fs = require("fs");
const posts = require("./earlsRestaurant.json");

let FOLDER_PATH = "/Users/I554934/Restaurant-app-server/instagramPostData";

let data = [];
for (let post of posts) {
  let caption = post.caption;
  let processedCaption;
  if (caption) {
    processedCaption = caption.replace(/(\r\n|\n|\r)/gm, " ");
  }
  let httpLinks = post.images;
  if (httpLinks) {
    for (let httpLink of httpLinks) {
      data.push({
        httpLink,
        label: processedCaption,
      });
    }
  }
}

fs.writeFile(
  `${FOLDER_PATH}\/processedData.json`,
  JSON.stringify(data),
  (err) => {
    if (err) {
      throw err;
    }
  },
  console.log("JSON data is saved.")
);
