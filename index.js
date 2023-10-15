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

app.listen(4000, () => {
    console.log("4000에서 돌고 있음");
});


  //Taron
  //mongodb+srv://Ddalkkak:w4pyl4PrbsxZAWJw@cluster0.rz71rvi.mongodb.net/?retryWrites=true&w=majority