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
  return (
    <>
      <div className={style.publicationData}>
        <h3>刊登中</h3>
        <div className={style.publicationList}>
          <div className={style.publication}>
            <div className={style.col}>
              <div className={style.flexbox}>
                <div className={style.flexbox}>
                  <div>預約時間</div>
                  <div>2021-05-27~2021-05-31</div>
                </div>
                <div className={style.name}>陳曉明 先生</div>
              </div>
              <div className={style.subject}>想找一個可以幫我健身的人</div>
            </div>
            <button>查看詳情</button>
          </div>
          <div className={style.publication}>
            <div className={style.col}>
              <div className={style.flexbox}>
                <div className={style.flexbox}>
                  <div>預約時間</div>
                  <div>2021-05-27~2021-05-31</div>
                </div>
                <div className={style.name}>陳曉明 先生</div>
              </div>
              <div className={style.subject}>想找一個可以幫我健身的人</div>
            </div>
            <button>查看詳情</button>
          </div>
          <div className={style.publication}>
            <div className={style.col}>
              <div className={style.flexbox}>
                <div className={style.flexbox}>
                  <div>預約時間</div>
                  <div>2021-05-27~2021-05-31</div>
                </div>
                <div className={style.name}>陳曉明 先生</div>
              </div>
              <div className={style.subject}>想找一個可以幫我健身的人</div>
            </div>
            <button>查看詳情</button>
          </div>
        </div>
      </div>

      <div className={style["inviting-status"]}>
        <h3>邀請狀態</h3>
        <div className={style["inviting-list"]}>
          <div className={style.invite}>
            <div>您向 陳曉明 先生提出邀請</div>
            <div className={style.buttons}>
              <button className={style.check}>查看詳情</button>
              <button className={style.cancel}>取消邀請</button>
            </div>
          </div>
          <div className={style.invite}>
            <div>您向 陳曉明 先生提出邀請</div>
            <div className={style.buttons}>
              <button className={style.check}>查看詳情</button>
              <button className={style.cancel}>取消邀請</button>
            </div>
          </div>
          <div className={style.invite}>
            <div>您向 陳曉明 先生提出邀請</div>
            <div className={style.buttons}>
              <button className={style.check}>查看詳情</button>
              <button className={style.cancel}>取消邀請</button>
            </div>
          </div>
        </div>
      </div>

      <PublicationData />
    </>
  );
}

export default GetPublication;
