const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const CustomerSchema = new Schema(
  {
    username: { type: String, required: true, min: 20, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true, min: 4 },
    tel: { type: String },
    email: { type: String },
    mainadress: { type: String },
    sideadress: { type: String },
    Check1: { type: Boolean },
    Check2: { type: Boolean },
    Check3: { type: Boolean },

    author: { type: Schema.Types.ObjectId, ref: "Customer" },
  },
  {
    timestamps: true,
  }
);

const CustomerModel = model("Customer", CustomerSchema);

module.exports = CustomerModel;
