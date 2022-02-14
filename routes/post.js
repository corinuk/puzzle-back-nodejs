//npm 모듈 불러오기
const express = require("express");
const multer = require("multer");

//기타 모듈 불러오기
const { dbService, storageService } = require("../fb");
const { addDoc, collection } = require("firebase/firestore");
const { getDownloadURL, ref, uploadString } = require("firebase/storage");

//초기세팅
const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage });

//index.html로 부터 받은 form
app.post("/", upload.single("foodImg"), async (req, res) => {
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
    const convert_to_dataURL = `data:image/jpeg;base64,${foodImg}`;
    const response = await uploadString(
      fileRef,
      convert_to_dataURL,
      "data_url"
    );
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

module.exports = app;
