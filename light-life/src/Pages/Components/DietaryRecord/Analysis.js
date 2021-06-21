import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getCustomerData,
  getDietData,
  updateDietAdvice,
} from "../../../utils/Firebase.js";
import Swal from "sweetalert2";
import style from "../../../style/dietary.module.scss";
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
  const mealArray = [
    ["breakfast", "早餐", breakfast, setBreakfast],
    ["morning-snack", "早點", morning, setMorning],
    ["lunch", "午餐", lunch, setLunch],
    ["afternoon-snack", "午點", afternoon, setAfternoon],
    ["dinner", "晚餐", dinner, setDinner],
    ["night-snack", "晚點", night, setNight],
  ];

  const nutrient = ["kcal", "protein", "lipid", "carbohydrate", "fiber"];

  const getMealAnalysis = (data, setMealNutrients) => {
    data ? calculator(data, setMealNutrients) : setMealNutrients("");
  };

  useEffect(() => {
    getCustomerData(cID)
      .then((doc) => {
        setDID(doc.data().dietitian);
        return doc.data().dietitian;
      })
      .then((res) => {
        getDietData(res, cID, date).then((doc) => {
          if (doc.exists && doc.data()["advice"]) {
            setAdvice(doc.data()["advice"]);
          } else {
            setAdvice("");
          }
          doc.exists
            ? mealArray.forEach((a) => {
                getMealAnalysis(doc.data()[a[0]], a[3]);
              })
            : mealArray.forEach((a) => {
                a[3]("");
              });
        });
      });
  }, [date, data, cID]); //eslint-disable-line

  const nutrientReduce = (target, nutrient) => {
    const reducer = (acc, cur) => acc + cur;
    return target.map((i) => i[nutrient]).reduce(reducer, 0);
  };

  const parseNutrient = (nutrient) => {
    return parseFloat(nutrient.toFixed(1));
  };

  const calculator = (target, setMealNutrients) => {
    setMealNutrients({
      [nutrient[0]]: parseNutrient(nutrientReduce(target, nutrient[0])),
      [nutrient[1]]: parseNutrient(nutrientReduce(target, nutrient[1])),
      [nutrient[2]]: parseNutrient(nutrientReduce(target, nutrient[2])),
      [nutrient[3]]: parseNutrient(nutrientReduce(target, nutrient[3])),
      [nutrient[4]]: parseNutrient(nutrientReduce(target, nutrient[4])),
    });
  };

  const getNutrientTotal = (item) => {
    const nutrientArray = [];
    mealArray.forEach((m) => {
      nutrientArray.push(m[2][item]);
    });
    return nutrientArray
      .filter((i) => i !== undefined)
      .map((i) => parseFloat(i))
      .reduce((acc, cur) => acc + cur, 0);
  };

  const bindAdviceHandler = (e) => {
    setAdvice(e.target.value);
  };

  const bindSaveAdviceHandler = () => {
    updateDietAdvice(dID, cID, date, { advice: advice }).then(() => {
      Swal.fire({
        text: "儲存建議成功",
        icon: "success",
        confirmButtonText: "確定",
        confirmButtonColor: "#1e4d4e",
      });
    });
  };

  return (
    <>
      <div id="diet-analysis" className={style["diet-analysis"]}>
        <h5>{date} 飲食分析</h5>
        <div className={style["analysis-table"]}>
          <table>
            <thead>
              <tr className={style["item-title"]}>
                <th>　　</th>
                <th>熱量 (kcal)</th>
                <th>蛋白質 (g)</th>
                <th>脂質 (g)</th>
                <th>碳水化合物 (g)</th>
                <th>膳食纖維 (g)</th>
              </tr>
            </thead>
            <tbody>
              {mealArray.map((m) => (
                <tr id={m[0]} key={m[1]}>
                  <th>{m[1]}</th>
                  <th>{m[2].kcal || "-"}</th>
                  <th>{m[2].protein || "-"}</th>
                  <th>{m[2].lipid || "-"}</th>
                  <th>{m[2].carbohydrate || "-"}</th>
                  <th>{m[2].fiber || "-"}</th>
                </tr>
              ))}
              <tr id="table-total">
                <th>總和</th>
                {nutrient.map((m) => (
                  <th key={m}>
                    {parseFloat(getNutrientTotal(`${m}`).toFixed(1)) || "-"}
                  </th>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        {pathName.includes("dietitian") ? (
          <div className={style.advice}>
            <div>
              <label htmlFor="d-advice">
                <h5>給予建議</h5>
              </label>
              <textarea
                id="d-advice"
                value={advice}
                onChange={bindAdviceHandler}
              ></textarea>
            </div>
            <div className={style.button}>
              <button onClick={bindSaveAdviceHandler}>儲存</button>
            </div>
          </div>
        ) : (
          <div className={style.advice}>
            <h5>營養師建議</h5>
            <div className={style["c-advice"]}>{advice}</div>
          </div>
        )}
      </div>
    </>
  );
}

export default Analysis;
