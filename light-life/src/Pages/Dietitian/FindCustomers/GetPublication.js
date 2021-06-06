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
import PublicationData from "./PublicationData.js";
import style from "../../../style/findCustomers.module.scss";
import "animate.css/animate.min.css";

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
  const checkDetailsHandler = (e) => {
    setIdx(e.target.id);
    setDisplay("block");
  };
  const cancelInviteHandler = (e) => {
    const { publishID, whoInvite } = publish[+e.target.id];
    Swal.fire({
      text: "確定取消嗎?",
      confirmButtonText: "確定",
      cancelButtonText: "返回",
      confirmButtonColor: "#1e4d4e",
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
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
            window.location.reload();
          });
      }
    });
  };

  return (
    <>
      <div className={style.publicationData}>
        <h5>刊登中</h5>
        <div className={style.publicationList}>
          {publish ? (
            publish.find(
              (i) =>
                i.status === "0" &&
                (!i.whoInvite ||
                  (i.whoInvite &&
                    !i.whoInvite.find((d) => d.dietitianID === dID)))
            ) ? (
              publish.map((p, pubIndex) =>
                (!p.whoInvite ||
                  (p.whoInvite &&
                    !p.whoInvite.find((e) => e.dietitianID === dID))) &&
                p.status === "0" ? (
                  <>
                    <div className={style.publication} key={pubIndex}>
                      <div className={style.col}>
                        <div className={style.flexbox}>
                          <div className={style.flexbox}>
                            <div>
                              預約時間<span>：</span>
                            </div>
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
                      <div className={style.button}>
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
        </div>{" "}
      </div>

      <div className={style["inviting-status"]}>
        <h5>邀請狀態</h5>
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
                                  <span className={style.success}>成功</span>
                                </>
                              ) : p.whoInvite[index].status === "2" ? (
                                <span className={style.failed}>婉拒</span>
                              ) : p.whoInvite[index].status === "3" ? (
                                <span className={style.failed}>逾期</span>
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
