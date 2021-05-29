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

function PublicationData({ publish, display, setDisplay }) {
  const [profile, setProfile] = useState({});
  useEffect(() => {
    firebase
      .firestore()
      .collection("customers")
      .doc(publish.id)
      .get()
      .then((res) => {
        setProfile(res.data());
      });
  }, []);

  const closeDetailsHandler = () => {
    setDisplay("none");
  };

  return (
    <div className={style.publicationForm} style={{ display: display }}>
      <div>
        <i
          className={`${style.close} fa fa-times`}
          aria-hidden="true"
          onClick={closeDetailsHandler}
        ></i>
      </div>

      <div className={style.flexbox}>
        <img id="profile-img" src={noImage} alt="customer" />
        <div>
          <div className={style["data-item"]}>
            <div className={style.title}>姓名</div>
            <div id="name">{profile.name}</div>
          </div>
          <div className={style["data-item"]}>
            <div className={style.title}>性別</div>
            <div id="gender">{profile.gender}</div>
          </div>
          <div className={style["data-item"]}>
            <div className={style.title}>年齡</div>
            <div id="age">{profile.age} 歲</div>
          </div>
        </div>
      </div>

      <div className={style.flexbox}>
        <div className={style["data-item"]}>
          <div className={style.title}>身高</div>
          <div id="height">
            {profile.height}
            cm
          </div>
        </div>
        <div className={style["data-item"]}>
          <div className={style.title}>體重</div>
          <div id="weight">{profile.weight} kg</div>
        </div>
      </div>
      <div className={style.flexbox}>
        <div className={style["data-item"]}>
          <div className={style.title}>教育程度</div>
          <div id="education">{profile.education}</div>
        </div>
        <div className={style["data-item"]}>
          <div className={style.title}>職業</div>
          <div id="career">{profile.career}</div>
        </div>
      </div>
      <div className={style.flexcol}>
        <div className={style.col}>
          <div className={style["data-item"]}>
            <div className={style.title}>運動習慣</div>
            <div id="sport">{profile.sport}</div>
          </div>
        </div>
        <div className={style.col}>
          <div className={style["data-item"]}>
            <div className={style.title}>其他</div>
            <div id="other">{profile.other}</div>
          </div>
        </div>
      </div>

      <div className={style.message}>
        <h3>邀請訊息</h3>
        <textarea>想為您服務</textarea>
        <div className={style.buttons}>
          <button className={style.send}>發送</button>
          <button className={style.cancel} onClick={closeDetailsHandler}>
            取消
          </button>
        </div>
      </div>
    </div>
  );
}

export default PublicationData;
