//npm 모듈 불러오기
const express = require("express");
const dotenv = require("dotenv");
const multer = require("multer");
const nunjucks = require("nunjucks");
const morgan = require("morgan");

//기타 모듈 불러오기
const { dbService, storageService } = require("./fb");
const {
  addDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  deleteDoc,
  getDocs,
  limit,
} = require("firebase/firestore");
const {
  getDownloadURL,
  ref,
  uploadString,
  deleteObject,
} = require("firebase/storage");

//초기 세팅
dotenv.config();
const app = express();
const port = 3002;
app.set("port", process.env.PORT || port);
app.set("view engine", "html");
const storage = multer.memoryStorage();
const upload = multer({ storage });
nunjucks.configure("views", {
  express: app,
  watch: true,
});

//미들웨어
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

//get
app.get("/", async (req, res) => {
  const q = query(collection(dbService, "foods"));
  const querySnapshot = await getDocs(q);
  let foodArr = [];
  querySnapshot.forEach((doc) => {
    const foodObj = {
      ...doc.data(),
      id: doc.id,
    };
    foodArr.push(foodObj);
    foodArr.sort(function (a, b) {
      return b.createdAt - a.createdAt;
    });
  });
  let fileURL = [];
  let id = [];
  let menu = [];
  let place = [];
  let address = [];
  let price = [];
  let saledPrice = [];
  let deadline = [];
  let createdAt = [];

  for (let i = 0; i < foodArr.length; i++) {
    fileURL.push(foodArr[i].fileURL);
    id.push(foodArr[i].id);
    menu.push(foodArr[i].menu);
    place.push(foodArr[i].place);
    address.push(foodArr[i].address);
    price.push(foodArr[i].price);
    saledPrice.push(foodArr[i].saledPrice);
    deadline.push(foodArr[i].deadline);
    createdAt.push(foodArr[i].createdAt);
  }

  res.render("index", {
    fileURL,
    id,
    menu,
    place,
    address,
    price,
    saledPrice,
    deadline,
    createdAt,
  });
});

//post
app.post("/form_receiver", upload.single("foodImg"), async (req, res) => {
  try {
    const foodImg = req.file.buffer.toString("base64");
    const menu = req.body.menu;
    const place = req.body.place;
    const address = req.body.address;
    const price = req.body.price;
    const saledPrice = req.body.saledPrice;
    const deadline = req.body.deadline;
    const createdAt = Date.now();
    const fileRef = ref(storageService, `/images/${createdAt}`);
    const response = await uploadString(fileRef, foodImg, "base64");
    const fileURL = await getDownloadURL(response.ref);
    await addDoc(collection(dbService, "foods"), {
      fileURL,
      menu,
      place,
      address,
      price,
      saledPrice,
      deadline,
      createdAt,
    });
    res.redirect("/");
  } catch (error) {
    console.error("Error adding document: ", error);
  }
});

//listen
app.listen(app.get("port"), () => {
  console.log(`Example app listening on port ${port}`);
});
