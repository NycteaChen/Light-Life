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

function Invited({ publishData, idx, setPublishData, setIsChecked }) {
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

  const buttonHandler = (e) => {
    switch (e.target.id) {
      case "accept":
        console.log(e.target.id);
        break;
      case "decline":
        // firebase
        //   .firestore()
        //   .collection("publish")
        //   .doc(publishData.publishID)
        //   .set({
        //     ...publishData,
        //     whoInvite: [
        //       ...publishData.whoInvite.filter((i, index) => index !== idx),
        //     ],
        //   });
        break;
    }
  };

  return (
    <>
      {profile ? (
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
