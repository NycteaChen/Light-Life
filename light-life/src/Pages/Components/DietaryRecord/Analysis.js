import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import { useLocation, useParams } from "react-router-dom";
import "firebase/firestore";
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
      })
      .then(() => {
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
                <th>
                  {parseFloat(getNutrientTotal("kcal").toFixed(1)) || "-"}
                </th>
                <th>
                  {parseFloat(getNutrientTotal("protein").toFixed(1)) || "-"}
                </th>
                <th>
                  {parseFloat(getNutrientTotal("lipid").toFixed(1)) || "-"}
                </th>
                <th>
                  {parseFloat(getNutrientTotal("carbohydrate").toFixed(1)) ||
                    "-"}
                </th>
                <th>
                  {parseFloat(getNutrientTotal("fiber").toFixed(1)) || "-"}
                </th>
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
