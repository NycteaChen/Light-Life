import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  useParams,
} from "react-router-dom";
import "firebase/firestore";
import getIngrediensData from "../utils/ingredientsAPI.js";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTimes } from "@fortawesome/free-solid-svg-icons";

function DietitianRecord({ date, count, setCount }) {
  const params = useParams();
  const [meal, setMeal] = useState([]);
  const [mealDetails, setMealDetails] = useState("");
  const dID = params.dID;
  const cID = params.cID;
  const [dataAnalysis, setDataAnalysis] = useState(false);
  const [ingredients, setIngredients] = useState({});
  const [inputValue, setInputValue] = useState([]);
  const [isSelect, setIsSelected] = useState(false);
  const [isDisplay, setIsDisplay] = useState(false);
  const initInput = {
    per: 0,
    kcal: 0,
    carbohydrate: 0,
    lipid: 0,
    protein: 0,
    fiber: 0,
  };
  const [input, setInput] = useState(initInput);
  useEffect(async () => {
    await getIngrediensData().then((res) => {
      setIngredients(res);
    });
  }, []);
  const getMealHandler = (e) => {
    setInput(initInput);
    setIsSelected(false);
    if (meal[0] !== e.target.className) {
      setCount(2);
    } else {
      setCount(count + 1);
    }
    setMeal([e.target.className, e.target.id]);
    firebase
      .firestore()
      .collection("dietitians")
      .doc(dID)
      .collection("customers")
      .doc(cID)
      .collection("diet")
      .doc(date)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data()[e.target.className]) {
          setMealDetails(doc.data()[e.target.className]);
        } else {
          setMealDetails("");
        }
        if (doc.exists && doc.data()[e.target.id]) {
          setDataAnalysis(doc.data()[e.target.id]);
        } else {
          setDataAnalysis(false);
        }
      });
  };

  const getInputHandler = (e) => {
    const { name } = e.target;
    const { type } = e.target;
    if (isSelect && type === "number") {
      let kcal;
      let protein;
      let lipid;
      let carbohydrate;
      let fiber;
      let per = parseFloat(e.target.value);
      ingredients
        .filter((i) => i["樣品名稱"] === input.item)
        .forEach((n) => {
          switch (n["分析項"]) {
            case "修正熱量":
              kcal =
                parseFloat(n["每單位含量"]) && per > 0
                  ? parseFloat(parseFloat(n["每單位含量"]) * per).toFixed(1)
                  : 0;
              break;
            case "粗蛋白":
              protein =
                parseFloat(n["每單位含量"]) && per > 0
                  ? parseFloat(parseFloat(n["每單位含量"]) * per).toFixed(1)
                  : 0;
              break;
            case "粗脂肪":
              lipid =
                parseFloat(n["每單位含量"]) && per > 0
                  ? parseFloat(parseFloat(n["每單位含量"]) * per).toFixed(1)
                  : 0;
              break;
            case "總碳水化合物":
              carbohydrate =
                parseFloat(n["每單位含量"]) && per > 0
                  ? parseFloat(parseFloat(n["每單位含量"]) * per).toFixed(1)
                  : 0;
              break;
            case "膳食纖維":
              fiber =
                parseFloat(n["每單位含量"]) && per > 0
                  ? parseFloat(parseFloat(n["每單位含量"]) * per).toFixed(1)
                  : 0;
              break;
          }
        });
      setInput({
        ...input,
        kcal: parseFloat(kcal),
        protein: parseFloat(protein),
        lipid: parseFloat(lipid),
        carbohydrate: parseFloat(carbohydrate),
        fiber: parseFloat(fiber),
        per: parseFloat(per),
      });
    } else if (type === "number") {
      setInput({
        ...input,
        [name]: parseFloat(e.target.value),
      });
    } else {
      setIsSelected(false);
      setInput({
        ...initInput,
        [name]: e.target.value,
      });
    }
  };
  const getSearchHandler = (e) => {
    const array = ingredients
      .filter(
        (i) =>
          i["樣品名稱"].includes(`${e.target.value}`) && e.target.value !== ""
      )
      .map((e) => e["樣品名稱"])
      .filter((n, index, arr) => arr.indexOf(n) === index);
    setInputValue(array);
    setIsDisplay(true);
  };

  const selectIngredientHandler = (e) => {
    setInput({ ...input, item: e.target.textContent });
    setInputValue([]);
    setIsSelected(true);
  };

  const addNewFoodTable = (e) => {
    if (meal[0] === e.target.className) {
      if (input.item === "" || !input.item) {
        alert("請填入食材");
        return;
      } else if (input.per === "0" || !input.per) {
        alert("請填入單位數");
      } else {
        firebase
          .firestore()
          .collection("dietitians")
          .doc(dID)
          .collection("customers")
          .doc(cID)
          .collection("diet")
          .doc(date)
          .set(
            {
              [meal[1]]: [...(dataAnalysis || []), input],
            },
            { merge: true }
          );
        setIsSelected(false);
        setDataAnalysis([...(dataAnalysis || []), input]);
        setInput(initInput);
      }
    }
  };

  const inputItemHandler = (e) => {
    if (input.item) {
      ingredients.find((i) =>
        i["樣品名稱"] === e.target.value ? setIsSelected(true) : null
      );
      console.log("test");
    }
  };

  window.addEventListener("click", (e) => {
    if (e.target.className !== "searchBox") {
      setIsDisplay(false);
      // if (input.item) {
      //   ingredients.find((i) =>
      //     i["樣品名稱"] === e.target.value ? setIsSelected(true) : null
      //   );
      // }
    }
  });

  const removeItemHandler = (e) => {
    setDataAnalysis([
      ...dataAnalysis.filter((d, index) => index != e.target.id),
    ]);
    firebase
      .firestore()
      .collection("dietitians")
      .doc(dID)
      .collection("customers")
      .doc(cID)
      .collection("diet")
      .doc(date)
      .set(
        {
          [meal[1]]: [
            ...dataAnalysis.filter((d, index) => index != e.target.id),
          ],
        },
        { merge: true }
      );
  };
  return (
    <>
      <div id="dietitian-daily-diet">
        <h2>{date}飲食記錄</h2>
        <div>
          <div
            className="customerBreakfast"
            id="breakfast"
            onClick={getMealHandler}
          >
            早餐
          </div>
          {meal[0] === "customerBreakfast" && count % 2 === 0 ? (
            <>
              <div className="diet-record">
                <div>
                  進食時間{" "}
                  <span id="eat-time">{mealDetails.eatTime || ""}</span>
                </div>
                <div>
                  <div>照片記錄</div>
                  {mealDetails &&
                  mealDetails.images &&
                  mealDetails.images.length > 0
                    ? mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    : ""}
                </div>
                <div>
                  <div>飲食內容</div>
                  <div>{mealDetails.description || ""}</div>
                </div>
              </div>
              <div>
                <table className="dietitian-record">
                  <thead>
                    <tr>
                      <th>品項</th>
                      <th>單位:100g</th>
                      <th>熱量(kcal)</th>
                      <th>蛋白質(g)</th>
                      <th>脂質(g)</th>
                      <th>碳水化合物(g)</th>
                      <th>膳食纖維(g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataAnalysis
                      ? dataAnalysis.map((a, index) => (
                          <tr key={index}>
                            <th>{a.item}</th>
                            <th>{a.per}</th>
                            <th>{a.kcal}</th>
                            <th>{a.protein}</th>
                            <th>{a.lipid}</th>
                            <th>{a.carbohydrate}</th>
                            <th>{a.fiber}</th>
                            <th id={index} onClick={removeItemHandler}>
                              x
                            </th>
                          </tr>
                        ))
                      : null}
                    <tr>
                      <th style={{ position: "relative" }}>
                        <input
                          type="text"
                          name="item"
                          value={input.item ? input.item : ""}
                          placeholder="請輸入食材"
                          style={{ width: "150px" }}
                          autoComplete="off"
                          onBlur={inputItemHandler}
                          onClick={inputItemHandler}
                          onChange={getInputHandler}
                          onInput={getSearchHandler}
                        />
                        {inputValue.length > 0 && isDisplay ? (
                          <div
                            className="searchBox"
                            style={{
                              zIndex: "1",
                              width: "150px",
                              height: "100px",
                              backgroundColor: "white",
                              border: "1px solid black",
                              position: "absolute",
                              textAlign: "left",
                              fontWeight: "500",
                              fontSize: "14px",
                              overflowY: "scroll",
                              overflowX: "hidden",
                              padding: "7px 10px",
                            }}
                          >
                            {inputValue.map((i, index) => (
                              <div
                                key={index}
                                onClick={selectIngredientHandler}
                              >
                                {i}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </th>
                      <th>
                        <input
                          type="number"
                          name="per"
                          value={input.per ? input.per : "0"}
                          min="0"
                          onChange={getInputHandler}
                          style={{ width: "50px" }}
                        />
                      </th>
                      {isSelect ? (
                        <>
                          <th>{input.kcal}</th>
                          <th>{input.protein}</th>
                          <th>{input.lipid}</th>
                          <th>{input.carbohydrate}</th>
                          <th>{input.fiber}</th>
                        </>
                      ) : (
                        <>
                          <th>
                            <input
                              type="number"
                              name="kcal"
                              value={input.kcal ? input.kcal : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="protein"
                              value={input.protein ? input.protein : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="lipid"
                              value={input.lipid ? input.lipid : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="carbohydrate"
                              value={
                                input.carbohydrate ? input.carbohydrate : "0"
                              }
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="fiber"
                              value={input.fiber ? input.fiber : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                        </>
                      )}
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th
                        className="customerBreakfast"
                        onClick={addNewFoodTable}
                      >
                        +
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          ) : (
            ""
          )}
        </div>

        <div className="meal">
          <div
            className="customerMorning-snack"
            id="morning-snack"
            onClick={getMealHandler}
          >
            早點
          </div>
          {meal[0] === "customerMorning-snack" && count % 2 === 0 ? (
            <>
              <div className="diet-record">
                <div>
                  進食時間{" "}
                  <span id="eat-time">{mealDetails.eatTime || ""}</span>
                </div>
                <div>
                  <div>照片記錄</div>
                  {mealDetails &&
                  mealDetails.images &&
                  mealDetails.images.length > 0
                    ? mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    : ""}
                </div>
                <div>
                  <div>飲食內容</div>
                  <div>{mealDetails.description || ""}</div>
                </div>
              </div>
              <div>
                <table className="dietitian-record">
                  <thead>
                    <tr>
                      <th>品項</th>
                      <th>單位:100g</th>
                      <th>熱量(kcal)</th>
                      <th>蛋白質(g)</th>
                      <th>脂質(g)</th>
                      <th>碳水化合物(g)</th>
                      <th>膳食纖維(g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataAnalysis
                      ? dataAnalysis.map((a, index) => (
                          <tr key={index}>
                            <th>{a.item}</th>
                            <th>{a.per}</th>
                            <th>{a.kcal}</th>
                            <th>{a.protein}</th>
                            <th>{a.lipid}</th>
                            <th>{a.carbohydrate}</th>
                            <th>{a.fiber}</th>
                            <th id={index} onClick={removeItemHandler}>
                              x
                            </th>
                          </tr>
                        ))
                      : null}
                    <tr>
                      <th style={{ position: "relative" }}>
                        <input
                          type="text"
                          name="item"
                          value={input.item ? input.item : ""}
                          placeholder="請輸入食材"
                          style={{ width: "150px" }}
                          autoComplete="off"
                          onBlur={inputItemHandler}
                          onClick={inputItemHandler}
                          onChange={getInputHandler}
                          onInput={getSearchHandler}
                        />
                        {inputValue.length > 0 && isDisplay ? (
                          <div
                            className="searchBox"
                            style={{
                              zIndex: "1",
                              width: "150px",
                              height: "100px",
                              backgroundColor: "white",
                              border: "1px solid black",
                              position: "absolute",
                              textAlign: "left",
                              fontWeight: "500",
                              fontSize: "14px",
                              overflowY: "scroll",
                              overflowX: "hidden",
                              padding: "7px 10px",
                            }}
                          >
                            {inputValue.map((i, index) => (
                              <div
                                key={index}
                                onClick={selectIngredientHandler}
                              >
                                {i}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </th>
                      <th>
                        <input
                          type="number"
                          name="per"
                          value={input.per ? input.per : "0"}
                          min="0"
                          onChange={getInputHandler}
                          style={{ width: "50px" }}
                        />
                      </th>
                      {isSelect ? (
                        <>
                          <th>{input.kcal}</th>
                          <th>{input.protein}</th>
                          <th>{input.lipid}</th>
                          <th>{input.carbohydrate}</th>
                          <th>{input.fiber}</th>
                        </>
                      ) : (
                        <>
                          <th>
                            <input
                              type="number"
                              name="kcal"
                              value={input.kcal ? input.kcal : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="protein"
                              value={input.protein ? input.protein : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="lipid"
                              value={input.lipid ? input.lipid : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="carbohydrate"
                              value={
                                input.carbohydrate ? input.carbohydrate : "0"
                              }
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="fiber"
                              value={input.fiber ? input.fiber : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                        </>
                      )}
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th
                        className="customerMorning-snack"
                        onClick={addNewFoodTable}
                      >
                        +
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
        <div className="meal">
          <div className="customerLunch" id="lunch" onClick={getMealHandler}>
            午餐
          </div>
          {meal[0] === "customerLunch" && count % 2 === 0 ? (
            <>
              <div className="diet-record">
                <div>
                  進食時間{" "}
                  <span id="eat-time">{mealDetails.eatTime || ""}</span>
                </div>
                <div>
                  <div>照片記錄</div>
                  {mealDetails &&
                  mealDetails.images &&
                  mealDetails.images.length > 0
                    ? mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    : ""}
                </div>
                <div>
                  <div>飲食內容</div>
                  <div>{mealDetails.description || ""}</div>
                </div>
              </div>
              <div>
                <table className="dietitian-record">
                  <thead>
                    <tr>
                      <th>品項</th>
                      <th>單位:100g</th>
                      <th>熱量(kcal)</th>
                      <th>蛋白質(g)</th>
                      <th>脂質(g)</th>
                      <th>碳水化合物(g)</th>
                      <th>膳食纖維(g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataAnalysis
                      ? dataAnalysis.map((a, index) => (
                          <tr key={index}>
                            <th>{a.item}</th>
                            <th>{a.per}</th>
                            <th>{a.kcal}</th>
                            <th>{a.protein}</th>
                            <th>{a.lipid}</th>
                            <th>{a.carbohydrate}</th>
                            <th>{a.fiber}</th>
                            <th id={index} onClick={removeItemHandler}>
                              x
                            </th>
                          </tr>
                        ))
                      : null}
                    <tr>
                      <th style={{ position: "relative" }}>
                        <input
                          type="text"
                          name="item"
                          value={input.item ? input.item : ""}
                          placeholder="請輸入食材"
                          style={{ width: "150px" }}
                          autoComplete="off"
                          onBlur={inputItemHandler}
                          onClick={inputItemHandler}
                          onChange={getInputHandler}
                          onInput={getSearchHandler}
                        />
                        {inputValue.length > 0 && isDisplay ? (
                          <div
                            className="searchBox"
                            style={{
                              zIndex: "1",
                              width: "150px",
                              height: "100px",
                              backgroundColor: "white",
                              border: "1px solid black",
                              position: "absolute",
                              textAlign: "left",
                              fontWeight: "500",
                              fontSize: "14px",
                              overflowY: "scroll",
                              overflowX: "hidden",
                              padding: "7px 10px",
                            }}
                          >
                            {inputValue.map((i, index) => (
                              <div
                                key={index}
                                onClick={selectIngredientHandler}
                              >
                                {i}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </th>
                      <th>
                        <input
                          type="number"
                          name="per"
                          value={input.per ? input.per : "0"}
                          min="0"
                          onChange={getInputHandler}
                          style={{ width: "50px" }}
                        />
                      </th>
                      {isSelect ? (
                        <>
                          <th>{input.kcal}</th>
                          <th>{input.protein}</th>
                          <th>{input.lipid}</th>
                          <th>{input.carbohydrate}</th>
                          <th>{input.fiber}</th>
                        </>
                      ) : (
                        <>
                          <th>
                            <input
                              type="number"
                              name="kcal"
                              value={input.kcal ? input.kcal : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="protein"
                              value={input.protein ? input.protein : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="lipid"
                              value={input.lipid ? input.lipid : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="carbohydrate"
                              value={
                                input.carbohydrate ? input.carbohydrate : "0"
                              }
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="fiber"
                              value={input.fiber ? input.fiber : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                        </>
                      )}
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th className="customerLunch" onClick={addNewFoodTable}>
                        +
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
        <div className="meal">
          <div
            className="customerAfternoon-snack"
            id="afternoon-snack"
            onClick={getMealHandler}
          >
            午點
          </div>
          {meal[0] === "customerAfternoon-snack" && count % 2 === 0 ? (
            <>
              <div className="diet-record">
                <div>
                  進食時間{" "}
                  <span id="eat-time">{mealDetails.eatTime || ""}</span>
                </div>
                <div>
                  <div>照片記錄</div>
                  {mealDetails &&
                  mealDetails.images &&
                  mealDetails.images.length > 0
                    ? mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    : ""}
                </div>
                <div>
                  <div>飲食內容</div>
                  <div>{mealDetails.description || ""}</div>
                </div>
              </div>
              <div>
                <table className="dietitian-record">
                  <thead>
                    <tr>
                      <th>品項</th>
                      <th>單位:100g</th>
                      <th>熱量(kcal)</th>
                      <th>蛋白質(g)</th>
                      <th>脂質(g)</th>
                      <th>碳水化合物(g)</th>
                      <th>膳食纖維(g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataAnalysis
                      ? dataAnalysis.map((a, index) => (
                          <tr key={index}>
                            <th>{a.item}</th>
                            <th>{a.per}</th>
                            <th>{a.kcal}</th>
                            <th>{a.protein}</th>
                            <th>{a.lipid}</th>
                            <th>{a.carbohydrate}</th>
                            <th>{a.fiber}</th>
                            <th id={index} onClick={removeItemHandler}>
                              x
                            </th>
                          </tr>
                        ))
                      : null}
                    <tr>
                      <th style={{ position: "relative" }}>
                        <input
                          type="text"
                          name="item"
                          value={input.item ? input.item : ""}
                          placeholder="請輸入食材"
                          style={{ width: "150px" }}
                          autoComplete="off"
                          onBlur={inputItemHandler}
                          onClick={inputItemHandler}
                          onChange={getInputHandler}
                          onInput={getSearchHandler}
                        />
                        {inputValue.length > 0 && isDisplay ? (
                          <div
                            className="searchBox"
                            style={{
                              zIndex: "1",
                              width: "150px",
                              height: "100px",
                              backgroundColor: "white",
                              border: "1px solid black",
                              position: "absolute",
                              textAlign: "left",
                              fontWeight: "500",
                              fontSize: "14px",
                              overflowY: "scroll",
                              overflowX: "hidden",
                              padding: "7px 10px",
                            }}
                          >
                            {inputValue.map((i, index) => (
                              <div
                                key={index}
                                onClick={selectIngredientHandler}
                              >
                                {i}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </th>
                      <th>
                        <input
                          type="number"
                          name="per"
                          value={input.per ? input.per : "0"}
                          min="0"
                          onChange={getInputHandler}
                          style={{ width: "50px" }}
                        />
                      </th>
                      {isSelect ? (
                        <>
                          <th>{input.kcal}</th>
                          <th>{input.protein}</th>
                          <th>{input.lipid}</th>
                          <th>{input.carbohydrate}</th>
                          <th>{input.fiber}</th>
                        </>
                      ) : (
                        <>
                          <th>
                            <input
                              type="number"
                              name="kcal"
                              value={input.kcal ? input.kcal : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="protein"
                              value={input.protein ? input.protein : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="lipid"
                              value={input.lipid ? input.lipid : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="carbohydrate"
                              value={
                                input.carbohydrate ? input.carbohydrate : "0"
                              }
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="fiber"
                              value={input.fiber ? input.fiber : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                        </>
                      )}
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th
                        className="customerAfternoon-snack"
                        onClick={addNewFoodTable}
                      >
                        +
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
        <div className="meal">
          <div className="customerDinner" id="dinner" onClick={getMealHandler}>
            晚餐
          </div>
          {meal[0] === "customerDinner" && count % 2 === 0 ? (
            <>
              <div className="diet-record">
                <div>
                  進食時間{" "}
                  <span id="eat-time">{mealDetails.eatTime || ""}</span>
                </div>
                <div>
                  <div>照片記錄</div>
                  {mealDetails &&
                  mealDetails.images &&
                  mealDetails.images.length > 0
                    ? mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    : ""}
                </div>
                <div>
                  <div>飲食內容</div>
                  <div>{mealDetails.description || ""}</div>
                </div>
              </div>
              <div>
                <table className="dietitian-record">
                  <thead>
                    <tr>
                      <th>品項</th>
                      <th>單位:100g</th>
                      <th>熱量(kcal)</th>
                      <th>蛋白質(g)</th>
                      <th>脂質(g)</th>
                      <th>碳水化合物(g)</th>
                      <th>膳食纖維(g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataAnalysis
                      ? dataAnalysis.map((a, index) => (
                          <tr key={index}>
                            <th>{a.item}</th>
                            <th>{a.per}</th>
                            <th>{a.kcal}</th>
                            <th>{a.protein}</th>
                            <th>{a.lipid}</th>
                            <th>{a.carbohydrate}</th>
                            <th>{a.fiber}</th>
                            <th id={index} onClick={removeItemHandler}>
                              x
                            </th>
                          </tr>
                        ))
                      : null}
                    <tr>
                      <th style={{ position: "relative" }}>
                        <input
                          type="text"
                          name="item"
                          value={input.item ? input.item : ""}
                          placeholder="請輸入食材"
                          style={{ width: "150px" }}
                          autoComplete="off"
                          onBlur={inputItemHandler}
                          onClick={inputItemHandler}
                          onChange={getInputHandler}
                          onInput={getSearchHandler}
                        />
                        {inputValue.length > 0 && isDisplay ? (
                          <div
                            className="searchBox"
                            style={{
                              zIndex: "1",
                              width: "150px",
                              height: "100px",
                              backgroundColor: "white",
                              border: "1px solid black",
                              position: "absolute",
                              textAlign: "left",
                              fontWeight: "500",
                              fontSize: "14px",
                              overflowY: "scroll",
                              overflowX: "hidden",
                              padding: "7px 10px",
                            }}
                          >
                            {inputValue.map((i, index) => (
                              <div
                                key={index}
                                onClick={selectIngredientHandler}
                              >
                                {i}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </th>
                      <th>
                        <input
                          type="number"
                          name="per"
                          value={input.per ? input.per : "0"}
                          min="0"
                          onChange={getInputHandler}
                          style={{ width: "50px" }}
                        />
                      </th>
                      {isSelect ? (
                        <>
                          <th>{input.kcal}</th>
                          <th>{input.protein}</th>
                          <th>{input.lipid}</th>
                          <th>{input.carbohydrate}</th>
                          <th>{input.fiber}</th>
                        </>
                      ) : (
                        <>
                          <th>
                            <input
                              type="number"
                              name="kcal"
                              value={input.kcal ? input.kcal : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="protein"
                              value={input.protein ? input.protein : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="lipid"
                              value={input.lipid ? input.lipid : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="carbohydrate"
                              value={
                                input.carbohydrate ? input.carbohydrate : "0"
                              }
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="fiber"
                              value={input.fiber ? input.fiber : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                        </>
                      )}
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th className="customerDinner" onClick={addNewFoodTable}>
                        +
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
        <div className="meal">
          <div
            className="customerNight-snack"
            id="night-snack"
            onClick={getMealHandler}
          >
            晚點
          </div>
          {meal[0] === "customerNight-snack" && count % 2 === 0 ? (
            <>
              <div className="diet-record">
                <div>
                  進食時間{" "}
                  <span id="eat-time">{mealDetails.eatTime || ""}</span>
                </div>
                <div>
                  <div>照片記錄</div>
                  {mealDetails &&
                  mealDetails.images &&
                  mealDetails.images.length > 0
                    ? mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    : ""}
                </div>
                <div>
                  <div>飲食內容</div>
                  <div>{mealDetails.description || ""}</div>
                </div>
              </div>
              <div>
                <table className="dietitian-record">
                  <thead>
                    <tr>
                      <th>品項</th>
                      <th>單位:100g</th>
                      <th>熱量(kcal)</th>
                      <th>蛋白質(g)</th>
                      <th>脂質(g)</th>
                      <th>碳水化合物(g)</th>
                      <th>膳食纖維(g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataAnalysis
                      ? dataAnalysis.map((a, index) => (
                          <tr key={index}>
                            <th>{a.item}</th>
                            <th>{a.per}</th>
                            <th>{a.kcal}</th>
                            <th>{a.protein}</th>
                            <th>{a.lipid}</th>
                            <th>{a.carbohydrate}</th>
                            <th>{a.fiber}</th>
                            <th id={index} onClick={removeItemHandler}>
                              x
                            </th>
                          </tr>
                        ))
                      : null}
                    <tr>
                      <th style={{ position: "relative" }}>
                        <input
                          type="text"
                          name="item"
                          value={input.item ? input.item : ""}
                          placeholder="請輸入食材"
                          style={{ width: "150px" }}
                          autoComplete="off"
                          onBlur={inputItemHandler}
                          onClick={inputItemHandler}
                          onChange={getInputHandler}
                          onInput={getSearchHandler}
                        />
                        {inputValue.length > 0 && isDisplay ? (
                          <div
                            className="searchBox"
                            style={{
                              zIndex: "1",
                              width: "150px",
                              height: "100px",
                              backgroundColor: "white",
                              border: "1px solid black",
                              position: "absolute",
                              textAlign: "left",
                              fontWeight: "500",
                              fontSize: "14px",
                              overflowY: "scroll",
                              overflowX: "hidden",
                              padding: "7px 10px",
                            }}
                          >
                            {inputValue.map((i, index) => (
                              <div
                                key={index}
                                onClick={selectIngredientHandler}
                              >
                                {i}
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </th>
                      <th>
                        <input
                          type="number"
                          name="per"
                          value={input.per ? input.per : "0"}
                          min="0"
                          onChange={getInputHandler}
                          style={{ width: "50px" }}
                        />
                      </th>
                      {isSelect ? (
                        <>
                          <th>{input.kcal}</th>
                          <th>{input.protein}</th>
                          <th>{input.lipid}</th>
                          <th>{input.carbohydrate}</th>
                          <th>{input.fiber}</th>
                        </>
                      ) : (
                        <>
                          <th>
                            <input
                              type="number"
                              name="kcal"
                              value={input.kcal ? input.kcal : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="protein"
                              value={input.protein ? input.protein : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="lipid"
                              value={input.lipid ? input.lipid : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="carbohydrate"
                              value={
                                input.carbohydrate ? input.carbohydrate : "0"
                              }
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                          <th>
                            <input
                              type="number"
                              name="fiber"
                              value={input.fiber ? input.fiber : "0"}
                              min="0"
                              onChange={getInputHandler}
                              style={{ width: "50px" }}
                            />
                          </th>
                        </>
                      )}
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th
                        className="customerNight-snack"
                        onClick={addNewFoodTable}
                      >
                        +
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
        <hr />
        <Analysis date={date} dID={dID} cID={cID} data={dataAnalysis} />
      </div>
    </>
  );
}

// function ShowImages({ mealDetails, input, removeImageHandler }) {
//   if (!input.images) {
//     return (
//       <>
//         {mealDetails.images.map((i, index) => (
//           <div key={index}>
//             <div id={index} onClick={removeImageHandler}>
//               X
//             </div>
//             <a href={i} target="_blank" rel="noreferrer noopener">
//               <img
//                 src={i}
//                 alt="customer"
//                 style={{ width: "200px", height: "200px" }}
//               />
//             </a>
//           </div>
//         ))}
//         {input.imageUrl.map((i, index) => (
//           <div key={index}>
//             <a href={i} target="_blank" rel="noreferrer noopener">
//               <img
//                 src={i}
//                 alt="customer"
//                 style={{ width: "200px", height: "200px" }}
//               />
//             </a>
//           </div>
//         ))}
//       </>
//     );
//   } else {
//     return (
//       <>
//         {input.images.map((i, index) => (
//           <div key={index}>
//             <div id={index} onClick={removeImageHandler}>
//               X
//             </div>
//             <a href={i} target="_blank" rel="noreferrer noopener">
//               <img
//                 src={i}
//                 alt="customer"
//                 style={{ width: "200px", height: "200px" }}
//               />
//             </a>
//           </div>
//         ))}
//         {input.imageUrl.map((i, index) => (
//           <div key={index}>
//             <a href={i} target="_blank" rel="noreferrer noopener">
//               <img
//                 src={i}
//                 alt="customer"
//                 style={{ width: "200px", height: "200px" }}
//               />
//             </a>
//           </div>
//         ))}
//       </>
//     );
//   }
// }

function CustomerRecord({ date, count, setCount }) {
  const storage = firebase.storage();
  const [input, setInput] = useState("");
  const [meal, setMeal] = useState("");
  const [dID, setDID] = useState();
  const [mealDetails, setMealDetails] = useState("");
  const [value, setValue] = useState("");
  const [dataAnalysis, setDataAnalysis] = useState(false);

  // const [images, setImages] = useState([]);
  const cID = useParams().cID;

  useEffect(() => {
    firebase
      .firestore()
      .collection("customers")
      .doc(cID)
      .get()
      .then((doc) => {
        setDID(doc.data().dietitian);
      });
  }, [date]);

  const getMealHandler = (e) => {
    if (meal !== e.target.className) {
      setCount(2);
    } else {
      setCount(count + 1);
    }
    setMeal(e.target.className);
    setInput("");
    // if (mealDetails.images) {
    //   setMealDetails({ images: mealDetails.images });
    // }
    // else {
    //   setMealDetails("");
    // }
    setMealDetails("");
    firebase
      .firestore()
      .collection("dietitians")
      .doc(dID)
      .collection("customers")
      .doc(cID)
      .collection("diet")
      .doc(date)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data()[e.target.className]) {
          setMealDetails(doc.data()[e.target.className]);
        } else {
          setMealDetails("");
        }
        if (doc.exists && doc.data()[e.target.id]) {
          setDataAnalysis(doc.data()[e.target.id]);
        } else {
          setDataAnalysis(false);
        }
      });
  };
  async function postImg(image) {
    if (image) {
      const storageRef = storage.ref(`${cID}/${date}/${meal}/` + image.name);
      await storageRef.put(image);
      return image.name;
    } else {
      return false;
    }
  }
  async function getImg(image) {
    const imageName = await postImg(image);
    if (imageName) {
      const storageRef = storage.ref();
      const pathRef = await storageRef
        .child(`${cID}/${date}/${meal}/` + imageName)
        .getDownloadURL();
      return await pathRef;
    } else {
      return "";
    }
  }
  const getInputHandler = (e) => {
    const { name } = e.target;
    if (name !== "image") {
      setInput({ ...input, [name]: e.target.value });
    } else if (e.target.files[0]) {
      // const imageUrlArray = [];
      const imagesArray = [];
      for (let i = 0; i < e.target.files.length; i++) {
        // const imageUrl = window.URL.createObjectURL(e.target.files[i]);
        // imageUrlArray.push(imageUrl);
        imagesArray.push(e.target.files[i]);
      }
      setValue(e.target.value);
      // if (mealDetails.images) {
      //   mealDetails.images.forEach((m) => {
      //     imageUrlArray.push(m);
      //   });
      // }

      setInput({
        ...input,
        // imageUrl: imageUrlArray,
        imageFile: imagesArray,
      });
    } else {
      // delete input.image;
      // setInput({ ...input });
      setValue("");
    }
  };
  const removeImageHandler = (e) => {
    setMealDetails({
      ...mealDetails,
      images: [...mealDetails.images.filter((i, idx) => idx != e.target.id)],
    });
    firebase
      .firestore()
      .collection("dietitians")
      .doc(dID)
      .collection("customers")
      .doc(cID)
      .collection("diet")
      .doc(date)
      .set(
        {
          [meal]: {
            images: [
              ...mealDetails.images.filter((i, idx) => idx != e.target.id),
            ],
          },
        },
        { merge: true }
      );
    // .update({
    //   [meal]: {
    //     ...mealDetails,
    //     images: [
    //       ...mealDetails.images.filter((i, idx) => idx != e.target.id),
    //     ],
    //   },
    // });
  };
  const bindSaveHandler = async (e) => {
    if (meal === e.target.className) {
      if (input.imageFile) {
        let valid = 0;
        input.imageFile.forEach((i, index) => {
          if (i.size >= 2097152) {
            if (input.imageFile.length > 1) {
              alert(`您想上傳的第${index + 1}張圖片超過2MB囉!`);
            } else {
              alert(`圖片超過2MB囉!`);
            }
            valid++;
          }
        });
        if (valid === 0) {
          const imageUrlsArray = [];
          if (mealDetails.images && mealDetails.images.length > 0) {
            mealDetails.images.forEach((m) => {
              imageUrlsArray.push(m);
            });
            setMealDetails({ ...mealDetails, images: imageUrlsArray });
          }
          input.imageFile.forEach(async (i) => {
            const imageUrl = await getImg(i);
            imageUrlsArray.push(imageUrl);
            setInput({
              ...input,
              images: imageUrlsArray,
            });
            delete input.imageFile;
            // delete input.imageUrl;
            // delete mealDetails.images;
            firebase
              .firestore()
              .collection("dietitians")
              .doc(dID)
              .collection("customers")
              .doc(cID)
              .collection("diet")
              .doc(date)
              .set(
                { [meal]: { ...input, images: imageUrlsArray } },
                { merge: true }
              );
            setMealDetails({ ...mealDetails, images: imageUrlsArray });
            setValue("");
          });
          alert("儲存囉!");
        }
      } else {
        delete input.imageFile;
        // delete input.imageUrl;
        firebase
          .firestore()
          .collection("dietitians")
          .doc(dID)
          .collection("customers")
          .doc(cID)
          .collection("diet")
          .doc(date)
          .set({ [meal]: input }, { merge: true });
        alert("儲存囉!");
      }
    }
  };

  return (
    <>
      <div id="dietitian-daily-diet">
        <h2>{date}飲食記錄</h2>
        <div className="meal">
          <div
            className="customerBreakfast"
            id="breakfast"
            onClick={getMealHandler}
          >
            早餐
          </div>
          {meal === "customerBreakfast" && count % 2 === 0 ? (
            <>
              <div className="diet-record">
                <label>
                  進食時間{" "}
                  <input
                    type="time"
                    name="eatTime"
                    value={
                      input.eatTime || input.eatTime === ""
                        ? input.eatTime
                        : mealDetails && mealDetails.eatTime
                        ? mealDetails.eatTime
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </label>
                <div>
                  <div>照片記錄</div>
                  {mealDetails &&
                  mealDetails.images &&
                  mealDetails.images.length > 0
                    ? mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    : ""}
                  {/* {mealDetails && mealDetails.images && input.imageUrl ? (
                    <ShowImages
                      mealDetails={mealDetails}
                      input={input}
                      removeImageHandler={removeImageHandler}
                    />
                  ) : mealDetails && mealDetails.images && !input.imageUrl ? (
                    mealDetails.images.map((i, index) => (
                      <div key={index}>
                        <div id={index} onClick={removeImageHandler}>
                          X
                        </div>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  ) : input.imageUrl ? (
                    input.imageUrl.map((i, index) => (
                      <div key={index}>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  ) : input.images ? (
                    input.images.map((i, index) => (
                      <div key={index}>
                        <div id={index} onClick={removeImageHandler}>
                          X
                        </div>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  ) : (
                    ""
                  )} */}
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    value={value}
                    id="0"
                    multiple="multiple"
                    onChange={getInputHandler}
                  />
                </div>
                <div>
                  <div>請描述飲食內容，越完整越好</div>
                  <input
                    type="textarea"
                    name="description"
                    value={
                      input.description || input.description === ""
                        ? input.description
                        : mealDetails && mealDetails.description
                        ? mealDetails.description
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </div>
                <button className="customerBreakfast" onClick={bindSaveHandler}>
                  儲存
                </button>
              </div>
              {dataAnalysis ? (
                <table className="dietitian-record">
                  <thead>
                    <tr>
                      <th>品項</th>
                      <th>單位:100g</th>
                      <th>熱量(kcal)</th>
                      <th>蛋白質(g)</th>
                      <th>脂質(g)</th>
                      <th>碳水化合物(g)</th>
                      <th>膳食纖維(g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataAnalysis.map((a, index) => (
                      <tr key={index} id={index}>
                        <th>{a.item}</th>
                        <th>{a.per}</th>
                        <th>{a.kcal}</th>
                        <th>{a.protein}</th>
                        <th>{a.lipid}</th>
                        <th>{a.carbohydrate}</th>
                        <th>{a.fiber}</th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </div>
        <div className="meal">
          <div
            className="customerMorning-snack"
            id="morning-snack"
            onClick={getMealHandler}
          >
            早點
          </div>
          {meal === "customerMorning-snack" && count % 2 === 0 ? (
            <>
              {" "}
              <div className="diet-record">
                <label>
                  進食時間{" "}
                  <input
                    type="time"
                    name="eatTime"
                    value={
                      input.eatTime || input.eatTime === ""
                        ? input.eatTime
                        : mealDetails && mealDetails.eatTime
                        ? mealDetails.eatTime
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </label>
                <div>
                  <div>照片記錄</div>
                  {mealDetails &&
                  mealDetails.images &&
                  mealDetails.images.length > 0
                    ? mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    : ""}
                  {/* {mealDetails && mealDetails.images && input.imageUrl ? (
                    <ShowImages
                      mealDetails={mealDetails}
                      input={input}
                      removeImageHandler={removeImageHandler}
                    />
                  ) : mealDetails && mealDetails.images && !input.imageUrl ? (
                    mealDetails.images.map((i, index) => (
                      <div key={index}>
                        <div id={index} onClick={removeImageHandler}>
                          X
                        </div>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  ) : input.imageUrl ? (
                    input.imageUrl.map((i, index) => (
                      <div key={index}>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  ) : input.images ? (
                    input.images.map((i, index) => (
                      <div key={index}>
                        <div id={index} onClick={removeImageHandler}>
                          X
                        </div>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  ) : (
                    ""
                  )} */}
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    id="0"
                    multiple="multiple"
                    onChange={getInputHandler}
                  />
                </div>
                <div>
                  <div>請描述飲食內容，越完整越好</div>
                  <input
                    type="textarea"
                    name="description"
                    value={
                      input.description || input.description === ""
                        ? input.description
                        : mealDetails && mealDetails.description
                        ? mealDetails.description
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </div>
                <button
                  className="customerMorning-snack"
                  onClick={bindSaveHandler}
                >
                  儲存
                </button>
              </div>
              {dataAnalysis ? (
                <table className="dietitian-record">
                  <thead>
                    <tr>
                      <th>品項</th>
                      <th>單位:100g</th>
                      <th>熱量(kcal)</th>
                      <th>蛋白質(g)</th>
                      <th>脂質(g)</th>
                      <th>碳水化合物(g)</th>
                      <th>膳食纖維(g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>牛肉</th>
                      <th>0</th>
                      <th>0</th>
                      <th>0</th>
                      <th>0</th>
                      <th>0</th>
                      <th>0</th>
                    </tr>
                  </tbody>
                </table>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </div>
        <div className="meal">
          <div className="customerLunch" id="lunch" onClick={getMealHandler}>
            午餐
          </div>
          {meal === "customerLunch" && count % 2 === 0 ? (
            <>
              {" "}
              <div className="diet-record">
                <label>
                  進食時間{" "}
                  <input
                    type="time"
                    name="eatTime"
                    value={
                      input.eatTime || input.eatTime === ""
                        ? input.eatTime
                        : mealDetails && mealDetails.eatTime
                        ? mealDetails.eatTime
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </label>
                <div>
                  <div>照片記錄</div>
                  {mealDetails &&
                  mealDetails.images &&
                  mealDetails.images.length > 0
                    ? mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    : ""}
                  {/* {mealDetails && mealDetails.images && input.imageUrl ? (
                    <ShowImages
                      mealDetails={mealDetails}
                      input={input}
                      removeImageHandler={removeImageHandler}
                    />
                  ) : mealDetails && mealDetails.images && !input.imageUrl ? (
                    mealDetails.images.map((i, index) => (
                      <div key={index}>
                        <div id={index} onClick={removeImageHandler}>
                          X
                        </div>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  ) : input.imageUrl ? (
                    input.imageUrl.map((i, index) => (
                      <div key={index}>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  ) : input.images ? (
                    input.images.map((i, index) => (
                      <div key={index}>
                        <div id={index} onClick={removeImageHandler}>
                          X
                        </div>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  ) : (
                    ""
                  )} */}
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    id="0"
                    multiple="multiple"
                    onChange={getInputHandler}
                  />
                </div>
                <div>
                  <div>請描述飲食內容，越完整越好</div>
                  <input
                    type="textarea"
                    name="description"
                    value={
                      input.description || input.description === ""
                        ? input.description
                        : mealDetails && mealDetails.description
                        ? mealDetails.description
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </div>
                <button className="customerLunch" onClick={bindSaveHandler}>
                  儲存
                </button>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
        <div className="meal">
          <div
            className="customerAfternoon-snack"
            id="afternoon-snack"
            onClick={getMealHandler}
          >
            午點
          </div>
          {meal === "customerAfternoon-snack" && count % 2 === 0 ? (
            <>
              <div className="diet-record">
                <label>
                  進食時間{" "}
                  <input
                    type="time"
                    name="eatTime"
                    value={
                      input.eatTime || input.eatTime === ""
                        ? input.eatTime
                        : mealDetails && mealDetails.eatTime
                        ? mealDetails.eatTime
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </label>
                <div>
                  <div>照片記錄</div>
                  {mealDetails &&
                  mealDetails.images &&
                  mealDetails.images.length > 0
                    ? mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    : ""}
                  {/* {mealDetails && mealDetails.images && input.imageUrl ? (
                    <ShowImages
                      mealDetails={mealDetails}
                      input={input}
                      removeImageHandler={removeImageHandler}
                    />
                  ) : mealDetails && mealDetails.images && !input.imageUrl ? (
                    mealDetails.images.map((i, index) => (
                      <div key={index}>
                        <div id={index} onClick={removeImageHandler}>
                          X
                        </div>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  ) : input.images && input.imageUrl ? (
                    <ShowImages
                      mealDetails={mealDetails}
                      input={input}
                      removeImageHandler={removeImageHandler}
                    />
                  ) : input.images && !input.imageUrl ? (
                    input.images.map((i, index) => (
                      <div key={index}>
                        <div id={index} onClick={removeImageHandler}>
                          X
                        </div>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  ) : input.imageUrl ? (
                    input.imageUrl.map((i, index) => (
                      <div key={index}>
                        <div id={index} onClick={removeImageHandler}>
                          X
                        </div>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  ) : (
                    ""
                  )} */}
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    id="0"
                    multiple="multiple"
                    onChange={getInputHandler}
                  />
                </div>
                <div>
                  <div>請描述飲食內容，越完整越好</div>
                  <input
                    type="textarea"
                    name="description"
                    value={
                      input.description || input.description === ""
                        ? input.description
                        : mealDetails && mealDetails.description
                        ? mealDetails.description
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </div>
                <button
                  className="customerAfternoon-snack"
                  onClick={bindSaveHandler}
                >
                  儲存
                </button>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
        <div className="meal">
          <div className="customerDinner" id="dinner" onClick={getMealHandler}>
            晚餐
          </div>
          {meal === "customerDinner" && count % 2 === 0 ? (
            <>
              <div className="diet-record">
                <label>
                  進食時間{" "}
                  <input
                    type="time"
                    name="eatTime"
                    value={
                      input.eatTime || input.eatTime === ""
                        ? input.eatTime
                        : mealDetails && mealDetails.eatTime
                        ? mealDetails.eatTime
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </label>
                <div>
                  <div>照片記錄</div>
                  {mealDetails &&
                  mealDetails.images &&
                  mealDetails.images.length > 0
                    ? mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    : ""}
                  {/* {mealDetails && mealDetails.images && input.imageUrl ? (
                    <ShowImages
                      mealDetails={mealDetails}
                      input={input}
                      removeImageHandler={removeImageHandler}
                    />
                  ) : mealDetails && mealDetails.images && !input.imageUrl ? (
                    mealDetails.images.map((i, index) => (
                      <div key={index}>
                        <div id={index} onClick={removeImageHandler}>
                          X
                        </div>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  ) : input.imageUrl ? (
                    input.imageUrl.map((i, index) => (
                      <div key={index}>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  ) : input.images ? (
                    input.images.map((i, index) => (
                      <div key={index}>
                        <div id={index} onClick={removeImageHandler}>
                          X
                        </div>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  ) : (
                    ""
                  )} */}
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    id="0"
                    multiple="multiple"
                    onChange={getInputHandler}
                  />
                </div>
                <div>
                  <div>請描述飲食內容，越完整越好</div>
                  <input
                    type="textarea"
                    name="description"
                    value={
                      input.description || input.description === ""
                        ? input.description
                        : mealDetails && mealDetails.description
                        ? mealDetails.description
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </div>
                <button className="customerDinner" onClick={bindSaveHandler}>
                  儲存
                </button>
              </div>
              {dataAnalysis ? (
                <table className="dietitian-record">
                  <thead>
                    <tr>
                      <th>品項</th>
                      <th>單位:100g</th>
                      <th>熱量(kcal)</th>
                      <th>蛋白質(g)</th>
                      <th>脂質(g)</th>
                      <th>碳水化合物(g)</th>
                      <th>膳食纖維(g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataAnalysis.map((a, index) => (
                      <tr key={index} id={index}>
                        <th>{a.item}</th>
                        <th>{a.per}</th>
                        <th>{a.kcal}</th>
                        <th>{a.protein}</th>
                        <th>{a.lipid}</th>
                        <th>{a.carbohydrate}</th>
                        <th>{a.fiber}</th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </div>
        <div className="meal">
          <div
            className="customerNight-snack"
            id="night-snack"
            onClick={getMealHandler}
          >
            晚點
          </div>
          {meal === "customerNight-snack" && count % 2 === 0 ? (
            <>
              <div className="diet-record">
                <label>
                  進食時間{" "}
                  <input
                    type="time"
                    name="eatTime"
                    value={
                      input.eatTime || input.eatTime === ""
                        ? input.eatTime
                        : mealDetails && mealDetails.eatTime
                        ? mealDetails.eatTime
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </label>
                <div>
                  <div>照片記錄</div>
                  {mealDetails &&
                  mealDetails.images &&
                  mealDetails.images.length > 0
                    ? mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    : ""}
                  {/* {mealDetails && mealDetails.images && input.imageUrl ? (
                    <ShowImages
                      mealDetails={mealDetails}
                      input={input}
                      removeImageHandler={removeImageHandler}
                    />
                  ) : mealDetails && mealDetails.images && !input.imageUrl ? (
                    mealDetails.images.map((i, index) => (
                      <div key={index}>
                        <div id={index} onClick={removeImageHandler}>
                          X
                        </div>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  ) : input.imageUrl ? (
                    input.imageUrl.map((i, index) => (
                      <div key={index}>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  ) : input.images ? (
                    input.images.map((i, index) => (
                      <div key={index}>
                        <div id={index} onClick={removeImageHandler}>
                          X
                        </div>
                        <a href={i} target="_blank" rel="noreferrer noopener">
                          <img
                            src={i}
                            alt="customer"
                            style={{ width: "200px", height: "200px" }}
                          />
                        </a>
                      </div>
                    ))
                  ) : (
                    ""
                  )} */}
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    id="0"
                    multiple="multiple"
                    onChange={getInputHandler}
                  />
                </div>
                <div>
                  <div>請描述飲食內容，越完整越好</div>
                  <input
                    type="textarea"
                    name="description"
                    value={
                      input.description || input.description === ""
                        ? input.description
                        : mealDetails && mealDetails.description
                        ? mealDetails.description
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </div>
                <button
                  className="customerNight-snack"
                  onClick={bindSaveHandler}
                >
                  儲存
                </button>
              </div>
              {dataAnalysis ? (
                <table className="dietitian-record">
                  <thead>
                    <tr>
                      <th>品項</th>
                      <th>單位:100g</th>
                      <th>熱量(kcal)</th>
                      <th>蛋白質(g)</th>
                      <th>脂質(g)</th>
                      <th>碳水化合物(g)</th>
                      <th>膳食纖維(g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataAnalysis.map((a, index) => (
                      <tr key={index} id={index}>
                        <th>{a.item}</th>
                        <th>{a.per}</th>
                        <th>{a.kcal}</th>
                        <th>{a.protein}</th>
                        <th>{a.lipid}</th>
                        <th>{a.carbohydrate}</th>
                        <th>{a.fiber}</th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </div>

        <hr />
        <Analysis date={date} cID={cID} data={dataAnalysis} />
        <hr />
      </div>
    </>
  );
}

function Analysis({ date, cID, data }) {
  const pathName = useLocation().pathname;
  const [breakfast, setBreakfast] = useState({});
  const [morning, setMorning] = useState({});
  const [lunch, setLunch] = useState({});
  const [afternoon, setAfternoon] = useState({});
  const [dinner, setDinner] = useState({});
  const [night, setNight] = useState({});
  const [dID, setDID] = useState("");
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    firebase
      .firestore()
      .collection("customers")
      .doc(cID)
      .get()
      .then((doc) => {
        setDID(doc.data().dietitian);
        return doc.data().dietitian;
      })
      .then((res) => {
        firebase
          .firestore()
          .collection("dietitians")
          .doc(res)
          .collection("customers")
          .doc(cID)
          .collection("diet")
          .doc(date)
          .get()
          .then((doc) => {
            if (doc.exists && doc.data()["advice"]) {
              setAdvice(doc.data()["advice"]);
            } else {
              setAdvice("");
            }
            if (doc.exists) {
              getMealAnalysis(doc.data()["breakfast"], setBreakfast);
              getMealAnalysis(doc.data()["morning-snack"], setMorning);
              getMealAnalysis(doc.data()["lunch"], setLunch);
              getMealAnalysis(doc.data()["afternoon-snack"], setAfternoon);
              getMealAnalysis(doc.data()["dinner"], setDinner);
              getMealAnalysis(doc.data()["night-snack"], setNight);
            } else {
              setBreakfast("");
              setMorning("");
              setLunch("");
              setAfternoon("");
              setDinner("");
              setNight("");
            }
          });
      });
  }, [date, data]);

  const calculator = (target, setMealNutrients) => {
    const reducer = (acc, cur) => acc + cur;

    const kcalTotal = target.map((i) => i.kcal).reduce(reducer, 0);
    const proteinTotal = target.map((i) => i.protein).reduce(reducer, 0);
    const lipidTotal = target.map((i) => i.lipid).reduce(reducer, 0);
    const carbohydrateTotal = target
      .map((i) => i.carbohydrate)
      .reduce(reducer, 0);
    const fiberTotal = target.map((i) => i.fiber).reduce(reducer, 0);
    setMealNutrients({
      kcal: parseFloat(kcalTotal.toFixed(1)),
      protein: parseFloat(proteinTotal.toFixed(1)),
      lipid: parseFloat(lipidTotal.toFixed(1)),
      carbohydrate: parseFloat(carbohydrateTotal.toFixed(1)),
      fiber: parseFloat(fiberTotal.toFixed(1)),
    });
  };

  const getMealAnalysis = (data, setMealNutrients) => {
    if (data) {
      calculator(data, setMealNutrients);
    } else {
      setMealNutrients("");
    }
  };

  const getNutrientTotal = (item) => {
    const nutritiendArray = [];
    nutritiendArray.push(
      breakfast[item],
      morning[item],
      lunch[item],
      afternoon[item],
      dinner[item],
      night[item]
    );
    return nutritiendArray
      .filter((i) => i !== undefined)
      .map((i) => parseFloat(i))
      .reduce((acc, cur) => acc + cur, 0);
  };

  const bindAdviceHandler = (e) => {
    setAdvice(e.target.value);
  };

  const bindSaveAdviceHandler = () => {
    firebase
      .firestore()
      .collection("dietitians")
      .doc(dID)
      .collection("customers")
      .doc(cID)
      .collection("diet")
      .doc(date)
      .update({
        advice: advice,
      });
  };

  return (
    <>
      <div id="diet-analysis">
        <h2>{date}飲食分析</h2>
        <table>
          <thead>
            <tr id="table-title">
              <th>　　</th>
              <th>熱量 (kcal)</th>
              <th>蛋白質 (g)</th>
              <th>脂質 (g)</th>
              <th>碳水化合物 (g)</th>
              <th>膳食纖維 (g)</th>
            </tr>
          </thead>
          <tbody>
            <tr id="breakfast">
              <th>早餐</th>
              <th>{breakfast.kcal ? breakfast.kcal : "-"}</th>
              <th>{breakfast.protein ? breakfast.protein : "-"}</th>
              <th>{breakfast.lipid ? breakfast.lipid : "-"}</th>
              <th>{breakfast.carbohydrate ? breakfast.carbohydrate : "-"}</th>
              <th>{breakfast.fiber ? breakfast.fiber : "-"}</th>
            </tr>
            <tr id="morning-snack">
              <th>早點</th>
              <th>{morning.kcal ? morning.kcal : "-"}</th>
              <th>{morning.protein ? morning.protein : "-"}</th>
              <th>{morning.lipid ? morning.lipid : "-"}</th>
              <th>{morning.carbohydrate ? morning.carbohydrate : "-"}</th>
              <th>{morning.fiber ? morning.fiber : "-"}</th>
            </tr>
            <tr id="lunch">
              <th>午餐</th>
              <th>{lunch.kcal ? lunch.kcal : "-"}</th>
              <th>{lunch.protein ? lunch.protein : "-"}</th>
              <th>{lunch.lipid ? lunch.lipid : "-"}</th>
              <th>{lunch.carbohydrate ? lunch.carbohydrate : "-"}</th>
              <th>{lunch.fiber ? lunch.fiber : "-"}</th>
            </tr>
            <tr id="afternoon-snack">
              <th>午點</th>
              <th>{afternoon.kcal ? afternoon.kcal : "-"}</th>
              <th>{afternoon.protein ? afternoon.protein : "-"}</th>
              <th>{afternoon.lipid ? afternoon.lipid : "-"}</th>
              <th>{afternoon.carbohydrate ? afternoon.carbohydrate : "-"}</th>
              <th>{afternoon.fiber ? afternoon.fiber : "-"}</th>
            </tr>
            <tr id="dinner">
              <th>晚餐</th>
              <th>{dinner.kcal ? dinner.kcal : "-"}</th>
              <th>{dinner.protein ? dinner.protein : "-"}</th>
              <th>{dinner.lipid ? dinner.lipid : "-"}</th>
              <th>{dinner.carbohydrate ? dinner.carbohydrate : "-"}</th>
              <th>{dinner.fiber ? dinner.fiber : "-"}</th>
            </tr>
            <tr id="night-snack">
              <th>晚點</th>
              <th>{night.kcal ? night.kcal : "-"}</th>
              <th>{night.protein ? night.protein : "-"}</th>
              <th>{night.lipid ? night.lipid : "-"}</th>
              <th>{night.carbohydrate ? night.carbohydrate : "-"}</th>
              <th>{night.fiber ? night.fiber : "-"}</th>
            </tr>
            <tr id="table-total">
              <th>總和</th>
              <th>{parseFloat(getNutrientTotal("kcal").toFixed(1)) || "-"}</th>
              <th>
                {parseFloat(getNutrientTotal("protein").toFixed(1)) || "-"}
              </th>
              <th>{parseFloat(getNutrientTotal("lipid").toFixed(1)) || "-"}</th>
              <th>
                {parseFloat(getNutrientTotal("carbohydrate").toFixed(1)) || "-"}
              </th>
              <th>{parseFloat(getNutrientTotal("fiber").toFixed(1)) || "-"}</th>
            </tr>
            {/* <tr id="target">
              <th>目標</th>
            </tr>
            <tr id="resr">
              <th>剩餘</th>
            </tr> */}
          </tbody>
        </table>
        {pathName.includes("dietitian") ? (
          <div>
            <div>
              <label>
                給予建議
                <input
                  type="textarea"
                  value={advice}
                  onChange={bindAdviceHandler}
                />
              </label>
            </div>
            <button onClick={bindSaveAdviceHandler}>儲存</button>
          </div>
        ) : (
          <div>
            <div>營養師建議</div>
            <div id="advice">{advice}</div>
          </div>
        )}
      </div>
    </>
  );
}

function RenderDietaryRecord() {
  const [recordDate, setRecordDate] = useState();
  const [getRecord, setGetRecord] = useState(false); //false
  const [count, setCount] = useState(1);
  const params = useParams();

  const getDietaryRecordDate = (e) => {
    if (e.target.value !== "") {
      setRecordDate(e.target.value);
      setCount(1);
      setGetRecord(true);
    }
  };
  if (params.dID) {
    return (
      <>
        <input
          type="date"
          min="2021-05-14"
          max="2021-05-26"
          onChange={getDietaryRecordDate}
          required="required"
        ></input>
        <Router>
          <Link
            to={`/dietitian/${params.dID}/customer/${params.cID}/dietary/`}
          ></Link>
          {getRecord ? (
            <Switch>
              <Route exact path={`/dietitian/:dID/customer/:cID/dietary/`}>
                <DietitianRecord
                  date={recordDate}
                  count={count}
                  setCount={setCount}
                  style={{ boxSizing: "border-box" }}
                />
              </Route>
            </Switch>
          ) : (
            ""
          )}
        </Router>
      </>
    );
  } else {
    return (
      <>
        <input
          type="date"
          min="2021-05-14"
          max="2021-05-31"
          onChange={getDietaryRecordDate}
        ></input>
        <Router>
          <Link to={`/customer/${params.cID}/dietary/`}></Link>
          {getRecord ? (
            <Switch>
              <Route exact path="/customer/:cID/dietary/">
                <CustomerRecord
                  date={recordDate}
                  count={count}
                  setCount={setCount}
                />
              </Route>
            </Switch>
          ) : (
            ""
          )}
        </Router>
      </>
    );
  }
}

export default RenderDietaryRecord;
