import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import style from "../../../style/findDietitian.module.scss";
import InputGroupWithExtras from "react-bootstrap/esm/InputGroup";
// , profile
function ReserveForm({ props, setReserve, setIsChecked }) {
  const params = useParams();
  const today = new Date(+new Date() + 8 * 3600 * 1000);
  const initStartDate = today.toISOString().substr(0, 10);
  const [input, setInput] = useState({});
  const db = firebase.firestore();
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    db.collection("customers")
      .doc(params.cID)
      .get()
      .then((doc) => {
        setProfile(doc.data());
      });
  }, []);

  const getInputHandler = (e) => {
    const { name } = e.target;
    setInput({
      ...input,
      [name]: e.target.value,
      addDate: initStartDate,
      dietitian: props.id,
      dietitianName: props.name,
      image: props.image,
      inviterID: params.cID,
      inviterName: profile.name,
      inviterGender: profile.gender,
      status: "0",
    });
  };

  console.log(profile);

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
      console.log(profile);
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
              name="reserveStartDate"
              onChange={getInputHandler}
            />
          </label>
          <label>
            <div>結束</div>
            <input
              type="date"
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
