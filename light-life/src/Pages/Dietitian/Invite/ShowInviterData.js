import React, { useEffect, useState } from "react";
import firebase from "firebase/app";

function ShowInviterData({ props, idx, invitedList, setInvitedList }) {
  const [inviterData, setInviterData] = useState({});
  useEffect(() => {
    firebase
      .firestore()
      .collection("customers")
      .doc(props.inviterID)
      .get()
      .then((res) => {
        console.log(res.data());
        setInviterData(res.data());
      });
  }, []);
  console.log(props);
  console.log(invitedList);
  const inviteButtonHandler = (e) => {
    if (e.target.id === "accept") {
      console.log(e.target.id);
    }
    if (e.target.id === "decline") {
      console.log(e.target.id);
      // firebase.firestore().collection("reserve")
    }
  };

  return (
    <div>
      <div>
        <h2>
          預約服務時間：
          <span>
            {props.reverseStartDate}~{props.reverseEndDate}
          </span>
        </h2>
        <h2>客戶資料</h2>
        <img
          src={inviterData.image}
          alt="customer"
          style={{ width: "200px", height: "200px", borderRadius: "50%" }}
        />
        <div>
          <div>姓名</div>
          <div>{inviterData.name}</div>
        </div>
        <div>
          <div>性別</div>
          <div>{inviterData.gender}</div>
        </div>
        <div>
          <div>年齡</div>
          <div>
            <span>{inviterData.age}</span> 歲
          </div>
        </div>
        <div>
          <div>身高</div>
          <div>
            <span>{inviterData.height}</span> cm
          </div>
        </div>
        <div>
          <div>體重</div>
          <div>
            <span>{inviterData.weight}</span> kg
          </div>
        </div>
        <div>
          <div>教育程度</div>
          <div>
            <span>{inviterData.education}</span>
          </div>
        </div>
        <div>
          <div>職業</div>
          <div>
            <span>{inviterData.career}</span>
          </div>
        </div>
        <div>
          <div>其他</div>
          <div>
            <span>{inviterData.other}</span>
          </div>
        </div>
        <div>
          <div>預約訊息</div>
          <div>{props.reverseMessage}</div>
        </div>
      </div>
      <div>
        <button onClick={inviteButtonHandler} id="accept">
          接受
        </button>
        <button onClick={inviteButtonHandler} id="decline">
          婉拒
        </button>
      </div>
    </div>
  );
}

export default ShowInviterData;
