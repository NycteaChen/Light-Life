import React, { useEffect, useState } from "react";
import ReserveForm from "../Reverse/ReserveForm.js";
import style from "../../../style/findDietitian.module.scss";

function DietitianData({ props, setIsCheck, setReserve, profile }) {
  const [isReserve, setIsReserve] = useState(false); //false
  const bindReserveHandler = () => {
    setIsReserve(true);
  };
  const bindCloseHandler = () => {
    setIsCheck(false);
  };
  return (
    <div className={style["dietitian-details"]}>
      <div>
        <i
          className={`${style.close} fa fa-times`}
          aria-hidden="true"
          onClick={bindCloseHandler}
        ></i>
      </div>
      <div>
        <div className={style.name}>{props.name}營養師</div>
        <div className={style.img}>
          <img
            src={props.image}
            alt="dietitian"
            style={{ width: "150px", height: "150px", borderRadius: "50%" }}
          />
        </div>
      </div>
      <div className={style.content}>
        <div className={style.gender}>
          性別：<span>{props.gender}</span>
        </div>
        <div className={style.education}>
          <div>最高學歷：{props.education.school}</div>
          <div>
            <span>{props.education.department} </span>
            <span>{props.education.degree}</span>
          </div>
        </div>
        <div className={style.skills}>
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
        <div className={style.other}>
          <div>其他</div>
          <div>{props.other}</div>
        </div>
      </div>
      {/* {isReserve ? ( */}
      <ReserveForm props={props} setReserve={setReserve} profile={profile} />
      {/* // ) : (
      //   ""
      // )} */}
    </div>
  );
}

export default DietitianData;
