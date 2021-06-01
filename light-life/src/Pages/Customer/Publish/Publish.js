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
import Invited from "./Invited.js";

function Publish() {
  const { cID } = useParams();
  const [display, setDisplay] = useState("none");
  const [profile, setProfile] = useState({});
  const [publishData, setPublishData] = useState(null);
  const [oldPublish, setOldPublish] = useState(null);
  const [idx, setIdx] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const today = new Date(+new Date() + 8 * 3600 * 1000);
  const [input, setInput] = useState({});

  useEffect(() => {
    firebase
      .firestore()
      .collection("publish")
      .where("id", "==", cID)
      .get()
      .then((docs) => {
        if (!docs.empty) {
          const publishArray = [];
          const oldPublishArray = [];
          docs.forEach((doc) => {
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

          setOldPublish(oldPublishArray);
          setPublishData(publishArray);
        } else {
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
  }, []);

  const publishModalHandler = (e) => {
    switch (e.target.id) {
      case "add":
        if (publishData.length < 1 || publishData[0].status !== "0") {
          setDisplay("block");
        } else {
          alert("目前已有刊登了喔");
        }
        break;
      case "remove":
        if (publishData.length > 0) {
          if (window.confirm("確定移除嗎?")) {
            alert("移除");
            firebase
              .firestore()
              .collection("publish")
              .doc(publishData[0].publishID)
              .delete()
              .then(() => {
                alert("移除成功!");
                setPublishData([]);
              });
          }
        } else {
          alert("沒有刊登可以移除");
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
    setInput({
      ...input,
      [name]: e.target.value,
      publishDate: today.toISOString().substr(0, 10),
      name: profile.name,
      gender: profile.gender,
      id: cID,
      status: "0",
    });
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
      alert("您的個人資料尚未填寫完整喔");
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
            alert("發布成功");
            setPublishData([{ ...input, publishID: res }]);
            setDisplay("none");
            setInput({});
          });
      } else {
        alert("資料不完整喔");
      }
    }
  };
  return (
    <div className={style.publish}>
      <div className={style.waiting}>
        <div className={style.header}>
          <h3>刊登需求</h3>
          <div className={style.buttons}>
            <button
              className={style.add}
              id="add"
              onClick={publishModalHandler}
            >
              新增
            </button>
            <button
              className={style.remove}
              id="remove"
              onClick={publishModalHandler}
            >
              移除
            </button>
          </div>
        </div>
        <h4>您目前的刊登</h4>
        {/* <div className={style["publication-list"]}> */}
        {publishData ? (
          publishData.length > 0 && publishData[0].status === "0" ? (
            <div className={style.publication}>
              <div className={style.col}>
                <div className={style["pulish-time"]}>
                  刊登時間：{publishData[0].publishDate}
                </div>
                <div className={style["service-time"]}>
                  <div>
                    預約時間：
                    <span>
                      {publishData[0].startDate}~{publishData[0].endDate}
                    </span>
                  </div>
                </div>
              </div>
              <div className={style.subject}>
                標題：{publishData[0].subject}
              </div>
              <div className={style.message}>
                <div>內容：</div>
                <div>{publishData[0].content}</div>
              </div>
            </div>
          ) : (
            <div>沒有刊登喔</div>
          )
        ) : (
          <div>loading</div>
        )}
        {/* </div> */}
      </div>
      <div className={style.invited}>
        <h3>誰來應徵</h3>
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
            <div>loading</div>
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
        <h3>過去刊登</h3>
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
                      <div className={style.success}>成功</div>
                    </>
                  ) : o.status === "3" ? (
                    <div className={style.expired}>已過期</div>
                  ) : (
                    ""
                  )}
                </div>
              ))
            ) : (
              <div>沒有喔</div>
            )
          ) : (
            <div>loading</div>
          )}
        </div>
      </div>

      <div className={style.form} style={{ display: display }}>
        <h3>刊登</h3>
        <div>
          <label>
            <div>開始</div>
            <input
              type="date"
              name="startDate"
              value={input.startDate || ""}
              onChange={getInputHandler}
            ></input>
          </label>
          <label>
            <div>結束</div>
            <input
              type="date"
              name="endDate"
              value={input.endDate || ""}
              onChange={getInputHandler}
            ></input>
          </label>
        </div>
        <div className={style.title}>
          <label>
            <div>標題</div>
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
            <div>內容</div>
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
            id="cancel"
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
