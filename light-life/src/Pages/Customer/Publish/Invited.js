import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import Swal from "sweetalert2";
import publish from "../../../style/publish.module.scss";
import style from "../../../style/findDietitian.module.scss";

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
  const buttonHandler = (e) => {
    switch (e.target.id) {
      case "accept":
        Swal.fire({
          text: "確定接受嗎",
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "取消",
          confirmButtonText: "確定",
          confirmButtonColor: "#1e4d4e",
        }).then((res) => {
          if (res.isConfirmed) {
            publishData[0].status = "1";
            publishData[0].whoInvite.forEach((e) => {
              e.status = "2";
            });

            publishData[0].whoInvite[+idx].status = "1";
            firebase
              .firestore()
              .collection("pending")
              .add({
                dietitian: props.dietitianID,
                customer: publishData[0].id,
                startDate: publishData[0].startDate,
                endDate: publishData[0].endDate,
              })
              .then((docRef) => {
                firebase
                  .firestore()
                  .collection("pending")
                  .doc(docRef.id)
                  .update("id", docRef.id);
              });

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
          }
        });
        break;
      case "decline":
        Swal.fire({
          text: "確定拒絕嗎",
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "取消",
          confirmButtonText: "確定",
          confirmButtonColor: "#1e4d4e",
        }).then((res) => {
          if (res.isConfirmed) {
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
        });
        break;
      default:
        break;
    }
  };
  return (
    <>
      {profile && profile.name ? (
        <div
          className={`${style["dietitian-details"]} animated animate__fadeIn`}
        >
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
            <div className={style.flexbox}>
              <div className={style.gender}>
                <span className={style.title}>性別</span>　
                <span>{profile.gender}</span>
              </div>
              <div className={style.education}>
                <div>
                  <span className={style.title}>學歷</span>　
                  {profile.education["school"]}
                </div>
                <div>
                  <span>{profile.education["department"]}　</span>
                  <span>{profile.education["degree"]}</span>
                </div>
              </div>
            </div>

            <div className={style.skills}>
              <div className={style.title}>專長　</div>
              <div>
                {profile.skills.weightControl ? <span>體重管理　</span> : ""}
                {profile.skills.sportNT ? <span>運動營養　</span> : ""}
                {profile.skills.threeHigh ? <span>三高控制　</span> : ""}
                {profile.skills.bloodSugar ? <span>血糖控制　</span> : ""}
              </div>
            </div>

            <div className={style.other}>
              <div className={style.title}>其他</div>
              <div>{profile.other}</div>
            </div>
          </div>

          <div className={`${style["reserve-form"]}`}>
            <div className={style.form}>
              <div className={style["form-title"]}>邀請訊息</div>

              <div className={publish["invite-message"]}>{props.message}</div>

              <div className={publish["form-buttons"]}>
                <button
                  className={publish.accept}
                  onClick={buttonHandler}
                  id="accept"
                >
                  接受
                </button>
                <button
                  className={publish.decline}
                  onClick={buttonHandler}
                  id="decline"
                >
                  婉拒
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default Invited;
