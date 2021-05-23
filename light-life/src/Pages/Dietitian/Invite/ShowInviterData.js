import React, { useEffect, useState } from "react";
import noImage from "../../../images/noimage.png";
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
        <div className="reserve-time">
          預約服務時間：
          <span>
            {props.reverseStartDate}~{props.reverseEndDate}
          </span>
        </div>
        <h4 className="data-title">客戶資料</h4>
        <div className="flexbox">
          <img
            src={inviterData.image ? inviterData.image : noImage}
            alt="customer"
          />
          <div>
            <div className="data-item">
              <div className="title">姓名</div>
              <div>{inviterData.name}</div>
            </div>
            <div className="data-item">
              <div className="title">性別</div>
              <div>{inviterData.gender}</div>
            </div>
            <div className="data-item">
              <div className="title">年齡</div>
              <div>
                <span>{inviterData.age}</span> 歲
              </div>
            </div>
          </div>
        </div>
        <div className="flexbox">
          <div className="data-item">
            <div className="title">身高</div>
            <div>
              <span>{inviterData.height}</span> cm
            </div>
          </div>
          <div className="data-item">
            <div className="title">體重</div>
            <div>
              <span>{inviterData.weight}</span> kg
            </div>
          </div>
        </div>
        <div className="flexbox">
          <div className="data-item">
            <div className="title">教育程度</div>
            <div>
              <span>{inviterData.education}</span>
            </div>
          </div>
          <div className="data-item">
            <div className="title">職業</div>
            <div>
              <span>{inviterData.career}</span>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="title">其他</div>
          <div>
            <span>{inviterData.other}</span>
          </div>
        </div>
        <div className="col">
          <div className="title">預約訊息</div>
          <div>{props.reverseMessage}</div>
        </div>
      </div>
      <div className="choose">
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
