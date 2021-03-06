import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  getCustomerData,
  getCustomerPublish,
  getReserveData,
  setReservation,
} from "../../../utils/Firebase";
import {
  newEndDateRangeHandler,
  dateToISOString,
  transDateToTime,
  getToday,
  setDateHandler,
} from "../../../utils/DatePicker.js";
import Swal from "sweetalert2";
import style from "../../../style/findDietitian.module.scss";
function ReserveForm({ props, setReserve, setIsChecked, reserve }) {
  const { cID } = useParams();
  const { pathname } = useLocation();
  const [input, setInput] = useState({});
  const [profile, setProfile] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [occupationTime, setOccupationTime] = useState([]);
  const [nowReserve, setNowReserve] = useState({});
  const addDate = dateToISOString(getToday());
  const initStartDate = setDateHandler(1);
  const endLessDate = setDateHandler(7);
  const endMostDate = setDateHandler(14);
  const startMostDate = setDateHandler(14);

  useEffect(() => {
    getCustomerData(cID).then((doc) => setProfile(doc.data()));

    setStartDate({
      min: dateToISOString(initStartDate),
      max: dateToISOString(startMostDate),
    });
    setEndDate({
      min: dateToISOString(endLessDate),
      max: dateToISOString(endMostDate),
    });
    getCustomerPublish(cID).then((docs) => {
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
      const now = reserve.find(
        (r) => r.dietitian === props.id && r.status === "0"
      );
      setNowReserve(now);
    }
  }, [props, reserve]);

  const getInputHandler = (e) => {
    const { name } = e.target;
    const selectedDate = transDateToTime(e.target.value);
    const newEndDate =
      name === "reserveStartDate"
        ? newEndDateRangeHandler(
            name,
            "reserveStartDate",
            e.target.value,
            setEndDate,
            dateToISOString
          )
        : "";
    const newEndLessDate = newEndDate.endLessDate;
    const newEndTime = transDateToTime(newEndLessDate);

    if (name === "reserveStartDate" || name === "reserveEndDate") {
      if (
        occupationTime.find(
          (r) => selectedDate >= r[0] && selectedDate <= r[1]
        ) ||
        (name === "reserveStartDate" &&
          occupationTime.find(
            (r) =>
              (selectedDate < r[0] &&
                (transDateToTime(input.reserveEndDate) > r[1] ||
                  newEndTime > r[1])) ||
              (transDateToTime(input.reserveEndDate) >= r[0] &&
                transDateToTime(input.reserveEndDate) <= r[1]) ||
              (newEndTime >= r[0] && newEndTime <= r[1])
          )) ||
        (name === "reserveEndDate" &&
          occupationTime.find(
            (r) =>
              transDateToTime(input.reserveStartDate) < r[0] &&
              selectedDate > r[1]
          ))
      ) {
        Swal.fire({
          text: "??????????????????????????????",
          icon: "warning",
          confirmButtonText: "??????",
          confirmButtonColor: "#1e4d4e",
        }).then(() => {
          setEndDate({
            min: input.minEndDate || dateToISOString(endLessDate),
            max: input.maxEndDate || dateToISOString(endMostDate),
          });
        });
      } else {
        setInput({
          ...input,
          [name]: e.target.value,
          reserveEndDate:
            name === "reserveStartDate" ? newEndLessDate : e.target.value,
          minEndDate: newEndLessDate || input.minEndDate,
          maxEndDate: newEndDate.endMostDate || input.maxEndDate,
          addDate: addDate,
          dietitian: props.id,
          dietitianName: props.name,
          image: props.image,
          inviterID: cID,
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
        inviterID: cID,
        inviterName: profile.name,
        inviterGender: profile.gender,
        status: "0",
      });
    }
  };

  const sendReverseHandler = () => {
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
        text: "?????????????????????????????????????????????",
        icon: "warning",
        confirmButtonText: "??????",
        confirmButtonColor: "#1e4d4e",
      });
    } else if (
      input.reserveStartDate &&
      input.reserveEndDate &&
      input.reserveMessage
    ) {
      Swal.fire({
        text: "????????????????",
        showCancelButton: true,
        cancelButtonText: "??????",
        confirmButtonText: "??????",
        confirmButtonColor: "#1e4d4e",
      }).then((res) => {
        if (res.isConfirmed) {
          setReservation(input)
            .then(() => {
              getReserveData().then((docs) => {
                const reserveArray = [];
                docs.forEach((doc) => {
                  if (doc.data().inviterID === cID) {
                    reserveArray.push(doc.data());
                  }
                });
                setReserve(reserveArray);
              });
            })
            .then(() => {
              Swal.fire({
                text: "???????????????????????????",
                icon: "success",
                confirmButtonText: "??????",
                confirmButtonColor: "#1e4d4e",
              });
              setIsChecked(false);
            })
            .catch((error) => "Error:" + error);
        }
      });
    } else {
      Swal.fire({
        text: "????????????????????????????????????",
        icon: "warning",
        confirmButtonText: "??????",
        confirmButtonColor: "#1e4d4e",
      });
    }
  };

  console.log(nowReserve);

  return (
    <div className={style["reserve-form"]}>
      <div className={style["form-title"]}>
        {pathname.includes("reserve-list") ? "????????????" : "????????????"}
      </div>
      <div className={style.form}>
        {pathname.includes("reserve-list") ? (
          <div className={style.reserveCol}>
            <label className={style.reserveLabel}>
              <div>????????????</div>
              <div>{nowReserve ? nowReserve.reserveStartDate : ""}</div>
            </label>
            <label className={style.reserveLabel}>
              <div>????????????</div>
              <div>{nowReserve ? nowReserve.reserveEndDate : ""}</div>
            </label>
          </div>
        ) : (
          <>
            <div className={style.description}>
              ?????????14???????????????????????????????????????????????????????????????7???????????????14???????????????????????????????????????
            </div>
            <div className={style.flexbox}>
              <label>
                <div>??????</div>
                <input
                  type="date"
                  value={input.reserveStartDate || ""}
                  min={startDate ? startDate.min : ""}
                  max={startDate ? startDate.max : ""}
                  name="reserveStartDate"
                  onChange={getInputHandler}
                />
              </label>
              <label>
                <div>??????</div>
                <input
                  type="date"
                  value={input.reserveEndDate || ""}
                  min={endDate ? endDate.min : ""}
                  max={endDate ? endDate.max : ""}
                  name="reserveEndDate"
                  onChange={getInputHandler}
                />
              </label>
            </div>
          </>
        )}

        {pathname.includes("reserve-list") ? (
          <label className={`${style.reserveLabel} ${style.reserveMessage}`}>
            <div>????????????</div>
            <div>{nowReserve ? nowReserve.reserveMessage : ""}</div>
          </label>
        ) : (
          <>
            <label>
              <div>????????????</div>
              <textarea
                name="reserveMessage"
                onChange={getInputHandler}
              ></textarea>
            </label>
            <div className={style.button}>
              <button onClick={sendReverseHandler}>
                <i className="fa fa-paper-plane" aria-hidden="true"></i>
                ??????????????????
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default ReserveForm;
