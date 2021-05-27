import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useLocation,
} from "react-router-dom";
import "firebase/firestore";
import noImage from "../../../images/noimage.png";
import firebase from "firebase/app";
import style from "../../../style/findCustomers.module.scss";

function PublicationData() {
  return (
    <div className={style.publicationForm}>
      <div>
        <i className={`${style.close} fa fa-times`} aria-hidden="true"></i>
      </div>

      <div className={style.flexbox}>
        <img id="profile-img" src={noImage} alt="customer" />
        <div>
          <div className={style["data-item"]}>
            <div className={style.title}>姓名</div>
            <div id="name">陳曉林</div>
          </div>
          <div className={style["data-item"]}>
            <div className={style.title}>性別</div>
            <div id="gender">女</div>
          </div>
          <div className={style["data-item"]}>
            <div className={style.title}>年齡</div>
            <div id="age">25 歲</div>
          </div>
        </div>
      </div>

      <div className={style.flexbox}>
        <div className={style["data-item"]}>
          <div className={style.title}>身高</div>
          <div id="height">
            <span>155</span>
            cm
          </div>
        </div>
        <div className={style["data-item"]}>
          <div className={style.title}>體重</div>
          <div id="weight">
            <span>55</span>
            kg
          </div>
        </div>
      </div>
      <div className={style.flexbox}>
        <div className={style["data-item"]}>
          <div className={style.title}>教育程度</div>
          <div id="education">
            <span>研究所</span>
          </div>
        </div>
        <div className={style["data-item"]}>
          <div className={style.title}>職業</div>
          <div id="career">
            <span>服務業</span>
          </div>
        </div>
      </div>
      <div className={style.flexcol}>
        <div className={style.col}>
          <div className={style["data-item"]}>
            <div className={style.title}>運動習慣</div>
            <div id="sport">
              <span>不喜歡運動</span>
            </div>
          </div>
        </div>
        <div className={style.col}>
          <div className={style["data-item"]}>
            <div className={style.title}>其他</div>
            <div id="other">
              <span>不喜歡吃魚</span>
            </div>
          </div>
        </div>
      </div>

      <div className={style.message}>
        <h3>邀請訊息</h3>
        <textarea>想為您服務</textarea>
        <div className={style.buttons}>
          <button className={style.send}>發送</button>
          <button className={style.cancel}>取消</button>
        </div>
      </div>
    </div>
  );
}

export default PublicationData;
