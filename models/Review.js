const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ReviewSchema = new Schema(
  {
    r_review: { type: String, required: true },
    r_username: { type: String, required: true },
    r_rating: { type: Number, required: true },
    r_ingredient: { type: String, required: false },
    r_good: { type: String, required: false },
    ImageUrl: { type: String, require: true },
    r_paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
    r_userId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    r_reply: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);
const ReviewModel = model("Review", ReviewSchema);

module.exports = ReviewModel;
