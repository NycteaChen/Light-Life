import React, { useEffect, useState } from "react";
import {
  getDietitianData,
  addPending,
  updatePendingID,
  setPublicationData,
  getCustomerPublish,
} from "../../../utils/Firebase";
import Swal from "sweetalert2";
import publish from "../../../style/publish.module.scss";
import style from "../../../style/findDietitian.module.scss";
import { useParams } from "react-router-dom";

function Invited({
  publishData,
  idx,
  setPublishData,
  setIsChecked,
  setOldPublish,
  oldPublish,
  pending,
  setPending,
}) {
  const { cID } = useParams();
  const props = publishData[0].whoInvite[+idx];
  const [profile, setProfile] = useState(null);
  const [inviteData, setInviteData] = useState({});
  useEffect(() => {
    getDietitianData(props.dietitianID).then((docs) => {
      setProfile(docs.data());
    });
    getCustomerPublish(cID).then((docs) => {
      if (!docs.empty) {
        docs.forEach((doc) => {
          if (doc.data().status === "0") {
            setInviteData(doc.data());
          }
        });
      }
    });
  }, []); //eslint-disable-line

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
            publishData[0].whoInvite.forEach((e, index) => {
              if (index === +idx) {
                e.status = "1";
              } else {
                e.status = "2";
              }
            });
            addPending({
              dietitian: props.dietitianID,
              customer: publishData[0].id,
              startDate: publishData[0].startDate,
              endDate: publishData[0].endDate,
            }).then((docRef) => {
              getDietitianData(props.dietitianID)
                .then((res) => {
                  const promise = {
                    dietitian: props.dietitianID,
                    customer: publishData[0].id,
                    startDate: publishData[0].startDate,
                    endDate: publishData[0].endDate,
                    dietitianName: res.data().name,
                  };
                  return promise;
                })
                .then((res) => {
                  console.log(res);
                  setPending([...pending, res]);
                });
              updatePendingID(docRef.id);
            });

            setPublicationData(
              publishData[0].publishID,
              { ...publishData[0] },
              false
            );
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
            inviteData.whoInvite[+idx].status = "2";
            setPublicationData(
              publishData[0].publishID,
              {
                whoInvite: [...inviteData.whoInvite],
              },
              true
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
