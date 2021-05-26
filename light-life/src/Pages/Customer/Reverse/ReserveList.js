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
    const docID = reserve[parseInt(e.target.id)].id;
    setReserve([
      ...reserve.filter((r, index) => index !== parseInt(e.target.id)),
    ]);
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
        <h3>尚未回覆預約</h3>
        {reserve.id || reserve.length > 0 ? (
          <>
            <h4>
              您有 <span>{reserve.length}</span> 筆預約
            </h4>
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
                  {/* <div>
              <img src={r.image} alt="dietitian" />
              <div>
                <div>
                  <span>{r.dietitianName}</span>營養師
                </div>
                <div>
                  <div>建立時間</div>
                  <div>{r.addDate}</div>
                </div>
                <div>
                  <div>
                    <div>開始</div>
                    <div>{r.reverseStartDate}</div>
                  </div>
                  <div>
                    <div>結束</div>
                    <div>{r.reverseEndDate}</div>
                  </div>
                </div>
              </div>
            </div> */}
                  {/* <div>  */}
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
                  {/* {parseInt(index) === idx ? (
                <>
                  <div>
                    <div>邀請訊息</div>
                    <div>{r.reverseMessage}</div>
                  </div>
                  <button onClick={closeReserveMessage}>確定</button>
                </>
              ) : (
                ""
              )}</div> */}
                </div>
              ))}
            </div>
          </>
        ) : (
          <h4>目前沒有預約喔</h4>
        )}
      </div>
      <div className={style["checked"]}>
        <h3>已回覆預約</h3>
        {reserve.id || reserve.length > 0 ? (
          <div className={style.reservations}>
            <div className={style.reservation}>
              <div className={style.content}>
                <div className={style.dietitian}>
                  營養師：{reserve[0].dietitianName}
                </div>
                <div className={style.startDate}>
                  預約開始時間：{reserve[0].reverseStartDate}
                </div>
              </div>
              <div className={style["reservation-state"]}>
                <button
                  onClick={checkReserveMessage}
                  id="0"
                  className={style.check}
                >
                  查看詳情
                </button>
                <span className={style.success}>預約成功</span>
              </div>
            </div>

            <div className={style.reservation}>
              <div className={style.content}>
                <div className={style.dietitian}>
                  營養師：{reserve[1].dietitianName}
                </div>
                <div className={style.startDate}>
                  預約開始時間：{reserve[1].reverseStartDate}
                </div>
              </div>
              <div className={style["reservation-state"]}>
                <button onClick={checkReserveMessage} id="1">
                  查看詳情
                </button>
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
