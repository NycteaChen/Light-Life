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
import PublicationData from "./PublicationData.js";
import style from "../../../style/findCustomers.module.scss";

function GetPublication() {
  const [publish, setPublish] = useState(null);
  const [display, setDisplay] = useState("none");
  const [idx, setIdx] = useState("");
  const { dID } = useParams();
  const date = new Date(+new Date() + 8 * 3600 * 1000).getTime();

  useEffect(() => {
    firebase
      .firestore()
      .collection("publish")
      .get()
      .then((docs) => {
        const publishArray = [];
        if (!docs.empty) {
          console.log(docs);
          docs.forEach((doc) => {
            publishArray.push(doc.data());
          });
        }
        return publishArray;
      })
      .then((res) => {
        res.forEach((m, index) => {
          const startDate = new Date(m.startDate).getTime();
          if (startDate < date && m.whoInvite) {
            m.whoInvite.forEach((i) => {
              if (i.status === "0") {
                i.status = "3";
              }
            });
            firebase
              .firestore()
              .collection("publish")
              .doc(res[index].publishID)
              .update(res[index]);
          }
        });
        setPublish(res);
      });
  }, []);
  console.log(publish);
  const checkDetailsHandler = (e) => {
    setIdx(e.target.id);
    setDisplay("block");
  };
  const cancelInviteHandler = (e) => {
    const { publishID, whoInvite } = publish[+e.target.id];
    firebase
      .firestore()
      .collection("publish")
      .doc(publishID)
      .set(
        {
          whoInvite: [...whoInvite.filter((i) => i.dietitianID !== dID)],
        },
        { merge: true }
      )
      .then(() => {
        alert("取消成功!");
        window.location.reload();
      });
  };

  return (
    <>
      <div className={style.publicationData}>
        <h3>刊登中</h3>

        {publish ? (
          publish.find(
            (i) =>
              !i.whoInvite ||
              (i.whoInvite && !i.whoInvite.find((d) => d.dietitianID === dID))
          ) ? (
            publish.map((p, pubIndex) =>
              (!p.whoInvite ||
                (p.whoInvite &&
                  !p.whoInvite.find((e) => e.dietitianID === dID))) &&
              p.status === "0" ? (
                <>
                  <div className={style.publicationList} key={pubIndex}>
                    <div className={style.publication}>
                      <div className={style.col}>
                        <div className={style.flexbox}>
                          <div className={style.flexbox}>
                            <div>預約時間</div>
                            <div>
                              {p.startDate}~{p.endDate}
                            </div>
                          </div>
                          <div className={style.name}>
                            {p.name} {p.gender === "男" ? "先生" : "小姐"}
                          </div>
                        </div>
                        <div className={style.subject}>主旨：{p.subject}</div>
                      </div>
                      <button id={pubIndex} onClick={checkDetailsHandler}>
                        查看詳情
                      </button>
                    </div>
                  </div>
                  {+idx == pubIndex ? (
                    <PublicationData
                      key={p.name}
                      publish={p}
                      display={display}
                      setDisplay={setDisplay}
                    />
                  ) : (
                    ""
                  )}
                </>
              ) : (
                ""
              )
            )
          ) : (
            <div>尚未有刊登</div>
          )
        ) : (
          <div>loading</div>
        )}
      </div>

      <div className={style["inviting-status"]}>
        <h3>邀請狀態</h3>
        <div className={style["inviting-list"]}>
          {publish ? (
            publish.find(
              (i) =>
                i.whoInvite && i.whoInvite.find((e) => e.dietitianID === dID)
            ) ? (
              publish.map((p, pubIndex) =>
                p.whoInvite
                  ? p.whoInvite.map((e, index) =>
                      e.dietitianID === dID ? (
                        <>
                          <div className={style.invite} key={index}>
                            <div>
                              您向 {p.name}{" "}
                              {p.gender === "男" ? "先生" : "小姐"}
                              提出邀請
                            </div>
                            <div className={style.buttons}>
                              {p.whoInvite[index].status === "0" ? (
                                <>
                                  <button
                                    className={style.check}
                                    id={pubIndex}
                                    onClick={checkDetailsHandler}
                                  >
                                    查看詳情
                                  </button>
                                  <button
                                    id={pubIndex}
                                    className={style.cancel}
                                    onClick={cancelInviteHandler}
                                  >
                                    取消邀請
                                  </button>
                                </>
                              ) : p.whoInvite[index].status === "1" ? (
                                <>
                                  <button
                                    className={style.check}
                                    id={pubIndex}
                                    onClick={checkDetailsHandler}
                                  >
                                    查看詳情
                                  </button>
                                  <button className={style.cancel}>成功</button>
                                </>
                              ) : p.whoInvite[index].status === "2" ? (
                                <button className={style.cancel}>婉拒</button>
                              ) : p.whoInvite[index].status === "3" ? (
                                <button className={style.cancel}>逾期</button>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>

                          {+idx == pubIndex ? (
                            <PublicationData
                              key={p.name}
                              publish={p}
                              display={display}
                              setDisplay={setDisplay}
                            />
                          ) : (
                            ""
                          )}
                        </>
                      ) : (
                        ""
                      )
                    )
                  : ""
              )
            ) : (
              <div>尚未有邀請</div>
            )
          ) : (
            <div>loading</div>
          )}
        </div>
      </div>
    </>
  );
}

export default GetPublication;
