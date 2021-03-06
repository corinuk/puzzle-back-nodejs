//npm 모듈 불러오기
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

//기타 모듈 불러오기
const { dbService, storageService } = require("./fb");
const { query, doc, deleteDoc } = require("firebase/firestore");
const { ref, deleteObject } = require("firebase/storage");

// 아래 주석은 삭제 노노!!!
// const { dbService, storageService } = require("./fb");
// const {addDoc,collection,query,onSnapshot,orderBy,doc,deleteDoc,getDocs,limit} = require("firebase/firestore");
// const {getDownloadURL,ref,uploadString,deleteObject} = require("firebase/storage");

//초기 세팅
dotenv.config();
const getRouter = require("./routes/get");
const postRouter = require("./routes/post");
const app = express();
const port = 3002;
app.set("port", process.env.PORT || port);
app.set("view engine", "html");

//기타 미들웨어
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

//get
app.use("/", getRouter);
app.get("/delete-item", async (req, res) => {
  const id = req.query.id;
  const ca = req.query.ca;
  const q = query(doc(dbService, "foods", `${id}`));
  const fileRef = ref(storageService, `/images/${ca}`);
  await deleteObject(fileRef);
  await deleteDoc(q);
  res.redirect("/");
});

//post
app.use("/upload", postRouter);

//listen
app.listen(app.get("port"), () => {
  console.log(`Example app listening on port ${port}`);
});
