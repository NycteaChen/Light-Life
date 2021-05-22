import React, { useEffect, useState } from "react";
import ReserveForm from "../Reverse/ReserveForm.js";

function DietitianData({ props, setIsCheck, setReserve, profile }) {
  const [isReserve, setIsReserve] = useState(false); //false
  const bindReserveHandler = () => {
    setIsReserve(true);
  };
  const bindCloseHandler = () => {
    setIsCheck(false);
  };
  return (
    <>
      <div>
        <div onClick={bindCloseHandler}>X</div>
        <div>
          <span>{props.name}</span> 營養師
        </div>
        <img
          src={props.image}
          alt="dietitian"
          style={{ width: "200px", height: "200px", borderRadius: "50%" }}
        />
        <div>
          性別：<span>{props.gender}</span>
        </div>
        <div>
          最高學歷：
          <span>
            {props.education.school}
            {props.education.department} {props.education.degree}
          </span>
        </div>
        <div>
          專長：
          <span>
            {props.skills.map((s, index) => (
              <span key={index}>
                {s}
                {props.skills[index + 1] ? "、" : ""}
              </span>
            ))}
          </span>
        </div>
        <div>
          <div>其他</div>
          <div>{props.other}</div>
        </div>
        <button onClick={bindReserveHandler}>發送預約邀請</button>
        {isReserve ? (
          <ReserveForm
            setIsReserve={setIsReserve}
            props={props}
            setReserve={setReserve}
            profile={profile}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default DietitianData;