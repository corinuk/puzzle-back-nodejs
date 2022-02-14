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
  // DB에서 data 불러옴.
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

  // 변수 설정
  let fileURL = [];
  let id = [];
  let menu = [];
  let place = [];
  let address = [];
  let price = [];
  let saledPrice = [];
  let deadline = [];
  let createdAt = [];

  // 위의 변수에 item 담기
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

  res.render("items", {
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

/*
import Item from "components/Item";
import { dbService, storageService } from "fb";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  doc,
  deleteDoc,
  getDocs,
  limit,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useEffect, useState } from "react";

function AllItems() {
  const [foods, setFoods] = useState([]);

  const deleteFood = async () => {
    const q = query(collection(dbService, "foods"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const foodObj = {
        ...doc.data(),
        id: doc.id,
      };
      setFoods((prev) =>
        [foodObj, ...prev].sort(function (a, b) {
          return b.createdAt - a.createdAt;
        })
      );
    });
    let order_createdAt = [];
    let food_createdAt = [];
    const ordersCol = collection(dbService, "orders");
    const foodsCol = collection(dbService, "foods");
    const orderDocRef = query(
      ordersCol,
      orderBy("createdAt_order", "desc"),
      limit(3)
    );
    const foodDocRef = query(foodsCol);
    const orderSnapshots = await getDocs(orderDocRef);
    orderSnapshots.forEach((doc) => {
      const obj = {
        id_order: doc.id,
        id: doc.data().id,
        createdAt: doc.data().createdAt,
      };
      order_createdAt.push(obj);
    });
    const foodSnapshots = await getDocs(foodDocRef);
    foodSnapshots.forEach((doc) => {
      const obj = { id: doc.id, createdAt: doc.data().createdAt };
      food_createdAt.push(obj);
    });
    let intersection;
    intersection = order_createdAt.filter((element) =>
      food_createdAt.map((e) => e.createdAt === element.createdAt)
    );
    intersection.map(async ({ createdAt, id, id_order }) => {
      const fileRef = ref(storageService, `/images/${createdAt}`);

      const q = query(doc(dbService, "foods", `${id}`));
      const q2 = query(doc(dbService, "orders", `${id_order}`));
      await deleteObject(fileRef);
      await deleteDoc(q);
      await deleteDoc(q2);
      window.location.reload();
    });
  };

  useEffect(() => {
    setFoods([]);
    onSnapshot(query(collection(dbService, "orders")), (snapshot) => {
      deleteFood();
    });
  }, []);

  return (
    <div style={{ marginTop: "20px" }}>
      {foods.map(
        ({
          id,
          menu,
          place,
          address,
          price,
          saledPrice,
          deadline,
          fileURL,
          createdAt,
        }) => (
          <Item
            id={id}
            key={id}
            menu={menu}
            place={place}
            address={address}
            prevPrice={Number(price)}
            saledPrice={Number(saledPrice)}
            deadline={deadline}
            fileURL={fileURL}
            createdAt={createdAt}
          />
        )
      )}
    </div>
  );
}

export default AllItems;
*/
