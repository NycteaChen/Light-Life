import React from "react";
import "firebase/firestore";
import "firebase/storage";
import noImage from "../../../images/noimage.png";
import style from "../../../style/customerProfile.module.scss";

function CustomerProfile({ props, input }) {
  return (
    <div id="personal-profile" className={style["customer-profile"]}>
      <div className={style["profile-data"]}>
        <div className={style.flexbox}>
          <img
            id="profile-img"
            src={
              input.image ? input.image : props.image ? props.image : noImage
            }
            alt="customer"
          />
          <div>
            <div className={style["data-item"]}>
              <div className={style.title}>姓名</div>
              <div id="name">
                {input.name ? input.name : props ? props.name : ""}
              </div>
            </div>
            <div className={style["data-item"]}>
              <div className={style.title}>性別</div>
              <div id="gender">
                {input.gender ? input.gender : props ? props.gender : ""}
              </div>
            </div>
            <div className={style["data-item"]}>
              <div className={style.title}>年齡</div>
              <div id="age">
                <span>{input.age ? input.age : props ? props.age : ""}</span> 歲
              </div>
            </div>
          </div>
        </div>
        <div className={style.flexbox}>
          <div className={style["data-item"]}>
            <div className={style.title}>身高</div>
            <div id="height">
              <span>
                {input.height ? input.height : props ? props.height : ""}
              </span>{" "}
              cm
            </div>
          </div>
          <div className={style["data-item"]}>
            <div className={style.title}>體重</div>
            <div id="weight">
              <span>
                {input.weight ? input.weight : props ? props.weight : ""}
              </span>{" "}
              kg
            </div>
          </div>
        </div>
        <div className={style.flexbox}>
          <div className={style["data-item"]}>
            <div className={style.title}>教育程度</div>
            <div id="education">
              <span>
                {input.education
                  ? input.education
                  : props
                  ? props.education
                  : ""}
              </span>
            </div>
          </div>
          <div className={style["data-item"]}>
            <div className={style.title}>職業</div>
            <div id="career">
              <span>
                {input.career ? input.career : props ? props.career : ""}
              </span>
            </div>
          </div>
        </div>
        <div className={style.flexcol}>
          <div className={style.col}>
            <div className={style["data-item"]}>
              <div className={style.title}>運動習慣</div>
              <div id="sport">
                <span>
                  {input.sport ? input.sport : props ? props.sport : ""}
                </span>
              </div>
            </div>
          </div>
          <div className={style.col}>
            <div className={style["data-item"]}>
              <div className={style.title}>其他</div>
              <div id="other">
                <span>
                  {input.other ? input.other : props ? props.other : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;
