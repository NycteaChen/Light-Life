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
import { isCompositeComponent } from "react-dom/test-utils";

function GetPublication() {
  const [publish, setPublish] = useState([]);
  const [display, setDisplay] = useState("none");
  const [idx, setIdx] = useState("");
  const dID = useParams().dID;
  useEffect(() => {
    firebase
      .firestore()
      .collection("publish")
      .get()
      .then((docs) => {
        const publishArray = [];
        docs.forEach((doc) => {
          publishArray.push(doc.data());
        });
        setPublish(publishArray);
      });
  }, []);

  const checkDetailsHandler = (e) => {
    setIdx(e.target.id);
    setDisplay("block");
  };
  console.log(publish);
  const test = () => {
    // const b = publish
    //   .find((e, index) => e.whoInvite)
    //   .whoInvite.find((e) => e.dietitianID === dID);
    // const a = publish.map((p) => p.whoInvite);
    // const b = a.find((e) => e.dietitianID === dID);
    // console.log(a);
    // const b = a.find((e) => e.length > 0).find((e) => e.dietitianID === dID);
    // console.log(b);
    // console.log(b);
    publish.forEach((e, index) => {
      if (e.whoInvite) {
        e.whoInvite.forEach((w, idx) => {
          if (w.dietitianID === dID) {
            console.log(`第${index}個刊登的publish中`);
            console.log(w);
          }
        });
      }
    });
  };
  if (publish) {
    test();
  }

  return (
    <>
      <div className={style.publicationData}>
        <h3>刊登中</h3>

        {publish
          ? publish.map((p, index) => (
              <>
                <div className={style.publicationList} key={index}>
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
                    <button id={index} onClick={checkDetailsHandler}>
                      查看詳情
                    </button>
                  </div>
                </div>
                {parseInt(idx) == index ? (
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
            ))
          : ""}
      </div>

      <div className={style["inviting-status"]}>
        <h3>邀請狀態</h3>
        {publish.map((p, index) =>
          p.whoInvite ? (
            p.whoInvite.find((e) => e.dietitianID === dID) ? (
              <div className={style["inviting-list"]}>
                <div className={style.invite}>
                  <div>
                    您向 {p.name} {p.gender === "男" ? "先生" : "小姐"}提出邀請
                  </div>
                  <div className={style.buttons}>
                    <button className={style.check}>查看詳情</button>
                    <button className={style.cancel}>取消邀請</button>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )
          ) : (
            ""
          )
        )}
      </div>
    </>
  );
}

export default GetPublication;
