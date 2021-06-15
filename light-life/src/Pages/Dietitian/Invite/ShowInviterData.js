import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import Swal from "sweetalert2";
import noImage from "../../../images/noimage.png";
import style from "../../../style/whoInvite.module.scss";

function ShowInviterData({
  idx,
  invitedList,
  setInvitedList,
  setIsChecked,
  setPending,
}) {
  const props = invitedList[+idx];
  const [inviterData, setInviterData] = useState({});
  const [show, setShow] = useState("");
  const [message, setMessage] = useState("");
  const { dID } = useParams();
  const today = new Date(+new Date() + 8 * 3600 * 1000).getTime();

  useEffect(() => {
    firebase
      .firestore()
      .collection("customers")
      .doc(props.inviterID)
      .get()
      .then((res) => {
        setInviterData(res.data());
      });
  }, []);
  const inviteButtonHandler = (e) => {
    const { id } = e.target;
    console.log(id);
    switch (id) {
      case "accept":
        Swal.fire({
          text: "確定接受客戶預約邀請嗎?",
          showCancelButton: true,
          cancelButtonText: "取消",
          confirmButtonText: "確定",
          confirmButtonColor: "#1e4d4e",
        }).then((result) => {
          if (result.isConfirmed) {
            firebase
              .firestore()
              // .collection("dietitians")
              // .doc(dID)
              // .collection("customers")
              // .doc(props.inviterID)
              // .set({
              //   startDate: props.reserveStartDate,
              //   endDate: props.reserveEndDate,
              //   isServing: false,
              // })
              .collection("pending")
              .add({
                startDate: props.reserveStartDate,
                endDate: props.reserveEndDate,
                dietitian: dID,
                customer: props.inviterID,
              })
              .then(() => {
                setPending({
                  startDate: props.reserveStartDate,
                  endDate: props.reserveEndDate,
                  dietitian: dID,
                  customer: props.inviterID,
                });
                firebase
                  .firestore()
                  .collection("reserve")
                  .doc(props.reserveID)
                  .update({
                    ...props,
                    status: "1",
                  });
              })
              .then(() => {
                Swal.fire({
                  text: "接受預約",
                  icon: "success",
                  confirmButtonText: "確定",
                  confirmButtonColor: "#1e4d4e",
                });
                setInvitedList([
                  ...invitedList.filter((i, index) => index !== +idx),
                ]);
                setIsChecked(false);
              });
          }
        });
        break;
      case "decline":
        setShow(style.show);
        break;
      case "cancel":
        setShow("");
        break;
    }
  };

  const declineMessageHandler = (e) => {
    setMessage(e.target.value);
  };
  const sendDeclineMessageButton = () => {
    if (message && message !== "") {
      firebase
        .firestore()
        .collection("reserve")
        .doc(props.reserveID)
        .update({
          ...props,
          declineMessage: message,
          status: "2",
        })
        .then(() => {
          setInvitedList([...invitedList.filter((i, index) => index !== +idx)]);
          setIsChecked(false);
        });
    } else {
      Swal.fire({
        text: "請輸入婉拒訊息",
        icon: "warning",
        confirmButtonText: "確定",
        confirmButtonColor: "#1e4d4e",
      });
    }
  };

  return (
    <>
      <div className={`${style.declineMessage} ${show}`}>
        <label>
          <div>婉拒訊息</div>
          <textarea onChange={declineMessageHandler} value={message} />
        </label>
        <div>
          <button onClick={sendDeclineMessageButton}>確認</button>
          <button onClick={inviteButtonHandler} id="cancel">
            取消
          </button>
        </div>
      </div>

      <div>
        <div className={style["reserve-time"]}>
          <div>預約服務時間</div>
          <div>
            {props.reserveStartDate}~{props.reserveEndDate}
          </div>
        </div>
        <div className={style["flexbox"]}>
          <img
            src={inviterData.image ? inviterData.image : noImage}
            alt="customer"
          />
          <div className={style.basicData}>
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

        <div className={style.flexcol}>
          <div>
            <div className={style["data-item"]}>
              <div className={style.title}>運動習慣</div>
              <div id="sport">{inviterData.sport}</div>
            </div>
          </div>
          <div>
            <div className={style["data-item"]}>
              <div className={style.title}>其他</div>
              <div id="other">{inviterData.other}</div>
            </div>
          </div>
        </div>

        <div className={style.col}>
          <div className={style.title}>預約訊息</div>
          <div>{props.reserveMessage}</div>
        </div>
      </div>
      <div className={style.buttons}>
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
    </>
  );
}

export default ShowInviterData;
