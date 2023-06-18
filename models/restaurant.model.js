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
    picturesToAssign: {
      type: Schema.Types.Mixed,
    },
    picturesToDiscard: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
