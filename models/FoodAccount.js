const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const FoodAccountSchema = new Schema(
    {
        Account: { type: Number },
        Sangchu_index: { type: Number }

    },
    {
        timestamps: true,
    }
);

const AccountModel = model("FoodAccount", FoodAccountSchema);

module.exports = AccountModel;
