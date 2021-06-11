import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import ShowInviterData from "./ShowInviterData.js";
import style from "../../../style/whoInvite.module.scss";
import image from "../../../style/image.module.scss";
import nothing from "../../../images/nothing.svg";
import styled from "styled-components";

function InvitedList({ invitedList, setInvitedList, setPending }) {
  const [isChecked, setIsChecked] = useState(false);
  const [buttonIndex, setButtonIndex] = useState();

  const checkInviter = (e) => {
    if (e.target.id) {
      setButtonIndex(e.target.id);
      setIsChecked(true);
      console.log("test");
    } else {
      setIsChecked(false);
      console.log("test");
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
          <NothingImage className={image.nothing}>
            <img src={nothing} />
          </NothingImage>
        )}
      </div>
      {isChecked && invitedList.length > 0 ? (
        <div
          className={`${style["invite-data"]} animated animate__fadeIn`}
          style={{ display: "block" }}
        >
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

const NothingImage = styled.div`
  line-height: 350px;
  @media (min-width: 1024px) {
    line-height: calc(100vh - 300px);
  }
`;

export default InvitedList;
