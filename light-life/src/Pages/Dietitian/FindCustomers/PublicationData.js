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
  const [invite, setInvite] = useState({});
  const { dID } = useParams();
  const date = new Date(+new Date() + 8 * 3600 * 1000);
  const today = date.toISOString().substr(0, 10);

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

  const messageHandler = (e) => {
    setInvite({
      dietitianID: dID,
      message: e.target.value,
      status: "0",
      inviteDate: today,
    });
  };

  const sendMessageHandler = () => {
    console.log(invite);
    if (invite && invite.message) {
      if (publish.whoInvite) {
        firebase
          .firestore()
          .collection("publish")
          .doc(publish.publishID)
          .set(
            {
              whoInvite: [...publish.whoInvite, invite],
            },
            { merge: true }
          )
          .then(() => {
            alert("邀請成功!");
            window.location.reload();
          });
      } else {
        firebase
          .firestore()
          .collection("publish")
          .doc(publish.publishID)
          .set(
            {
              whoInvite: [invite],
            },
            { merge: true }
          )
          .then(() => {
            alert("邀請成功!");
            window.location.reload();
          });
      }
    } else {
      alert("請填寫邀請訊息!");
    }
  };

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
        <img id="profile-img" src={profile.image || noImage} alt="customer" />
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
        <h3>需求描述</h3>
        <div style={{ maxHeight: "5rem", overflow: "auto" }}>
          {publish.content}
        </div>
      </div>

      <div className={style.message}>
        <h3>邀請訊息</h3>

        {publish.whoInvite &&
        publish.whoInvite.find((e) => e.dietitianID === dID) ? (
          publish.whoInvite.map((e) =>
            e.dietitianID === dID ? (
              <div
                style={{
                  maxHeight: "5rem",
                  overflow: "auto",
                }}
              >
                {e.message}
              </div>
            ) : (
              ""
            )
          )
        ) : (
          <>
            <textarea
              value={invite.message ? invite.message : ""}
              onChange={messageHandler}
            ></textarea>
            <div className={style.buttons}>
              <button className={style.send} onClick={sendMessageHandler}>
                發送
              </button>
              <button className={style.cancel} onClick={closeDetailsHandler}>
                取消
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PublicationData;
