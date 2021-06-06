import React, { useEffect, useState } from "react";
import ReserveForm from "../Reverse/ReserveForm.js";
import style from "../../../style/findDietitian.module.scss";

function DietitianData({ props, setIsChecked, setReserve, reserve }) {
  const bindCloseHandler = () => {
    setIsChecked(false);
  };
  return (
    <div className={`${style["dietitian-details"]} animated animate__fadeIn`}>
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
        <div className={style.flexbox}>
          <div className={style.gender}>
            <span className={style.title}>性別</span>　
            <span>{props.gender}</span>
          </div>
          <div className={style.education}>
            <div>
              <span className={style.title}>學歷</span>　
              {props.education.school}
            </div>
            <div>
              <span>{props.education.department}　</span>
              <span>{props.education.degree}</span>
            </div>
          </div>
        </div>
        <>
          {props.skills.weightControl ||
          props.skills.sportNT ||
          props.skills.threeHigh ||
          props.skills.bloodSugar ? (
            <div className={style.skills}>
              <div className={style.title}>專長　</div>
              <div>
                {props.skills.weightControl ? <span>體重管理　</span> : ""}
                {props.skills.sportNT ? <span>運動營養　</span> : ""}
                {props.skills.threeHigh ? <span>三高控制　</span> : ""}
                {props.skills.bloodSugar ? <span>血糖控制　</span> : ""}
              </div>
            </div>
          ) : (
            ""
          )}
        </>
        {props.other ? (
          <div className={style.other}>
            <div className={style.title}>其他</div>
            <div>{props.other}</div>
          </div>
        ) : (
          ""
        )}
      </div>
      <ReserveForm
        props={props}
        setReserve={setReserve}
        setIsChecked={setIsChecked}
        reserve={reserve}
      />
    </div>
  );
}

export default DietitianData;
