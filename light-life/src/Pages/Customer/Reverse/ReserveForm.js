import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";

function ReserveForm({ setIsReserve, props, setReserve, profile }) {
  const params = useParams();
  const today = new Date(+new Date() + 8 * 3600 * 1000);
  const initStartDate = today.toISOString().substr(0, 10);
  const [input, setInput] = useState({});
  const db = firebase.firestore();

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

  const sendReverseHandler = () => {
    const dateTime = Date.now();
    const timestamp = Math.floor(dateTime);
    db.collection("reserve")
      .doc(`${timestamp}`)
      .set(input)
      .then(() => {
        db.collection("reserve")
          .doc(`${timestamp}`)
          .update("id", `${timestamp}`);
      })
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
      .catch((error) => "Error:" + error);
  };

  const bindCancelHandler = () => {
    setIsReserve(false);
  };

  return (
    <div>
      <label>
        開始
        <input type="date" name="reverseStartDate" onChange={getInputHandler} />
      </label>
      <label>
        結束
        <input type="date" name="reverseEndDate" onChange={getInputHandler} />
      </label>

      <div>
        <label>邀請訊息</label>
        <div>
          <input
            type="textarea"
            name="reverseMessage"
            onChange={getInputHandler}
          />
        </div>
      </div>
      <div>
        <button onClick={sendReverseHandler}>發送</button>
        <button onClick={bindCancelHandler}>取消</button>
      </div>
    </div>
  );
}
export default ReserveForm;
