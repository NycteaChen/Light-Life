import React, { useEffect, useState } from "react";
import ShowInviterData from "./ShowInviterData.js";

function InvitedList({ invitedList, setInvitedList }) {
  const [isChecked, setIsChecked] = useState(false);
  const [buttonIndex, setButtonIndex] = useState();
  const checkInviter = (e) => {
    setButtonIndex(e.target.id);
    setIsChecked(true);
  };

  console.log(invitedList);
  return (
    <div>
      <h3>
        有 <span>{invitedList.length}</span> 位客人預約您的服務
      </h3>
      {invitedList.map((i, index) => (
        <div key={index}>
          <div>
            <span>
              {i.inviterName} {i.inviterGender === "男" ? "先生" : "小姐"}
            </span>
            指定您的服務
          </div>
          <button onClick={checkInviter} id={index}>
            查看詳情
          </button>
          {isChecked && buttonIndex == index ? (
            <div>
              <ShowInviterData
                props={i}
                idx={buttonIndex}
                invitedList={invitedList}
                setInvitedList={setInvitedList}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      ))}
    </div>
  );
}

export default InvitedList;
