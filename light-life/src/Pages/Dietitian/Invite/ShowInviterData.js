import React, { useEffect, useState } from "react";
import noImage from "../../../images/noimage.png";
import firebase from "firebase/app";
import style from "../../../style/whoInvite.module.scss";

function ShowInviterData({ props, idx, invitedList, setInvitedList }) {
  const [inviterData, setInviterData] = useState({});

  const [show, setShow] = useState("");

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
  const inviteButtonHandler = (e) => {
    const { id } = e.target;
    switch (id) {
      case "accept":
        console.log(id);
        break;
      case "decline":
        setShow(style.show);
        break;
      case "cancel":
        setShow("");
        break;
    }
  };

  const bindSendPasswordEmailButton = () => {};
  const cancelHandler = () => {};
  const declineMessageHandler = () => {};
  return (
    <div>
      <div className={`${style.declineMessage} ${show}`}>
        <label>
          <div>婉拒訊息</div>
          <textarea onChange={declineMessageHandler} />
        </label>
        <div>
          <button onClick={bindSendPasswordEmailButton}>確認</button>
          <button onClick={inviteButtonHandler} id="cancel">
            取消
          </button>
        </div>
      </div>

      <div>
        <div className={style["reserve-time"]}>
          預約服務時間：
          <span>
            {props.reverseStartDate}~{props.reverseEndDate}
          </span>
        </div>
        <h4 className={style["data-title"]}>客戶資料</h4>
        <div className={style["flexbox"]}>
          <img
            src={inviterData.image ? inviterData.image : noImage}
            alt="customer"
          />
          <div>
            <div className={style["data-item"]}>
              <div className={style.title}>姓名</div>
              <div>{inviterData.name}</div>
            </div>
            <div className={style["data-item"]}>
              <div className={style.title}>性別</div>
              <div>{inviterData.gender}</div>
            </div>
            <div className={style["data-item"]}>
              <div className={style.title}>年齡</div>
              <div>
                <span>{inviterData.age}</span> 歲
              </div>
            </div>
          </div>
        </div>
        <div className={style["flexbox"]}>
          <div className={style["data-item"]}>
            <div className={style.title}>身高</div>
            <div>
              <span>{inviterData.height}</span> cm
            </div>
          </div>
          <div className={style["data-item"]}>
            <div className={style.title}>體重</div>
            <div>
              <span>{inviterData.weight}</span> kg
            </div>
          </div>
        </div>
        <div className={style["flexbox"]}>
          <div className={style["data-item"]}>
            <div className={style.title}>教育程度</div>
            <div>
              <span>{inviterData.education}</span>
            </div>
          </div>
          <div className={style["data-item"]}>
            <div className={style.title}>職業</div>
            <div>
              <span>{inviterData.career}</span>
            </div>
          </div>
        </div>

        <div className={style.col}>
          <div className={style.title}>其他</div>
          <div>
            <span>{inviterData.other}</span>
          </div>
        </div>
        <div className={style.col}>
          <div className={style.title}>預約訊息</div>
          <div>{props.reverseMessage}</div>
        </div>
      </div>
      <div className={style.choose}>
        <button
          onClick={inviteButtonHandler}
          id="accept"
          className={style.accept}
        >
          接受
        </button>
        <button
          onClick={inviteButtonHandler}
          id="decline"
          className={style.decline}
        >
          婉拒
        </button>
      </div>
    </div>
  );
}

export default ShowInviterData;
