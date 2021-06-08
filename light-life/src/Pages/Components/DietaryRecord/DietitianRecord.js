import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import { useParams } from "react-router-dom";
import "firebase/firestore";
import getIngrediensData from "../../../utils/IngredientsAPI.js";
import Analysis from "./Analysis.js";
import style from "../../../style/dietary.module.scss";

function DietitianRecord({ date }) {
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
  const [active, setAcitve] = useState("");

  useEffect(async () => {
    await getIngrediensData().then((res) => {
      setIngredients(res);
    });
  }, []);

  useEffect(() => {
    setMeal([]);
    setAcitve("");
  }, [date]);

  const getMealHandler = (e) => {
    const mealClass = e.target.className.split(" ")[1];
    const { id } = e.target;
    setAcitve({ [id]: style["li-active"] });
    setInput(initInput);
    setIsSelected(false);
    setMeal([mealClass, e.target.id]);
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
        if (doc.exists && doc.data()[mealClass]) {
          setMealDetails(doc.data()[mealClass]);
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
    if (meal[0] === e.target.className.split(" ")[1]) {
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
    }
  };

  window.addEventListener("click", (e) => {
    if (!e.target.className.includes("searchBox")) {
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
      ...dataAnalysis.filter((d, index) => index !== +e.target.id),
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
            ...dataAnalysis.filter((d, index) => index !== +e.target.id),
          ],
        },
        { merge: true }
      );
  };

  const mealKeywords = [
    ["早餐", "customerBreakfast", "breakfast"],
    ["早點", "customerMorning-snack", "morning-snack"],
    ["午餐", "customerLunch", "lunch"],
    ["午點", "customerAfternoon-snack", "afternoon-snack"],
    ["晚餐", "customerDinner", "dinner"],
    ["晚點", "customerNight-snack", "night-snack"],
  ];

  return (
    <>
      <ul>
        {mealKeywords.map((m) => (
          <li
            className={`${style["meal-title"]} ${m[1]} ${active[m[2]] || ""}`}
            id={`${m[2]}`}
            onClick={getMealHandler}
          >
            {m[0]}
          </li>
        ))}
      </ul>
      <div className={`${style.mealCol}`}>
        <h5>{date} 飲食記錄</h5>
        {mealKeywords.map((m) => (
          <div className={style.meal}>
            {meal[0] === m[1] ? (
              <>
                <div className={`${style["diet-record"]} ${style.col}`}>
                  <label className={style["eat-time"]}>
                    <div className={style.title}>進食時間</div>
                    <div id="eat-time">{mealDetails.eatTime || ""}</div>
                  </label>

                  <div className={style.col}>
                    <div className={`${style["image-record"]} ${style.title}`}>
                      照片記錄
                    </div>
                    <div className={style["food-images"]}>
                      {mealDetails &&
                      mealDetails.images &&
                      mealDetails.images.length > 0 ? (
                        mealDetails.images.map((i, index) => (
                          <div className={style["food-image"]} key={index}>
                            <a
                              href={i}
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              <img src={i} alt="customer" />
                            </a>
                          </div>
                        ))
                      ) : (
                        <div>尚未上傳照片</div>
                      )}
                    </div>
                  </div>

                  <div className={`${style.col} ${style["meal-content"]}`}>
                    <div className={style.title}>飲食內容</div>
                    <div className={style["content-text"]}>
                      {mealDetails.description || ""}
                    </div>
                  </div>
                </div>

                <div className={style["dietitian-record"]}>
                  <table>
                    <thead>
                      <tr className={style["item-title"]}>
                        <th></th>
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
                              <th>
                                <div style={{ width: "30px" }}>
                                  <i
                                    id={index}
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                    onClick={removeItemHandler}
                                  ></i>
                                </div>
                              </th>
                              <th>{a.item}</th>
                              <th>{a.per}</th>
                              <th>{a.kcal}</th>
                              <th>{a.protein}</th>
                              <th>{a.lipid}</th>
                              <th>{a.carbohydrate}</th>
                              <th>{a.fiber}</th>
                            </tr>
                          ))
                        : null}
                      <tr className={style["food-input"]}>
                        <th>
                          <div style={{ width: "30px" }}></div>
                        </th>
                        <th style={{ position: "relative" }}>
                          <input
                            type="text"
                            name="item"
                            value={input.item ? input.item : ""}
                            placeholder="請輸入食材"
                            autoComplete="off"
                            className={style["input-item"]}
                            onBlur={inputItemHandler}
                            onClick={inputItemHandler}
                            onChange={getInputHandler}
                            onInput={getSearchHandler}
                          />
                          {inputValue.length > 0 && isDisplay ? (
                            <div className={style.searchBox}>
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
                            value={input.per ? input.per : ""}
                            min="0"
                            onChange={getInputHandler}
                            className={style["input-number"]}
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
                                value={input.kcal ? input.kcal : ""}
                                min="0"
                                onChange={getInputHandler}
                                className={style["input-number"]}
                              />
                            </th>
                            <th>
                              <input
                                type="number"
                                name="protein"
                                value={input.protein ? input.protein : ""}
                                min="0"
                                onChange={getInputHandler}
                                className={style["input-number"]}
                              />
                            </th>
                            <th>
                              <input
                                type="number"
                                name="lipid"
                                value={input.lipid ? input.lipid : ""}
                                min="0"
                                onChange={getInputHandler}
                                className={style["input-number"]}
                              />
                            </th>
                            <th>
                              <input
                                type="number"
                                name="carbohydrate"
                                value={
                                  input.carbohydrate ? input.carbohydrate : ""
                                }
                                min="0"
                                onChange={getInputHandler}
                                className={style["input-number"]}
                              />
                            </th>
                            <th>
                              <input
                                type="number"
                                name="fiber"
                                value={input.fiber ? input.fiber : ""}
                                min="0"
                                onChange={getInputHandler}
                                className={style["input-number"]}
                              />
                            </th>
                          </>
                        )}
                      </tr>
                    </tbody>
                    <tfoot>
                      <tr>
                        <th></th>
                        <th
                          className={`${style["meal-plus"]} ${m[1]}`}
                          onClick={addNewFoodTable}
                        ></th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </>
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
      <Analysis date={date} dID={dID} cID={cID} data={dataAnalysis} />
    </>
  );
}

export default DietitianRecord;
