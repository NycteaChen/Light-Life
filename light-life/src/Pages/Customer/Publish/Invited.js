import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import noImage from "../../../images/noimage.png";
import style from "../../../style/publish.module.scss";

function Invited() {
  return (
    <div className={style["dietitian-details"]} style={{ display: "none" }}>
      <div>
        <i className={`${style.close} fa fa-times`} aria-hidden="true"></i>
      </div>
      <div>
        <div className={style.name}>林曉華營養師</div>
        <div className={style.img}>
          <img src={noImage} alt="dietitian" />
        </div>
      </div>
      <div className={style.content}>
        <div className={style.gender}>
          性別：<span>女</span>
        </div>
        <div className={style.education}>
          <div>最高學歷：中山醫學大學</div>
          <div>
            <span>營養學系 </span>
            <span>學士</span>
          </div>
        </div>
        <div className={style.skills}>
          專長：
          <span>
            {/* {props.skills.map((s, index) => (
              <span key={index}>
                {s}
                {props.skills[index + 1] ? "、" : ""}
              </span>
            ))} */}
            <span>體重管理、</span>
            <span>運動管理</span>
          </span>
        </div>
        <div className={style.other}>
          <div>其他</div>
          <div>超強der</div>
        </div>
        <div className={style.message}>
          <div>邀請訊息</div>
          <textarea>希望能為您服務</textarea>
        </div>
      </div>

      <div className={style.buttons}>
        <button className={style.accept}>接受</button>
        <button className={style.decline}>婉拒</button>
      </div>
    </div>
  );
}

export default Invited;
