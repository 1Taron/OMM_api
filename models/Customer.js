const mongoose = require('mongoose')

const { Schema, model } = mongoose;

const CustomerSchema = new Schema({
    resusername: { type: String, required: true, min: 20, unique: true },
    respassword: { type: String, required: true },
    name: { type: String, required: true, min: 4 },
    tel: { type: String },
    email: { type: String },

    author: { type: Schema.Types.ObjectId, ref: "Customer" },
},
    {
        timestamps: true,
    }
);



const UserModel = model("Customer", CustomerSchema)

module.exports = UserModel