import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getPublicationData,
  updatePublication,
  setPublicationData,
} from "../../../utils/Firebase.js";
import Swal from "sweetalert2";
import PublicationData from "./PublicationData.js";
import style from "../../../style/findCustomers.module.scss";
import "animate.css/animate.min.css";
import image from "../../../style/image.module.scss";
import spinner from "../../../images/loading.gif";
import nothing from "../../../images/nothing.svg";

function GetPublication() {
  const [publish, setPublish] = useState(null);
  const [display, setDisplay] = useState("none");
  const [spinnerDisplay, setSpinnerDisplay] = useState("inline-block");
  const [idx, setIdx] = useState("");
  const { dID } = useParams();
  const date = new Date(+new Date() + 8 * 3600 * 1000).getTime();

  useEffect(() => {
    getPublicationData()
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
        console.log(res);
        res.forEach((m, index) => {
          const startDate = new Date(m.startDate).getTime();
          if (startDate < date && m.whoInvite) {
            m.whoInvite.forEach((i) => {
              if (i.status === "0") {
                i.status = "3";
              }
            });
            updatePublication(res[index].publishID, res[index]);
          }
        });
        setPublish(res);
      });
  }, []);

  useEffect(() => {
    if (publish) {
      setSpinnerDisplay("none");
    }
  }, []); //eslint-disable-line

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
        setPublicationData(
          publishID,
          {
            whoInvite: [...whoInvite.filter((i) => i.dietitianID !== dID)],
          },
          true
        ).then(() => {
          getPublicationData().then((docs) => {
            const publishArray = [];
            if (!docs.empty) {
              docs.forEach((doc) => {
                publishArray.push(doc.data());
              });
            }
            setPublish(publishArray);
          });
        });
      }
    });
  };

  return (
    <>
      <div className={style.publicationData}>
        <h5>目前的客戶刊登</h5>
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

                    {+idx === pubIndex ? (
                      <PublicationData
                        key={p.name}
                        publish={p}
                        display={display}
                        setDisplay={setDisplay}
                        setPublish={setPublish}
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
              <div className={image.nothing}>
                <img src={nothing} alt="nothing" />
              </div>
            )
          ) : (
            <div className={image.spinner}>
              <img
                src={spinner}
                style={{ display: spinnerDisplay }}
                alt="spinner"
              />
            </div>
          )}
        </div>
      </div>

      <div className={style["inviting-status"]}>
        <h5>您的邀請清單</h5>
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

                          {+idx === pubIndex ? (
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
              <div className={image.nothing}>
                <img src={nothing} alt="nothing" />
              </div>
            )
          ) : (
            <div className={image.spinner}>
              <img
                src={spinner}
                style={{ display: spinnerDisplay }}
                alt="spinner"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default GetPublication;
