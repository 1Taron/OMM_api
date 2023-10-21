const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PayDeliverySchema = new Schema(
  {
    pd_kind: { type: String, required: true },
    pd_quantity: { type: Number, required: true },
    pd_price: { type: Number, required: true },
    pd_adress: { type: String, required: true },
    pd_context: { type: String, required: false },
    pd_ingredient: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);
const PayDeliveryModel = model("PayDelivery", PayDeliverySchema);

module.exports = PayDeliveryModel;
