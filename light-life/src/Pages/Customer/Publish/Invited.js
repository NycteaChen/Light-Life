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
import style from "../../../style/publish.module.scss";

function Invited({
  publishData,
  idx,
  setPublishData,
  setIsChecked,
  setOldPublish,
  oldPublish,
}) {
  const props = publishData[0].whoInvite[+idx];
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    firebase
      .firestore()
      .collection("dietitians")
      .doc(props.dietitianID)
      .get()
      .then((docs) => {
        setProfile(docs.data());
      });
  }, []);
  console.log(oldPublish);
  const buttonHandler = (e) => {
    switch (e.target.id) {
      case "accept":
        publishData[0].status = "1";
        publishData[0].whoInvite.forEach((e) => {
          e.status = "2";
        });

        publishData[0].whoInvite[+idx].status = "1";
        firebase
          .firestore()
          .collection("publish")
          .doc(publishData[0].publishID)
          .set({ ...publishData[0] });
        setPublishData([...publishData]);
        if (oldPublish) {
          setOldPublish([publishData[0], ...oldPublish]);
        } else {
          setOldPublish([publishData[0]]);
        }
        setIsChecked(false);
        break;
      case "decline":
        if (window.confirm("確定拒絕嗎?")) {
          setIsChecked(false);
          publishData[0].whoInvite[+idx].status = "2";
          firebase
            .firestore()
            .collection("publish")
            .doc(publishData[0].publishID)
            .set(
              {
                whoInvite: [...publishData[0].whoInvite],
              },
              { merge: true }
            );

          setPublishData([
            {
              ...publishData[0],
              whoInvite: [
                ...publishData[0].whoInvite.filter(
                  (i, index) => index !== +idx
                ),
              ],
            },
          ]);
        }
        break;
    }
  };

  return (
    <>
      {profile && profile.name ? (
        <div className={style["dietitian-details"]}>
          <div>
            <i
              className={`${style.close} fa fa-times`}
              onClick={() => setIsChecked(false)}
              aria-hidden="true"
            ></i>
          </div>
          <div>
            <div className={style.name}>{props.name}營養師</div>
            <div className={style.img}>
              <img src={profile.image} alt="dietitian" />
            </div>
          </div>
          <div className={style.content}>
            <div className={style.gender}>性別：{profile.gender}</div>
            <div className={style.education}>
              <div>最高學歷：{profile.education["school"]}</div>
              <div>
                <span>{profile.education["department"]} </span>
                <span>{profile.education["degree"]}</span>
              </div>
            </div>
            <div className={style.skills}>
              專長：
              <span>
                {profile.skills.weightControl ? "體重管理　" : ""}
                {profile.skills.sportNT ? "運動營養　" : ""}
                {profile.skills.threeHigh ? "三高控制　" : ""}
                {profile.skills.bloodSugar ? "血糖控制" : ""}
              </span>
            </div>
            <div className={style.other}>
              <div>其他</div>
              <div>{profile.other}</div>
            </div>
            <div className={style.message}>
              <div>邀請訊息</div>
              <div>{props.message}</div>
            </div>
          </div>

          <div className={style.buttons}>
            <button
              className={style.accept}
              onClick={buttonHandler}
              id="accept"
            >
              接受
            </button>
            <button
              className={style.decline}
              onClick={buttonHandler}
              id="decline"
            >
              婉拒
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default Invited;
