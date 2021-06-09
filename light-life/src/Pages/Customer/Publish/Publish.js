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
import Swal from "sweetalert2";
import style from "../../../style/publish.module.scss";
import Invited from "./Invited.js";
import spinner from "../../../images/loading.gif";

function Publish({ reserve }) {
  const { cID } = useParams();
  const [display, setDisplay] = useState("none");
  const [profile, setProfile] = useState({});
  const [publishData, setPublishData] = useState(null);
  const [oldPublish, setOldPublish] = useState(null);
  const [idx, setIdx] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [input, setInput] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [occupationTime, setOccupationTime] = useState([]);
  const today = new Date(+new Date() + 8 * 3600 * 1000);
  const initStartDate = new Date(+new Date() + 8 * 3600 * 1000);
  const endLessDate = new Date(+new Date() + 8 * 3600 * 1000);
  const endMostDate = new Date(+new Date() + 8 * 3600 * 1000);
  const startMostDate = new Date(+new Date() + 8 * 3600 * 1000);
  initStartDate.setDate(initStartDate.getDate() + 1);
  startMostDate.setDate(startMostDate.getDate() + 21);
  endLessDate.setDate(endLessDate.getDate() + 7);
  endMostDate.setDate(endMostDate.getDate() + 14);
  const transDateToTime = (date) => {
    const time = new Date(date).getTime();
    return time;
  };

  useEffect(() => {
    firebase
      .firestore()
      .collection("publish")
      .where("id", "==", cID)
      .get()
      .then((docs) => {
        const occupation = reserve
          .filter((r) => r.status === "0" || r.status === "1")
          .map((u) => [
            transDateToTime(u.reserveStartDate),
            transDateToTime(u.reserveEndDate),
          ]);
        if (!docs.empty) {
          const publishArray = [];
          const oldPublishArray = [];
          docs.forEach((doc) => {
            if (doc.data().status === "1" || doc.data().status === "0") {
              occupation.push([
                transDateToTime(doc.data().startDate),
                transDateToTime(doc.data().endDate),
              ]);
            }
            const startDate = new Date(doc.data().startDate).getTime();
            if (startDate > today && doc.data().status === "0") {
              publishArray.push(doc.data());
            } else if (startDate <= today && doc.data().status === "0") {
              const newData = doc.data();
              newData.status = "3";
              oldPublishArray.push(newData);
              firebase
                .firestore()
                .collection("publish")
                .doc(doc.data().publishID)
                .update(newData);
            } else {
              oldPublishArray.push(doc.data());
            }
          });
          setOccupationTime(occupation);
          setOldPublish(oldPublishArray);
          setPublishData(publishArray);
        } else {
          setOccupationTime(occupation);
          setPublishData([]);
          setOldPublish([]);
        }
      });
    firebase
      .firestore()
      .collection("customers")
      .doc(cID)
      .get()
      .then((res) => setProfile(res.data()));
    setStartDate({
      min: initStartDate.toISOString().substr(0, 10),
      max: startMostDate.toISOString().substr(0, 10),
    });
    setEndDate({
      min: endLessDate.toISOString().substr(0, 10),
      max: endMostDate.toISOString().substr(0, 10),
    });
  }, []);

  const publishModalHandler = (e) => {
    switch (e.target.title) {
      case "add":
        if (publishData.length < 1 || publishData[0].status !== "0") {
          setDisplay("block");
        } else {
          Swal.fire({
            text: "目前已經有刊登囉",
            confirmButtonText: "確定",
            confirmButtonColor: "#1e4d4e",
          });
        }
        break;
      case "remove":
        if (publishData.length > 0) {
          Swal.fire({
            text: "確定移除刊登嗎?",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "取消",
            confirmButtonText: "確定",
            confirmButtonColor: "#1e4d4e",
          }).then((res) => {
            if (res.isConfirmed) {
              firebase
                .firestore()
                .collection("publish")
                .doc(publishData[0].publishID)
                .delete()
                .then(() => {
                  setPublishData([]);
                });
            }
          });
        } else {
          Swal.fire({
            text: "沒有刊登可以移除",
            confirmButtonText: "確定",
            confirmButtonColor: "#1e4d4e",
          });
        }
        break;
      case "cancel":
        setInput({});
        setDisplay("none");
        break;
    }
  };

  const checkDietitianDetails = (e) => {
    setIdx(e.target.id);
    setIsChecked(true);
  };

  const getInputHandler = (e) => {
    const { name } = e.target;
    const test = transDateToTime(e.target.value);
    if (name === "startDate" || name === "endDate") {
      if (
        occupationTime.find((r) => test >= r[0] && test <= r[1]) ||
        (name === "startDate" &&
          occupationTime.find(
            (r) => test < r[0] && transDateToTime(input.endDate) > r[1]
          )) ||
        (name === "endDate" &&
          occupationTime.find(
            (r) => transDateToTime(input.startDate) < r[0] && test > r[1]
          ))
      ) {
        Swal.fire({
          text: "您所選的區間已有安排",
          icon: "warning",
          confirmButtonText: "確定",
          confirmButtonColor: "#1e4d4e",
        });
      } else {
        if (name === "startDate") {
          const newEndLessDate = new Date();
          const newEndMostDate = new Date();

          newEndLessDate.setDate(parseInt(e.target.value.split("-")[2]) + 7);
          newEndMostDate.setDate(parseInt(e.target.value.split("-")[2]) + 14);

          setEndDate({
            min: newEndLessDate.toISOString().substr(0, 10),
            max: newEndMostDate.toISOString().substr(0, 10),
          });
        }
        setInput({
          ...input,
          [name]: e.target.value,
          publishDate: today.toISOString().substr(0, 10),
          name: profile.name,
          gender: profile.gender,
          id: cID,
          status: "0",
        });
      }
    } else {
      setInput({
        ...input,
        [name]: e.target.value,
        publishDate: today.toISOString().substr(0, 10),
        name: profile.name,
        gender: profile.gender,
        id: cID,
        status: "0",
      });
    }
  };

  const newPublishHandler = (e) => {
    if (
      !profile.gender ||
      !profile.name ||
      !profile.weight ||
      !profile.height ||
      !profile.career ||
      !profile.education ||
      !profile.age
    ) {
      Swal.fire({
        text: "個人資料填寫完整才能發佈刊登喔",
        icon: "warning",
        confirmButtonText: "確定",
        confirmButtonColor: "#1e4d4e",
      });
    } else {
      if (input.endDate && input.startDate && input.subject && input.content) {
        firebase
          .firestore()
          .collection("publish")
          .add(input)
          .then((res) => {
            firebase
              .firestore()
              .collection("publish")
              .doc(res.id)
              .update({ publishID: res.id });
            return res.id;
          })
          .then((res) => {
            Swal.fire({
              text: "發佈成功",
              icon: "success",
              confirmButtonText: "確定",
              confirmButtonColor: "#1e4d4e",
            });
            setPublishData([{ ...input, publishID: res }]);
            setDisplay("none");
            setInput({});
          });
      } else {
        Swal.fire({
          text: "刊登資料要填寫完整喔",
          icon: "warning",
          confirmButtonText: "確定",
          confirmButtonColor: "#1e4d4e",
        });
      }
    }
  };
  return (
    <div className={style.publish}>
      <div className={style.waiting}>
        <div className={style.header}>
          <h4>刊登需求</h4>
          <div className={style.buttons}>
            <button
              className={style.add}
              title="add"
              onClick={publishModalHandler}
            >
              <i
                class="fa fa-pencil-square-o"
                aria-hidden="true"
                title="add"
              ></i>
            </button>
            <button
              className={style.remove}
              title="remove"
              onClick={publishModalHandler}
            >
              <i class="fa fa-trash-o" aria-hidden="true" title="remove"></i>
            </button>
          </div>
        </div>
        <p>一次僅能發佈一個刊登</p>
        {publishData ? (
          publishData.length > 0 && publishData[0].status === "0" ? (
            <>
              <h5>您目前的刊登</h5>
              <div className={style.publication}>
                <div className={style.col}>
                  <div className={style.para}>
                    <span className={style.title}>刊登時間</span>：
                    {publishData[0].publishDate}
                  </div>
                  <div className={style.para}>
                    <div>
                      <span className={style.title}>預約時間：</span>
                      <span>
                        {publishData[0].startDate}~{publishData[0].endDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={style.para}>
                  <span className={style.title}>主旨：</span>
                  {publishData[0].subject}
                </div>
                <div className={`${style.message} ${style.para}`}>
                  <div className={style.title}>內容：</div>
                  <div>{publishData[0].content}</div>
                </div>
              </div>
            </>
          ) : (
            <div>目前沒有刊登喔</div>
          )
        ) : (
          <div style={{ textAlign: "center" }}>
            <img src={spinner} style={{ width: "50px", height: "50px" }} />
          </div>
        )}
      </div>
      <div className={style.invited}>
        <h4>誰來應徵</h4>
        <div className={style.inviters}>
          {publishData ? (
            publishData[0] &&
            publishData[0].whoInvite &&
            publishData[0].status === "0" &&
            publishData[0].whoInvite.find((i) => i.status === "0") ? (
              publishData[0].whoInvite.map((i, index) => (
                <>
                  {i.status === "0" ? (
                    <div className={style.inviter}>
                      <div>{i.name} 營養師對您的刊登有興趣</div>
                      <button id={index} onClick={checkDietitianDetails}>
                        查看詳情
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </>
              ))
            ) : (
              <div>沒有應徵喔</div>
            )
          ) : (
            <div style={{ textAlign: "center" }}>
              <img src={spinner} style={{ width: "50px", height: "50px" }} />
            </div>
          )}
          {publishData && isChecked ? (
            <Invited
              publishData={publishData}
              idx={idx}
              setPublishData={setPublishData}
              setIsChecked={setIsChecked}
              setOldPublish={setOldPublish}
              oldPublish={oldPublish}
            />
          ) : (
            ""
          )}
        </div>
      </div>
      <div className={style.published}>
        <h4>過去刊登</h4>
        <div className={style.list}>
          {oldPublish ? (
            oldPublish.length > 0 ? (
              oldPublish.map((o) => (
                <div className={style["published-col"]}>
                  <div>
                    <div className={style.startDate}>
                      預約開始時間：{o.startDate}
                    </div>
                    <div className={style.subject}>{o.subject}</div>
                  </div>
                  {o.status === "1" ? (
                    <>
                      <span className={style.success}>成功</span>
                    </>
                  ) : o.status === "3" ? (
                    <span className={style.expired}>逾期</span>
                  ) : (
                    ""
                  )}
                </div>
              ))
            ) : (
              <div>沒有喔</div>
            )
          ) : (
            <div style={{ textAlign: "center" }}>
              <img src={spinner} style={{ width: "50px", height: "50px" }} />
            </div>
          )}
        </div>
      </div>

      <div
        className={`${style.form} animated animate__fadeIn`}
        style={{ display: display }}
      >
        <h4>刊登</h4>
        <div>
          <label>
            <div className={style.title}>開始</div>
            <input
              type="date"
              name="startDate"
              min={startDate ? startDate.min : ""}
              max={startDate ? startDate.max : ""}
              value={input.startDate || ""}
              onChange={getInputHandler}
            ></input>
          </label>
          <label>
            <div className={style.title}>結束</div>
            <input
              type="date"
              name="endDate"
              min={endDate ? endDate.min : ""}
              max={endDate ? endDate.max : ""}
              value={input.endDate || ""}
              onChange={getInputHandler}
            ></input>
          </label>
        </div>
        <div className={style.subject}>
          <label>
            <div className={style.title}>主旨</div>
            <input
              type="text"
              name="subject"
              value={input.subject || ""}
              onChange={getInputHandler}
            ></input>
          </label>
        </div>
        <div className={style.content}>
          <label>
            <div className={style.title}>內容</div>
            <textarea
              name="content"
              value={input.content || ""}
              onChange={getInputHandler}
            />
          </label>
        </div>
        <div className={style.buttons}>
          <button className={style.send} onClick={newPublishHandler}>
            刊登
          </button>
          <button
            className={style.cancel}
            title="cancel"
            onClick={publishModalHandler}
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}

export default Publish;
