import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import noImage from "../../../images/noimage.png";
import spinner from "../../../images/loading.gif";
import style from "../../../style/customerProfile.module.scss";
import image from "../../../style/image.module.scss";

function CustomerProfile({ props, input }) {
  const [profile, setProfile] = useState({});
  const { cID } = useParams();

  useEffect(() => {
    firebase
      .firestore()
      .collection("customers")
      .doc(cID)
      .get()
      .then((res) => setProfile(res.data()));
  }, [cID]);
  return (
    <>
      {profile.image ? (
        <>
          <div className={style.flexbox}>
            <img
              id="profile-img"
              src={
                input.image
                  ? input.image
                  : props.image
                  ? props.image
                  : profile.image
                  ? profile.image
                  : noImage
              }
              alt="customer"
            />
            <div>
              <div className={style["data-item"]}>
                <div className={style.title}>姓名</div>
                <div id="name">
                  {input.name
                    ? input.name
                    : props.name
                    ? props.name
                    : profile.name
                    ? profile.name
                    : ""}
                </div>
              </div>
              <div className={style["data-item"]}>
                <div className={style.title}>性別</div>
                <div id="gender">
                  {input.gender
                    ? input.gender
                    : props.gender
                    ? props.gender
                    : profile.gender
                    ? profile.gender
                    : ""}
                </div>
              </div>
              <div className={style["data-item"]}>
                <div className={style.title}>年齡</div>
                <div id="age">
                  <span>
                    {input.age
                      ? input.age
                      : props.age
                      ? props.age
                      : profile.age
                      ? profile.age
                      : ""}
                  </span>{" "}
                  歲
                </div>
              </div>
            </div>
          </div>
          <div className={style.flexbox}>
            <div className={style["data-item"]}>
              <div className={style.title}>身高</div>
              <div id="height">
                <span>
                  {input.height
                    ? input.height
                    : props.height
                    ? props.height
                    : profile.height
                    ? profile.height
                    : ""}
                </span>{" "}
                cm
              </div>
            </div>
            <div className={style["data-item"]}>
              <div className={style.title}>體重</div>
              <div id="weight">
                <span>
                  {input.weight
                    ? input.weight
                    : props.weight
                    ? props.weight
                    : profile.weight
                    ? profile.weight
                    : ""}
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
                    : props.education
                    ? props.education
                    : profile.education
                    ? profile.education
                    : ""}
                </span>
              </div>
            </div>
            <div className={style["data-item"]}>
              <div className={style.title}>職業</div>
              <div id="career">
                <span>
                  {input.career
                    ? input.career
                    : props.career
                    ? props.career
                    : profile.career
                    ? profile.career
                    : ""}
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
                    {input.sport
                      ? input.sport
                      : props.sport
                      ? props.sport
                      : profile.sport
                      ? profile.sport
                      : ""}
                  </span>
                </div>
              </div>
            </div>
            <div className={style.col}>
              <div className={style["data-item"]}>
                <div className={style.title}>其他</div>
                <div id="other">
                  <span>
                    {input.other
                      ? input.other
                      : props.other
                      ? props.other
                      : profile.other
                      ? profile.other
                      : ""}
                  </span>
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
