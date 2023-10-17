const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json());
app.use(cors());



// mongodb 연결

const mongoose = require("mongoose");
mongoose.connect(
    "mongodb+srv://Ddalkkak:w4pyl4PrbsxZAWJw@omm.wdu5kds.mongodb.net/?retryWrites=true&w=majority"
);

//customer schema 생성 및 연결 (resister site)

const CustomerModel = require('./models/Customer')

app.post('/register', async (req, res) => {
    const { resusername, respassword, name, tel, email } = req.body;
    const userDoc = await CustomerModel.create({ resusername, respassword, name, tel, email });
    res.json(userDoc);
})




app.listen(4000, () => {
    console.log("4000에서 돌고 있음");
});


  //Ddalkkak
  //mongodb+srv://Ddalkkak:w4pyl4PrbsxZAWJw@cluster0.rz71rvi.mongodb.net/?retryWrites=true&w=majority