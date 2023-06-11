const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const restaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    menu: {
      type: Schema.Types.Mixed,
    },
    images: {
      type: Schema.Types.Mixed,
    },
    imagesToAssign: {
      type: Schema.Types.Mixed,
    },
    discardedImages: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
