import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import style from "../../../style/reverseList.module.scss";

function ReserveList({ reserve, setReserve }) {
  // const [isChecked, setIsChecked] = useState(false);
  const [index, setIndex] = useState();
  const checkReserveMessage = (e) => {
    setIndex(e.target.id);
    // setIsChecked(true);
  };

  const closeReserveMessage = () => {
    // setIsChecked(false);
    setIndex();
  };

  const removeReserveHandler = (e) => {
    const docID = reserve[+e.target.id].id;
    setReserve([...reserve.filter((r, index) => index !== +e.target.id)]);
    firebase
      .firestore()
      .collection("reserve")
      .doc(docID)
      .delete()
      .then(() => {
        console.log("delete");
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };
  console.log(reserve);
  return (
    <div className={style["reverse-list"]}>
      <div className={style.waiting}>
        <h3>預約中</h3>
        {reserve.id || reserve.length > 0 ? (
          <>
            <h4>請靜待營養師回覆</h4>
            <div className={style.reservations}>
              {reserve.map((r, idx) => (
                <div key={idx} className={style.reservation}>
                  <div className={style.content}>
                    <div className={style.dietitian}>
                      營養師：{r.dietitianName}
                    </div>
                    <div className={style.startDate}>
                      預約開始時間：{r.reverseStartDate}
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
                      <div className={style.addDate}>建立時間：{r.addDate}</div>
                      <div className={style.content}>
                        <h3>邀請訊息</h3>
                        <div>{r.reverseMessage}</div>
                      </div>
                      <button onClick={closeReserveMessage}>確定</button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <h4>目前沒有預約喔</h4>
        )}
      </div>
      <div className={style.checked}>
        <h3>已回覆預約</h3>
        {reserve.id || reserve.length > 0 ? (
          <div className={style.reservations}>
            <div className={style.reservation}>
              <div className={style.content}>
                <div className={style.dietitian}>營養師：Admin</div>
                <div className={style.startDate}>預約開始時間：2021-05-27</div>
              </div>
              <div className={style["reservation-state"]}>
                <span className={style.success}>預約成功</span>
              </div>
            </div>

            <div className={style.reservation}>
              <div className={style.content}>
                <div className={style.dietitian}>營養師：王曉明</div>
                <div className={style.startDate}>預約開始時間：2021-05-27</div>
              </div>
              <div className={style["reservation-state"]}>
                <button>查看訊息</button>
                <span className={style.decline}>婉拒</span>
              </div>
            </div>
            <div className={style.reservation}>
              <div className={style.content}>
                <div className={style.dietitian}>營養師：王曉明</div>
                <div className={style.startDate}>預約開始時間：2021-05-27</div>
              </div>
              <div className={style["reservation-state"]}>
                <button>查看訊息</button>
                <span className={style.decline}>婉拒</span>
              </div>
            </div>
            <div className={style.reservation}>
              <div className={style.content}>
                <div className={style.dietitian}>營養師：王曉明</div>
                <div className={style.startDate}>預約開始時間：2021-05-27</div>
              </div>
              <div className={style["reservation-state"]}>
                <button>查看訊息</button>
                <span className={style.decline}>婉拒</span>
              </div>
            </div>
            <div className={style.reservation}>
              <div className={style.content}>
                <div className={style.dietitian}>營養師：王曉明</div>
                <div className={style.startDate}>預約開始時間：2021-05-27</div>
              </div>
              <div className={style["reservation-state"]}>
                <button>查看訊息</button>
                <span className={style.decline}>婉拒</span>
              </div>
            </div>
            <div className={style.reservation}>
              <div className={style.content}>
                <div className={style.dietitian}>營養師：王曉明</div>
                <div className={style.startDate}>預約開始時間：2021-05-27</div>
              </div>
              <div className={style["reservation-state"]}>
                <button>查看訊息</button>
                <span className={style.decline}>婉拒</span>
              </div>
            </div>
          </div>
        ) : (
          <h4>尚未有回覆</h4>
        )}
      </div>
    </div>
  );
}

export default ReserveList;
