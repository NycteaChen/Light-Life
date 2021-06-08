import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import TargetHandler from "../../Components/TargetHandler.js";
import style from "../../../style/target.module.scss";
import { setMilliseconds } from "date-fns";

function DietitianTarget() {
  const params = useParams();
  const [date, setDate] = useState({});
  const [target, setTarget] = useState([]);
  const [input, setInput] = useState({});
  const [isClick, setIsClick] = useState(false);
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

  const bindAddTarget = (e) => {
    const { id } = e.target;
    switch (id) {
      case "add":
        if (
          input.startDate &&
          input.endDate &&
          input.weight &&
          input.water &&
          input.other
        ) {
          const dateTime = Date.now();
          const timestamp = Math.floor(dateTime);
          Swal.fire({
            text: "確定新增嗎嗎?",
            showCancelButton: true,
            cancelButtonText: "取消",
            confirmButtonText: "確定",
            confirmButtonColor: "#1e4d4e",
          }).then((result) => {
            if (result.isConfirmed) {
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
              setIsClick(false);
            }
          });
        } else {
          alert("請填寫完整");
        }

        break;
      case "cancel":
        setIsClick(false);
        break;
      case "new":
        setIsClick(true);
    }
  };

  return (
    <div className={style["target-setting"]} id="dietitian-target">
      <div className={style.flex}>
        <h5>已設立目標</h5>
        <button onClick={bindAddTarget} id="new" className={style.new}>
          新增
        </button>
      </div>
      <div className={style["customer-targets"]}>
        <TargetHandler target={target} setTarget={setTarget} />
      </div>
      {isClick ? (
        <div className={`${style["add-new-target"]} animated animate__fadeIn`}>
          <h5>新增目標</h5>
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
                type="number"
                name="weight"
                className={style["set-content"]}
                onChange={getInputHandler}
              />
            </label>

            <label className={style.flexbox}>
              <div>目標水分</div>
              <input
                type="number"
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
          <div className={style.buttons}>
            <button onClick={bindAddTarget} className={style.add} id="add">
              新增
            </button>
            <button
              onClick={bindAddTarget}
              className={style.cancle}
              id="cancel"
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
export default DietitianTarget;
