import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getCustomerData,
  getDietData,
  updateDietAdvice,
} from "../../../utils/Firebase";
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
          if (doc.exists) {
            const getMealAnalysis = (data, setMealNutrients) => {
              if (data) {
                calculator(data, setMealNutrients);
              } else {
                setMealNutrients("");
              }
            };
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
  }, [date, data, cID]);

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

  const getNutrientTotal = (item) => {
    const nutrientArray = [];
    nutrientArray.push(
      breakfast[item],
      morning[item],
      lunch[item],
      afternoon[item],
      dinner[item],
      night[item]
    );
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

  const mealArray = [
    ["breakfast", "早餐", breakfast],
    ["morning-snack", "早點", morning],
    ["lunch", "午餐", lunch],
    ["afternoon-snack", "午點", afternoon],
    ["dinner", "晚餐", dinner],
    ["night-snack", "晚點", night],
  ];
  const nutrient = ["kcal", "protein", "lipid", "carbohydrate", "fiber"];

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
                <tr id={m[0]}>
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
                  <th>
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
