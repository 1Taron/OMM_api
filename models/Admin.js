const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const AdminSchema = new Schema({
  username: { type: String, required: true, min: 4, unique: true },
  password: { type: String, required: true },
  store: { type: String, required: true },
});

const AdminModel = model("Admin", AdminSchema);

module.exports = AdminModel;
