const fs = require("fs");
const Grid = require("gridfs-stream");
const mongoose = require("mongoose");
const mongodb = require("mongodb");

const uri =
  "mongodb+srv://abdurrahmanmudasiru:SA121l%40m@cluster0.rbhxxoa.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true });
const connection = mongoose.connection;
let gfs;

connection.once("open", () => {
  let db = connection.db;
  console.log("MongoDB database connection established successfully");
  gfs = Grid(connection.db, mongoose.mongo);
  const bucket = new mongodb.GridFSBucket(db, { bucketName: "myCustomBucket" });

  let FOLDER_PATH = "/Users/I554934/Restaurant-app-server/images/Earls Kitchen";

  let filenames = fs
    .readdirSync(FOLDER_PATH, {
      withFileTypes: true,
    })
    .map((item) => item.name);

  console.log("read files");

  for (let filename of filenames.slice(0, 1)) {
    fs.createReadStream(`${FOLDER_PATH}/${filename}`).pipe(
      bucket.openUploadStream(`${FOLDER_PATH}/${filename}`, {
        chunkSizeBytes: null,
        metadata: { field: "myField", value: "myValue" },
      }),
      console.log("uploaded")
    );
  }
});
