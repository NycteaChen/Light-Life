import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import Swal from "sweetalert2";
import style from "../../../style/findDietitian.module.scss";
function ReserveForm({ props, setReserve, setIsChecked, reserve }) {
  const params = useParams();
  const [input, setInput] = useState({});
  const db = firebase.firestore();
  const [profile, setProfile] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [occupationTime, setOccupationTime] = useState([]);
  const [nowReserve, setNowReserve] = useState({});
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
  const path = useLocation().pathname;

  const transDateToTime = (date) => {
    const time = new Date(date).getTime();
    return time;
  };
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
    db.collection("publish")
      .where("id", "==", params.cID)
      .get()
      .then((docs) => {
        const occupation = reserve
          .filter((r) => r.status === "0" || r.status === "1")
          .map((u) => [
            transDateToTime(u.reserveStartDate),
            transDateToTime(u.reserveEndDate),
          ]);
        if (!docs.empty) {
          docs.forEach((doc) => {
            if (doc.data().status === "1" || doc.data().status === "0") {
              occupation.push([
                transDateToTime(doc.data().startDate),
                transDateToTime(doc.data().endDate),
              ]);
            }
          });
        }
        setOccupationTime(occupation);
      });
  }, []); //eslint-disable-line

  useEffect(() => {
    if (props) {
      const now = reserve.find((r) => r.dietitian === props.id);
      setNowReserve(now);
    }
  }, [props, reserve]);

  const getInputHandler = (e) => {
    const { name } = e.target;
    const test = transDateToTime(e.target.value);
    if (name === "reserveStartDate" || name === "reserveEndDate") {
      if (
        occupationTime.find((r) => test >= r[0] && test <= r[1]) ||
        (name === "reserveStartDate" &&
          occupationTime.find(
            (r) => test < r[0] && transDateToTime(input.reserveEndDate) > r[1]
          )) ||
        (name === "reserveEndDate" &&
          occupationTime.find(
            (r) => transDateToTime(input.reserveStartDate) < r[0] && test > r[1]
          ))
      ) {
        Swal.fire({
          text: "您所選的區間已有安排",
          icon: "warning",
          confirmButtonText: "確定",
          confirmButtonColor: "#1e4d4e",
        });
      } else {
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
      }
    } else {
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
    }
  };

  const sendReverseHandler = () => {
    console.log(profile);
    if (
      !profile.gender ||
      !profile.name ||
      !profile.weight ||
      !profile.height ||
      !profile.career ||
      !profile.education ||
      !profile.age ||
      !profile.sport
    ) {
      Swal.fire({
        text: "個人資料填寫完整才能執行預約喔",
        icon: "warning",
        confirmButtonText: "確定",
        confirmButtonColor: "#1e4d4e",
      });
    } else if (
      input.reserveStartDate &&
      input.reserveEndDate &&
      input.reserveMessage
    ) {
      const dateTime = Date.now();
      const timestamp = Math.floor(dateTime);
      Swal.fire({
        text: "確定預約嗎?",
        showCancelButton: true,
        cancelButtonText: "取消",
        confirmButtonText: "確定",
        confirmButtonColor: "#1e4d4e",
      }).then((res) => {
        if (res.isConfirmed) {
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
              Swal.fire({
                text: "已發送您的預約邀請",
                icon: "success",
                confirmButtonText: "確定",
                confirmButtonColor: "#1e4d4e",
              });
              setIsChecked(false);
            })
            .catch((error) => "Error:" + error);
        }
      });
    } else {
      Swal.fire({
        text: "日期與邀請訊息都要填寫喔",
        icon: "warning",
        confirmButtonText: "確定",
        confirmButtonColor: "#1e4d4e",
      });
    }
  };

  return (
    <div className={style["reserve-form"]}>
      <div className={style["form-title"]}>
        {path.includes("reserve-list") ? "您的預約" : "現在預約"}
      </div>
      <div className={style.form}>
        {path.includes("reserve-list") ? (
          <div className={style.reserveCol}>
            <label className={style.reserveLabel}>
              <div>開始日期</div>
              <div>{nowReserve ? nowReserve.reserveStartDate : ""}</div>
            </label>
            <label className={style.reserveLabel}>
              <div>結束日期</div>
              <div>{nowReserve ? nowReserve.reserveEndDate : ""}</div>
            </label>
          </div>
        ) : (
          <div className={style.flexbox}>
            <label>
              <div>開始</div>
              <input
                type="date"
                value={input.reserveStartDate ? input.reserveStartDate : ""}
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
                value={input.reserveEndDate ? input.reserveEndDate : ""}
                min={endDate ? endDate.min : ""}
                max={endDate ? endDate.max : ""}
                name="reserveEndDate"
                onChange={getInputHandler}
              />
            </label>
          </div>
        )}

        {path.includes("reserve-list") ? (
          <label className={`${style.reserveLabel} ${style.reserveMessage}`}>
            <div>邀請訊息</div>
            <div>{nowReserve ? nowReserve.reserveMessage : ""}</div>
          </label>
        ) : (
          <>
            <label>
              <div>邀請訊息</div>
              <textarea
                name="reserveMessage"
                onChange={getInputHandler}
              ></textarea>
            </label>
            <div className={style.button}>
              <button onClick={sendReverseHandler}>
                <i class="fa fa-paper-plane" aria-hidden="true"></i>發送預約邀請
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default ReserveForm;
