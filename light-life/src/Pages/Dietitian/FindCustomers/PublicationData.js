import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCustomerData,
  getDietitianData,
  setPublicationData,
  getPublicationData,
} from "../../../utils/Firebase";
import Swal from "sweetalert2";
import noImage from "../../../images/noimage.png";
import style from "../../../style/findCustomers.module.scss";

function PublicationData({ publish, display, setDisplay, setPublish }) {
  const [profile, setProfile] = useState({});
  const [invite, setInvite] = useState({});
  const { dID } = useParams();
  const date = new Date(+new Date() + 8 * 3600 * 1000);
  const today = date.toISOString().substr(0, 10);
  const [name, setName] = useState("");
  useEffect(() => {
    getCustomerData(publish.id).then((res) => {
      setProfile(res.data());
    });
    getDietitianData(dID).then((doc) => {
      setName(doc.data().name);
    });
  }, []); //eslint-disable-line

  const messageHandler = (e) => {
    setInvite({
      dietitianID: dID,
      message: e.target.value,
      status: "0",
      inviteDate: today,
      name: name,
    });
  };

  const sendMessageHandler = () => {
    if (invite && invite.message) {
      if (publish.whoInvite) {
        Swal.fire({
          text: "確定送出嗎?",
          confirmButtonText: "確定",
          cancelButtonText: "取消",
          confirmButtonColor: "#1e4d4e",
          showCancelButton: true,
        }).then((res) => {
          if (res.isConfirmed) {
            setPublicationData(
              publish.publishID,
              {
                whoInvite: [...publish.whoInvite, invite],
              },
              true
            ).then(() => {
              Swal.fire({
                text: "邀請成功",
                icon: "success",
                confirmButtonText: "確定",
                confirmButtonColor: "#1e4d4e",
              }).then(() => {
                getPublicationData()
                  .then((docs) => {
                    const publishArray = [];
                    if (!docs.empty) {
                      docs.forEach((doc) => {
                        publishArray.push(doc.data());
                      });
                    }
                    setPublish(publishArray);
                  })
                  .then(() => setDisplay("none"));
              });
            });
          }
        });
      } else {
        Swal.fire({
          text: "確定送出嗎?",
          confirmButtonText: "確定",
          cancelButtonText: "取消",
          confirmButtonColor: "#1e4d4e",
          showCancelButton: true,
        }).then((res) => {
          if (res.isConfirmed) {
            setPublicationData(
              publish.publishID,
              {
                whoInvite: [invite],
              },
              true
            ).then(() => {
              getPublicationData()
                .then((docs) => {
                  const publishArray = [];
                  if (!docs.empty) {
                    docs.forEach((doc) => {
                      publishArray.push(doc.data());
                    });
                  }
                  setPublish(publishArray);
                })
                .then(() => setDisplay("none"));
            });
          }
        });
      }
    } else {
      Swal.fire({
        text: "請填寫邀請訊息",
        confirmButtonText: "確定",
        confirmButtonColor: "#1e4d4e",
      });
    }
  };

  const closeDetailsHandler = () => {
    setDisplay("none");
  };

  return (
    <div
      className={`${style.publicationForm} animated animate__fadeIn`}
      style={{ display: display }}
    >
      <div>
        <i
          className={`${style.close} fa fa-times`}
          aria-hidden="true"
          onClick={closeDetailsHandler}
        ></i>
      </div>

      <div className={style.flexbox}>
        <img id="profile-img" src={profile.image || noImage} alt="customer" />
        <div className={style.basicData}>
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
        <h5>需求描述</h5>
        <div>{publish.content}</div>
      </div>

      <div className={style.message}>
        <h5>邀請訊息</h5>
        {publish.whoInvite &&
        publish.whoInvite.find((e) => e.dietitianID === dID) ? (
          publish.whoInvite.map((e) =>
            e.dietitianID === dID ? <div>{e.message}</div> : ""
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
