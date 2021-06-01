import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import style from "../../../style/findDietitian.module.scss";
import InputGroupWithExtras from "react-bootstrap/esm/InputGroup";
// , profile
function ReserveForm({ props, setReserve, setIsChecked }) {
  const params = useParams();
  const [input, setInput] = useState({});
  const db = firebase.firestore();
  const [profile, setProfile] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const today = new Date(+new Date() + 8 * 3600 * 1000);
  const addDate = today.toISOString().substr(0, 10);
  const initStartDate = new Date(+new Date() + 8 * 3600 * 1000);
  const endLessDate = new Date(+new Date() + 8 * 3600 * 1000);
  const endMostDate = new Date(+new Date() + 8 * 3600 * 1000);
  const startMostDate = new Date(+new Date() + 8 * 3600 * 1000);
  initStartDate.setDate(initStartDate.getDate() + 1);
  startMostDate.setDate(startMostDate.getDate() + 14);
  endLessDate.setDate(endLessDate.getDate() + 7);
  endMostDate.setDate(endMostDate.getDate() + 14);

  useEffect(() => {
    db.collection("customers")
      .doc(params.cID)
      .get()
      .then((doc) => {
        setProfile(doc.data());
      });
    setStartDate({
      min: initStartDate.toISOString().substr(0, 10),
      max: startMostDate.toISOString().substr(0, 10),
    });
    setEndDate({
      min: endLessDate.toISOString().substr(0, 10),
      max: endMostDate.toISOString().substr(0, 10),
    });
    setInput({
      reserveStartDate: initStartDate.toISOString().substr(0, 10),
      reserveEndDate: endLessDate.toISOString().substr(0, 10),
    });
  }, []);

  const getInputHandler = (e) => {
    console.log(e.target);
    const { name } = e.target;
    if (name === "reserveStartDate") {
      const newEndLessDate = new Date();
      const newEndMostDate = new Date();

      newEndLessDate.setDate(parseInt(e.target.value.split("-")[2]) + 7);
      newEndMostDate.setDate(parseInt(e.target.value.split("-")[2]) + 14);

      setEndDate({
        min: newEndLessDate.toISOString().substr(0, 10),
        max: newEndMostDate.toISOString().substr(0, 10),
      });
    }
    setInput({
      ...input,
      [name]: e.target.value,
      addDate: addDate,
      dietitian: props.id,
      dietitianName: props.name,
      image: props.image,
      inviterID: params.cID,
      inviterName: profile.name,
      inviterGender: profile.gender,
      status: "0",
    });
  };

  const sendReverseHandler = () => {
    if (
      !profile.gender ||
      !profile.name ||
      !profile.weight ||
      !profile.height ||
      !profile.career ||
      !profile.education ||
      !profile.age
    ) {
      alert("您的個人資料尚未填寫完整喔");
    } else if (
      input.reserveStartDate &&
      input.reserveEndDate &&
      input.reserveMessage
    ) {
      const dateTime = Date.now();
      const timestamp = Math.floor(dateTime);
      db.collection("reserve")
        .doc(`${timestamp}`)
        .set({ ...input, reserveID: `${timestamp}` })
        .then(() => {
          db.collection("reserve")
            .get()
            .then((docs) => {
              const reserveArray = [];
              docs.forEach((doc) => {
                if (doc.data().inviterID === params.cID) {
                  reserveArray.push(doc.data());
                }
              });
              setReserve(reserveArray);
            });
        })
        .then(() => {
          alert("已發送!");
          setIsChecked(false);
        })
        .catch((error) => "Error:" + error);
    } else {
      alert("請填寫日期與訊息");
    }
  };

  return (
    <div className={style["reserve-form"]}>
      <div className={style["form-title"]}>現在預約</div>
      <div className={style.form}>
        <div>
          <label>
            <div>開始</div>
            <input
              type="date"
              value={
                input.reserveStartDate
                  ? input.reserveStartDate
                  : startDate
                  ? startDate.min
                  : ""
              }
              min={startDate ? startDate.min : ""}
              max={startDate ? startDate.max : ""}
              name="reserveStartDate"
              onChange={getInputHandler}
            />
          </label>
          <label>
            <div>結束</div>
            <input
              type="date"
              value={
                input.reserveEndDate
                  ? input.reserveEndDate
                  : endDate
                  ? endDate.min
                  : ""
              }
              min={endDate ? endDate.min : ""}
              max={endDate ? endDate.max : ""}
              name="reserveEndDate"
              onChange={getInputHandler}
            />
          </label>
        </div>

        <label>
          <div>邀請訊息</div>
          <textarea name="reserveMessage" onChange={getInputHandler}></textarea>
        </label>
        <div>
          <button onClick={sendReverseHandler}>發送預約邀請</button>
        </div>
      </div>
    </div>
  );
}
export default ReserveForm;
