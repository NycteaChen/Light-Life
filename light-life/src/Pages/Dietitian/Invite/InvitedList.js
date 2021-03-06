import React, { useState } from "react";
import ShowInviterData from "./ShowInviterData.js";
import style from "../../../style/whoInvite.module.scss";
import image from "../../../style/image.module.scss";
import nothing from "../../../images/nothing.svg";

function InvitedList({ invitedList, setInvitedList, pending, setPending }) {
  const [isChecked, setIsChecked] = useState(false);
  const [buttonIndex, setButtonIndex] = useState();

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
      <div className={style["invite-number"]}>
        有 <span>{invitedList.length}</span> 位客人預約您的服務
      </div>
      <div className={style.inviters}>
        {invitedList.length > 0 ? (
          invitedList.map((i, index) => (
            <div key={index} className={style.inviter}>
              <div className={style["invite-message"]}>
                <div className={style["inviter-name"]}>
                  <span>
                    {i.inviterName} {i.inviterGender === "男" ? "先生" : "小姐"}
                  </span>
                  指定您的服務
                </div>
                <div className={style.button}>
                  <button onClick={checkInviter} id={index}>
                    查看詳情
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={`${image.nothing} ${image["invitedList-nothing"]}`}>
            <img src={nothing} alt="nothing" />
          </div>
        )}
      </div>
      {isChecked && invitedList.length > 0 ? (
        <div
          className={`${style["invite-data"]} animated animate__fadeIn`}
          style={{ display: "block" }}
        >
          <div>
            <i
              className="fa fa-times"
              aria-hidden="true"
              onClick={checkInviter}
            ></i>
          </div>
          <ShowInviterData
            idx={buttonIndex}
            invitedList={invitedList}
            setInvitedList={setInvitedList}
            setIsChecked={setIsChecked}
            pending={pending}
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
