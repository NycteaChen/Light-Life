import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";

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

  if (reserve.id || reserve.length > 0) {
    return (
      <>
        <h3>
          您有 <span>{reserve.length}</span> 筆預約
        </h3>
        {reserve.map((r, idx) => (
          <div key={idx}>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <img
                src={r.image}
                alt="dietitian"
                style={{ width: "200px", height: "200px", borderRadius: "50%" }}
              />
              <div>
                <div>
                  <span>{r.dietitianName}</span>營養師
                </div>
                <div>
                  <div>建立時間</div>
                  <div>{r.addDate}</div>
                </div>
                <div>
                  <div>預約時間</div>
                  <div>
                    <div>{r.reverseStartDate}</div>
                    <div>至</div>
                    <div>{r.reverseEndDate}</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <button onClick={checkReserveMessage} id={idx}>
                查看訊息
              </button>
              <button onClick={removeReserveHandler} id={idx}>
                取消預約
              </button>
              {parseInt(index) === idx ? (
                <>
                  <div>
                    <div>邀請訊息</div>
                    <div>{r.reverseMessage}</div>
                  </div>
                  <button onClick={closeReserveMessage}>確定</button>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        ))}
      </>
    );
  } else {
    return <div>目前沒有預約喔</div>;
  }
}

export default ReserveList;
