import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { useParams } from "react-router-dom";
import TargetHandler from "../../Components/TargetHandler.js";
import style from "../../../style/target.module.scss";

function DietitianTarget() {
  const params = useParams();
  const [date, setDate] = useState({});
  const [target, setTarget] = useState([]);
  const [input, setInput] = useState({});
  const [leastEndDate, setLeastEndDate] = useState(false);
  const today = new Date(+new Date() + 8 * 3600 * 1000);
  const initStartDate = today.toISOString().substr(0, 10);
  const db = firebase.firestore();

  useEffect(() => {
    db.collection("dietitians")
      .doc(params.dID)
      .collection("customers")
      .doc(params.cID)
      .get()
      .then((doc) => setDate(doc.data()));
  }, []);

  useEffect(() => {
    db.collection("dietitians")
      .doc(params.dID)
      .collection("customers")
      .doc(params.cID)
      .collection("target")
      .get()
      .then((docs) => {
        const targetArray = [];
        docs.forEach((doc) => {
          targetArray.push(doc.data());
        });
        setTarget(targetArray);
      });
  }, []);

  const bindChangeDateRange = (e) => {
    const date = new Date(+new Date() + 8 * 3600 * 1000);
    date.setDate(+e.target.value.split("-")[2] + 1);
    setLeastEndDate(date.toISOString().substr(0, 10));
  };

  const getInputHandler = (e) => {
    const { name } = e.target;
    setInput({ ...input, [name]: e.target.value, addDate: initStartDate });
  };

  const bindAddTarget = () => {
    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime);
    db.collection("dietitians")
      .doc(params.dID)
      .collection("customers")
      .doc(params.cID)
      .collection("target")
      .doc(`${timestamp}`)
      .set(input)
      .catch((error) => {
        console.error("Error:", error);
      });
    setTarget([...target, input]);
  };

  return (
    <div className={style["target-setting"]} id="dietitian-target">
      <h3>已設立目標</h3>
      <div className={style["customer-targets"]}>
        <TargetHandler target={target} setTarget={setTarget} />
      </div>
      <h3>新增目標</h3>
      <div className={style["add-new-target"]}>
        <div className={style.col}>
          <label className={style.flexbox}>
            <div>開始日期</div>
            <input
              type="date"
              id="target-start"
              name="startDate"
              className={style["set-content"]}
              min={initStartDate}
              max={date.endDate ? `${date.endDate}` : ""}
              onChange={(e) => {
                bindChangeDateRange(e);
                getInputHandler(e);
              }}
            />
          </label>
          <label className={style.flexbox}>
            <div>結束日期</div>
            <input
              type="date"
              id="target-end"
              name="endDate"
              className={style["set-content"]}
              min={leastEndDate ? leastEndDate : initStartDate}
              max={date.endDate ? `${date.endDate}` : ""}
              onChange={getInputHandler}
            />
          </label>
        </div>
        <div className={style.col}>
          <label className={style.flexbox}>
            <div>目標體重</div>
            <input
              type="text"
              name="weight"
              className={style["set-content"]}
              onChange={getInputHandler}
            />
          </label>

          <label className={style.flexbox}>
            <div>目標水分</div>
            <input
              type="text"
              name="water"
              className={style["set-content"]}
              onChange={getInputHandler}
            />
          </label>
        </div>
        <div className={style["target-other"]}>
          <label className={style.flexbox}>
            <div>其他</div>
            <textarea
              name="other"
              className={style["set-content"]}
              onChange={getInputHandler}
            />
          </label>
        </div>
        <button onClick={bindAddTarget}>新增</button>
      </div>
    </div>
  );
}
export default DietitianTarget;
