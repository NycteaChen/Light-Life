import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCustomerData } from "../../../utils/Firebase";
import noImage from "../../../images/noimage.png";
import spinner from "../../../images/loading.gif";
import style from "../../../style/customerProfile.module.scss";
import image from "../../../style/image.module.scss";

function CustomerProfile({ props }) {
  return (
    <>
      {props.image ? (
        <>
          <div className={style.flexbox}>
            <img id="profile-img" src={props.image || noImage} alt="customer" />
            <div>
              <div className={style["data-item"]}>
                <div className={style.title}>姓名</div>
                <div id="name">{props.name || ""}</div>
              </div>
              <div className={style["data-item"]}>
                <div className={style.title}>性別</div>
                <div id="gender">{props.gender || ""}</div>
              </div>
              <div className={style["data-item"]}>
                <div className={style.title}>年齡</div>
                <div id="age">
                  <span>{props.age || ""}</span> 歲
                </div>
              </div>
            </div>
          </div>
          <div className={style.flexbox}>
            <div className={style["data-item"]}>
              <div className={style.title}>身高</div>
              <div id="height">
                <span>{props.height || ""}</span> cm
              </div>
            </div>
            <div className={style["data-item"]}>
              <div className={style.title}>體重</div>
              <div id="weight">
                <span>{props.weight || ""}</span> kg
              </div>
            </div>
          </div>
          <div className={style.flexbox}>
            <div className={style["data-item"]}>
              <div className={style.title}>教育程度</div>
              <div id="education">
                <span>{props.education || ""}</span>
              </div>
            </div>
            <div className={style["data-item"]}>
              <div className={style.title}>職業</div>
              <div id="career">
                <span>{props.career || ""}</span>
              </div>
            </div>
          </div>
          <div className={style.flexcol}>
            <div className={style.col}>
              <div className={style["data-item"]}>
                <div className={style.title}>運動習慣</div>
                <div id="sport">
                  <span>{props.sport || ""}</span>
                </div>
              </div>
            </div>
            <div className={style.col}>
              <div className={style["data-item"]}>
                <div className={style.title}>其他</div>
                <div id="other">
                  <span>{props.other || ""}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={image.spinner}>
          <img src={spinner} alt="spinner" />
        </div>
      )}
    </>
  );
}
export default CustomerProfile;
