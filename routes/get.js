const express = require("express");
const nunjucks = require("nunjucks");

const { dbService } = require("../fb");
const { collection, query, getDocs } = require("firebase/firestore");

const app = express();

//*******res.render 하려면 항상 nunjucks config 해줘야함*******
nunjucks.configure("views", {
  express: app,
  watch: true,
});
app.set("view engine", "html");
//********************************************************

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

module.exports = app;
