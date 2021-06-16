import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import Swal from "sweetalert2";
import DietitianData from "../FindDietitians/DietitianData.js";
import style from "../../../style/reserveList.module.scss";
import image from "../../../style/image.module.scss";
import nothing from "../../../images/nothing.svg";
function ReserveList({ reserve, setReserve }) {
  const [index, setIndex] = useState();
  const [dietitians, setDietitians] = useState([]);
  const [isChecked, setIsChecked] = useState(false); //false
  const [checkDecline, setCheckDecline] = useState(false);
  useEffect(() => {
    const dietitianArray = [];
    reserve
      .filter((r) => r.status === "0")
      .forEach((r) => {
        firebase
          .firestore()
          .collection("dietitians")
          .doc(r.dietitian)
          .get()
          .then((doc) => {
            if (doc.exists) {
              dietitianArray.push(doc.data());
              setDietitians(dietitianArray);
            }
          });
      });
  }, [reserve]);
  const checkDeclineMessage = (e) => {
    if (e.target.id) {
      setIndex(e.target.id);
      setCheckDecline(true);
    } else {
      setIndex();
      setCheckDecline(false);
    }
  };
  const checkReserveMessage = (e) => {
    if (e.target.id) {
      setIndex(e.target.id);
      setIsChecked(true);
    } else {
      setIndex();
      setIsChecked(false);
    }
  };
  const removeReserveHandler = (e) => {
    const docID = reserve[+e.target.id].reserveID;
    Swal.fire({
      text: "確定取消預約嗎?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "取消",
      confirmButtonText: "確定",
      confirmButtonColor: "#1e4d4e",
    }).then((res) => {
      if (res.isConfirmed) {
        firebase
          .firestore()
          .collection("reserve")
          .doc(docID)
          .delete()
          .then(() => {
            Swal.fire({
              text: "取消成功",
              icon: "success",
              confirmButtonText: "確定",
              confirmButtonColor: "#1e4d4e",
            }).then(() => {
              setReserve([
                ...reserve.filter((r, index) => index !== +e.target.id),
              ]);
            });
          })
          .catch((error) => {
            console.log("Error:", error);
          });
      }
    });
  };
  return (
    <div className={style["reserve-list"]}>
      <div className={style.waiting}>
        <h4>預約中</h4>
        {reserve.find((r) => r.status === "0") ? (
          <>
            <div className={style.reservations}>
              {reserve
                .filter((r) => r.status === "0")
                .map((r, idx) => (
                  <div key={idx} className={style.reservation}>
                    <div className={style.content}>
                      <div className={style.dietitian}>
                        營養師：{r.dietitianName}
                      </div>
                      <div className={style.startDate}>
                        預約開始時間：{r.reserveStartDate}
                      </div>
                    </div>
                    <div className={style.buttons}>
                      <button
                        onClick={checkReserveMessage}
                        id={idx}
                        className={style.check}
                      >
                        查看詳情
                      </button>
                      <button
                        onClick={removeReserveHandler}
                        id={idx}
                        className={style.cancel}
                      >
                        取消預約
                      </button>
                    </div>

                    {+index === idx && isChecked ? (
                      <>
                        <DietitianData
                          props={dietitians[idx]}
                          reserve={reserve}
                          setIsChecked={setIsChecked}
                          setReserve={setReserve}
                        />
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
            </div>
          </>
        ) : (
          <div className={image.nothing}>
            <img src={nothing} alt="nothing" />
          </div>
        )}
      </div>
      <div className={style.checked}>
        <h4>已回覆預約</h4>
        <div className={style.reservations}>
          {reserve.find((i) => i.status !== "0") ? (
            reserve.map((i, idx) =>
              i.status !== "0" ? (
                <div className={style.reservation} key={idx}>
                  <div className={style.content}>
                    <div className={style.dietitian}>
                      營養師：{i.dietitianName}
                    </div>
                    <div className={style.startDate}>
                      預約開始時間：{i.reserveStartDate}
                    </div>
                  </div>
                  <div className={style["reservation-state"]}>
                    {i.status === "1" ? (
                      <span className={style.success}>成功</span>
                    ) : i.status === "2" ? (
                      <>
                        <button
                          onClick={checkDeclineMessage}
                          className={style.check}
                          id={idx}
                        >
                          查看訊息
                        </button>
                        <span className={style.decline}>婉拒</span>
                        {+index === idx && checkDecline ? (
                          <div
                            className={`${style.message} animated animated animate__fadeIn`}
                          >
                            <div className={style.content}>
                              <div>婉拒訊息</div>
                              <div>{i.declineMessage}</div>
                            </div>
                            <button onClick={checkDeclineMessage}>確定</button>
                          </div>
                        ) : (
                          ""
                        )}
                      </>
                    ) : i.status === "3" ? (
                      <span className={style.decline}>逾期</span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ) : (
                ""
              )
            )
          ) : (
            <div className={image.nothing}>
              <img src={nothing} alt="nothing" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReserveList;
