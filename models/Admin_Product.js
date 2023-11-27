const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const Admin_ProductSchema = new Schema({
    category: { type: String, required: true },
    ProductName: { type: String, require: true },
    isChecked: { type: Boolean, require: true },
    Price: { type: String, require: true },
});

const AdminProductModel = model("AdminProduct", Admin_ProductSchema);

module.exports = AdminProductModel;
