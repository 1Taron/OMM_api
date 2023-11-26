const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PaymentSchema = new Schema(
  {
    p_store: { type: String, required: true },
    p_kind: { type: String, required: true },
    p_quantity: { type: Number, required: true },
    p_price: { type: Number, required: true },
    p_adress: { type: String, required: true },
    p_request: { type: String, required: false },
    p_ingredient: { type: String, required: false },
    p_payment: { type: String, required: true },
    p_userId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  },
  {
    timestamps: true,
  }
);
const PaymentModel = model("Payment", PaymentSchema);

module.exports = PaymentModel;
