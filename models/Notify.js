const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const NotifySchema = new Schema(
  {
    n_state: { type: String, required: true },
    n_eta: { type: String, required: true },
    n_store: { type: String, required: true },
    n_userId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  },
  {
    timestamps: true,
  }
);
const NotifyModel = model("Notify", NotifySchema);

module.exports = NotifyModel;
