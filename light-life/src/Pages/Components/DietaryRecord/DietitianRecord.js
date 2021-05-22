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
import getIngrediensData from "../../../utils/IngredientsAPI.js";
import Analysis from "./Analysis.js";

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

export default DietitianRecord;
