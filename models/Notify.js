const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const NotifySchema = new Schema(
  {
    n_state: { type: String, required: true },
    n_eta: { type: String, required: true }, //estimated time of arrival
  },
  {
    timestamps: true,
  }
);
const NotifyModel = model("Notify", NotifySchema);

module.exports = NotifyModel;
