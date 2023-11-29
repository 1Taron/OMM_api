const express = require("express");
//이미지 설정(multer)
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const app = express();

//cors
const cors = require("cors");
app.use(cors());
app.use(express.json());

// IP주소 바꿔야 하는 부분
// Frontend
// 	DrawerUI
// 	------- Screen --------
// 		Home
// 		Login
// 		Resister1,2,3
// 		Payment_D
// 	-----------------------

// mongodb 연결
const mongoose = require("mongoose");
const Customer = require("./models/Customer");
const Payment = require("./models/Payment");
const FoodAccount = require("./models/FoodAccount");
const Notify = require("./models/Notify");
const AdminProduct = require("./models/Admin_Product");
mongoose.connect(
  "mongodb+srv://Ddalkkak:w4pyl4PrbsxZAWJw@omm.wdu5kds.mongodb.net/OMM?retryWrites=true&w=majority"
);
mongoose.connection.once("open", () => {
  console.log("MongoDB is Connected");
});


//이미지 업로드 클라에서 받기
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) // 클라이언트에서 보낸 상품명을 파일 이름으로 사용
  }
})

//사진 url로 저장
app.use('/images', express.static(path.join(__dirname, 'images')));

const upload = multer({ storage: storage })

app.post('/admin/upload', upload.single('file'), async (req, res) => {
  try {
    console.log(req.file);

    // 클라이언트에서 보낸 파일과 상품 정보를 처리
    const { productName, category, isChecked, price } = req.body;

    // DB에 상품 정보를 저장
    const adminProductDoc = await AdminProduct.create({
      category,
      ProductName: productName,
      isChecked,
      Price: price,
      ImageUrl: `http://localhost:4000/images/${req.file.filename}`
    });

    res.json(adminProductDoc);
  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
});

//adminProduct정보 배출
app.get('/admin/Productdata', async (req, res) => {
  const data = await AdminProduct.find();
  res.json(data);
});

//특정 adminProduct상품 배출
app.get('/admin/Productdata/:id', async (req, res) => {
  const id = req.params.id; // URL에서 ID 가져오기
  const data = await AdminProduct.findById(id); // 해당 ID의 상품 찾기
  res.json(data); // 찾은 상품을 응답으로 보내기
});

//adminProduct 상품 수정
app.put('/admin/Productdata/:id', async (req, res) => {
  const id = req.params.id; // URL에서 ID 가져오기
  const updatedData = req.body; // 요청 본문에서 수정된 데이터 가져오기

  try {
    // 해당 ID의 상품 찾기 및 수정
    const product = await AdminProduct.findByIdAndUpdate(id, updatedData, { new: true });

    if (!product) {
      // 해당 ID의 상품이 없는 경우
      res.status(404).send({ message: 'Product not found' });
    } else {
      // 수정된 상품 정보를 응답으로 보내기
      res.json(product);
    }
  } catch (error) {
    // 에러 처리
    res.status(500).send({ message: error.message });
  }
});




//passward암호화
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

//회원가입
app.post("/register", async (req, res) => {
  const {
    username,
    password,
    name,
    tel,
    email,
    mainadress,
    sideadress,
    Check1,
    Check2,
    Check3,
  } = req.body;
  try {
    const userDoc = await Customer.create({
      username,
      password: bcrypt.hashSync(password, salt),
      name,
      tel,
      email,
      mainadress,
      sideadress,
      Check1,
      Check2,
      Check3,
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
    jwt.sign(
      {
        id: userDoc._id,
        username,
        password,
        name: userDoc.name,
        mainadress: userDoc.mainadress,
        sideadress: userDoc.sideadress,
        email: userDoc.email,
        tel: userDoc.tel,
        check1: userDoc.Check1,
        check2: userDoc.Check2,
        check3: userDoc.Check3,
      },
      secret,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json({
          id: userDoc._id,
          username,
          password,
          name: userDoc.name,
          mainadress: userDoc.mainadress,
          sideadress: userDoc.sideadress,
          email: userDoc.email,
          tel: userDoc.tel,
          check1: userDoc.Check1,
          check2: userDoc.Check2,
          check3: userDoc.Check3,
        });
      }
    );
  } else {
    res.status(400).json({ message: "비밀번호가 틀렸습니다. " });
  }
});

//로그인 후 유효한 토큰을 갖고 있는지 검증
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// 로그인 후 유효한 토큰을 갖고 있는지 검증
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      // JWT 검증 실패
      res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    } else {
      // 유효한 토큰인 경우
      res.json(info);
    }
  });
});

// 로그아웃
app.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "로그아웃되었습니다." });
});

//결제(배달)
app.post("/payment", async (req, res) => {
  const {
    p_store,
    p_kind,
    p_quantity,
    p_price,
    p_adress,
    p_request,
    p_ingredient,
    p_payment,
    p_userId,
  } = req.body;
  try {
    const payDDoc = await Payment.create({
      p_store,
      p_kind,
      p_quantity,
      p_price,
      p_adress,
      p_request,
      p_ingredient,
      p_payment,
      p_userId,
    });
    res.json(payDDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});
//결제(포장)
app.post("/payment_pickup", async (req, res) => {
  const {
    pd_kind,
    pd_quantity,
    pd_price,
    pd_adress,
    pd_context,
    pd_ingredient,
  } = req.body;
  try {
    const payDDoc = await PayDelivery.create({
      pd_kind,
      pd_quantity,
      pd_price,
      pd_adress,
      pd_context,
      pd_ingredient,
    });
    res.json(payDDoc);
  } catch (e) {
    res.status(400).json(e);
  }
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

//재료 총 가격 및 개수 /payment 보내기
app.get("/food", async (req, res) => {
  try {
    const result = await FoodAccount.findOne({}).sort({ _id: 1 }).exec();
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "데이터를 찾을수 없음" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "데이터 가져오는중 실패" });
  }
});

//어드민로그인
const Admin = require("./models/Admin");
app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await Admin.findOne({ username });
  const passOk = bcrypt.compareSync(password, userDoc.password);

  //true or false
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie("token2", token).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json({ message: "비밀번호가 틀렸습니다. " });
  }
});

//로그인 후 유효한 토큰을 갖고 있는지 검증
app.get("/admin/profile", (req, res) => {
  const { token2 } = req.cookies;
  jwt.verify(token2, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

//로그아웃
app.post("/admin/logout", (req, res) => {
  res.cookie("token2", "").json("로그아웃");
});

app.get("/admin/orderlist", async (req, res) => {
  try {
    const result = await PayDelivery.find().sort({ createdAt: -1 }).exec();
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "데이터를 찾을수 없음" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "데이터 가져오는중 실패" });
  }
});

//어드민 주문 수락
app.post("/admin/ordernotify", async (req, res) => {
  const { n_state, n_eta } = req.body;
  try {
    const notifyDoc = await Notify.create({
      n_state,
      n_eta,
    });
    res.json(notifyDoc);
  } catch (e) {
    res.status(400).json(e);
  }
});
//알림
app.get("/ordernotify", async (req, res) => {
  try {
    const result = await Notify.find().sort({ createdAt: -1 }).exec();
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "데이터를 찾을수 없음" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "데이터 가져오는중 실패" });
  }
});

//paydelivery_document 삭제
app.delete("/admin/deletePayDeliveryDocument", async (req, res) => {
  try {
    const documentId = req.body.documentId;
    const result = await Payment.findByIdAndDelete(documentId);

    if (result) {
      res.json("Document가 성공적으로 삭제되었습니다.");
    } else {
      res.status(404).json("Document를 찾을 수 없습니다.");
    }
  } catch (error) {
    console.error("문서 삭제 오류:", error);
    res.status(500).json("서버 오류");
  }
});

//food_document 삭제
app.delete("/deletefoodDoc", async (req, res) => {
  try {
    const documentId = req.body.documentId;
    const result = await FoodAccount.findByIdAndDelete(documentId);

    if (result) {
      res.json("Document가 성공적으로 삭제되었습니다.");
    } else {
      res.status(404).json("Document를 찾을 수 없습니다.");
    }
  } catch (error) {
    console.error("문서 삭제 오류:", error);
    res.status(500).json("서버 오류");
  }
});

app.listen(4000, () => {
  console.log("4000에서 돌고 있음");
});

//Taron
//mongodb+srv://Ddalkkak:w4pyl4PrbsxZAWJw@cluster0.rz71rvi.mongodb.net/?retryWrites=true&w=majority
//mongodb+srv://maruj7899:EHf6v9J98dQLouBm@cluster0.wzlg0e7.mongodb.net/?retryWrites=true&w=majority
