import React, { useEffect, useState } from "react";
import ReserveForm from "../Reverse/ReserveForm.js";
import style from "../../../style/findDietitian.module.scss";

function DietitianData({ props, setIsChecked, setReserve, profile, reserve }) {
  const bindCloseHandler = () => {
    setIsChecked(false);
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
          <img src={props.image} alt="dietitian" />
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
        <>
          {props.skills.weightControl ||
          props.skills.sportNT ||
          props.skills.threeHigh ||
          props.skills.bloodSugar ? (
            <div className={style.skills}>
              專長：
              <span>
                {props.skills.weightControl ? "體重管理　" : ""}
                {props.skills.sportNT ? "運動營養　" : ""}
                {props.skills.threeHigh ? "三高控制　" : ""}
                {props.skills.bloodSugar ? "血糖控制" : ""}
              </span>
            </div>
          ) : (
            ""
          )}
        </>
        {props.other ? (
          <div className={style.other}>
            <div>其他</div>
            <div>{props.other}</div>
          </div>
        ) : (
          ""
        )}
      </div>
      <ReserveForm
        props={props}
        setReserve={setReserve}
        // profile={profile}
        setIsChecked={setIsChecked}
        reserve={reserve}
      />
    </div>
  );
}

export default DietitianData;
