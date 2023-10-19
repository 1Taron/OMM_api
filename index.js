const express = require("express");
const app = express();

//cors
const cors = require("cors");
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());

// mongodb 연결
const mongoose = require("mongoose");
const Customer = require("./models/Customer");
const PayDelivery = require("./models/PayDelivery");
const FoodAccount = require("./models/FoodAccount");
mongoose.connect(
  "mongodb+srv://Ddalkkak:w4pyl4PrbsxZAWJw@omm.wdu5kds.mongodb.net/OMM?retryWrites=true&w=majority"
);
mongoose.connection.once("open", () => {
  console.log("MongoDB is Connected");
});

//passward암호화
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

//회원가입
app.post("/register", async (req, res) => {
  const { username, password, name, tel, email } = req.body;
  try {
    const userDoc = await Customer.create({
      username,
      password: bcrypt.hashSync(password, salt),
      name,
      tel,
      email,
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

//로그인
const jwt = require("jsonwebtoken");
const secret = "qweasdzxc";

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await Customer.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);

  //true or false
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json({ message: "비밀번호가 틀렸습니다. " });
  }
});

//로그인 후 유효한 토큰을 갖고 있는지 검증
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

//로그아웃
app.post("/logout", (req, res) => {
  res.cookie("token", "").json("로그아웃");
});

//결제(배달)
app.post("/payment_delivery", async (req, res) => {
  const { pd_quantity, pd_price, pd_adress, pd_context } = req.body;
  try {
    const payDDoc = await PayDelivery.create({
      pd_quantity,
      pd_price,
      pd_adress,
      pd_context,
    });
    res.json(payDDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

//어드민로그인
const Admin = require("./models/Admin");
app.post("/login/admin", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await Admin.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);

  //true or false
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json({ message: "비밀번호가 틀렸습니다. " });
  }
});

app.get("/orderlsit", (req, res) => {
  PayDelivery.find((err, data) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json(data);
  });
});

//재료 총 가격 및 개수
app.post("/food", async (req, res) => {
  const { Account, Sangchu_index } = req.body;
  try {
    const userDoc = await FoodAccount.create({
      Account,
      Sangchu_index,
    });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});

<<<<<<< Updated upstream
//재료 총 가격 및 개수 /payment 보내기
app.get("/food", async (req, res) => {
  try {
    const result = await FoodAccount.findOne({}).sort({ _id: 1 }).exec();
    if (result) {

      res.json(result);
    } else {
      res.status(404).json({ error: '데이터를 찾을수 없음' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '데이터 가져오는중 실패' });
  }
});

// const PayDeliveryModel = mongoose.model("PayDelivery", PayDeliverySchema);
// app.get("/orderlsit", (req, res) => {
//   PayDeliveryModel.find((err, data) => {
//     if (err) {
//       return res.status(500).send(err);
//     }
//     return res.json(data);
//   });
// });

=======
>>>>>>> Stashed changes
app.listen(4000, () => {
  console.log("4000에서 돌고 있음");
});

//Taron
//mongodb+srv://Ddalkkak:w4pyl4PrbsxZAWJw@cluster0.rz71rvi.mongodb.net/?retryWrites=true&w=majority
//mongodb+srv://maruj7899:EHf6v9J98dQLouBm@cluster0.wzlg0e7.mongodb.net/?retryWrites=true&w=majority
