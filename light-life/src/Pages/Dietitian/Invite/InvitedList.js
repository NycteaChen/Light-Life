import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import ShowInviterData from "./ShowInviterData.js";
import style from "../../../style/whoInvite.module.scss";

function InvitedList({ invitedList, setInvitedList, setPending }) {
  const [isChecked, setIsChecked] = useState(false);
  const [buttonIndex, setButtonIndex] = useState();
  const { dID } = useParams();

  const checkInviter = (e) => {
    if (e.target.id) {
      setButtonIndex(e.target.id);
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  };

  return (
    <div className={style.whoInvite}>
      {invitedList.length > 0 ? (
        <div className={style["invite-number"]}>
          有 <span>{invitedList.length}</span> 位客人預約您的服務
        </div>
      ) : (
        <div className={style["invite-number"]}>目前沒有預約喔</div>
      )}
      <div className={style.inviters}>
        {invitedList.map((i, index) => (
          <div key={index} className={style.inviter}>
            <div className={style["invite-message"]}>
              <div className={style["inviter-name"]}>
                <span>
                  {i.inviterName} {i.inviterGender === "男" ? "先生" : "小姐"}
                </span>
                指定您的服務
              </div>
              <button onClick={checkInviter} id={index}>
                查看詳情
              </button>
            </div>
          </div>
        ))}
      </div>
      {isChecked && invitedList.length > 0 ? (
        <div className={style["invite-data"]} style={{ display: "block" }}>
          <i
            className="fa fa-times"
            aria-hidden="true"
            onClick={checkInviter}
          ></i>
          <ShowInviterData
            idx={buttonIndex}
            invitedList={invitedList}
            setInvitedList={setInvitedList}
            setIsChecked={setIsChecked}
            setPending={setPending}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default InvitedList;
