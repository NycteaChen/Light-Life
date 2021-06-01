import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import style from "../../../style/reserveList.module.scss";

function ReserveList({ reserve, setReserve }) {
  const [index, setIndex] = useState();

  const checkDeclineMessage = (e) => {
    if (e.target.id) {
      setIndex(e.target.id);
    } else {
      setIndex();
    }
  };

  const checkReserveMessage = (e) => {
    if (e.target.id) {
      setIndex(e.target.id);
    } else {
      setIndex();
    }
  };
  const removeReserveHandler = (e) => {
    const docID = reserve[+e.target.id].reserveID;
    firebase
      .firestore()
      .collection("reserve")
      .doc(docID)
      .delete()
      .then(() => {
        alert("delete");
        setReserve([...reserve.filter((r, index) => index !== +e.target.id)]);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  return (
    <div className={style["reserve-list"]}>
      <div className={style.waiting}>
        <h3>預約中</h3>
        {reserve.find((r) => r.status === "0") ? (
          <>
            <h4>請靜待營養師回覆</h4>
            <div className={style.reservations}>
              {reserve.map((r, idx) =>
                r.status === "0" ? (
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
                        查看訊息
                      </button>
                      <button
                        onClick={removeReserveHandler}
                        id={idx}
                        className={style.cancel}
                      >
                        取消預約
                      </button>
                    </div>

                    {+index === idx ? (
                      <div className={style.message}>
                        <div className={style.addDate}>
                          建立時間：{r.addDate}
                        </div>
                        <div className={style.content}>
                          <h3>邀請訊息</h3>
                          <div>{r.reserveMessage}</div>
                        </div>
                        <button onClick={checkReserveMessage}>確定</button>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )
              )}
            </div>
          </>
        ) : (
          <h4>目前沒有預約喔</h4>
        )}
      </div>
      <div className={style.checked}>
        <h3>已回覆預約</h3>
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
                      <span className={style.success}>預約成功</span>
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
                        {+index === idx ? (
                          <div className={style.message}>
                            <div className={style.content}>
                              <h3>婉拒訊息</h3>
                              <div>{i.declineMessage}</div>
                            </div>
                            <button onClick={checkReserveMessage}>確定</button>
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
            <h4>尚未有回覆</h4>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReserveList;
