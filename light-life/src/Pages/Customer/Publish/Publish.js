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

function Publish() {
  return (
    <div className={style.publish}>
      <div className={style.waiting}>
        <div className={style.header}>
          <h3>刊登需求</h3>
          <div className={style.buttons}>
            <button className={style.add}>新增</button>
            <button className={style.remove}>移除</button>
          </div>
        </div>
        <h4>您目前的刊登</h4>
        {/* <div className={style["publication-list"]}> */}
        <div className={style.publication}>
          <div className={style.col}>
            <div className={style["pulish-time"]}>刊登時間：2021-05-24</div>
            <div className={style["service-time"]}>
              <div>
                預約時間：<span>2021-06-02~2021-06~16</span>
              </div>
            </div>
          </div>
          <div className={style.subject}>標題：想要健身想要健身想要健身</div>
          <div className={style.message}>
            <div>內容：</div>
            <div>
              最近想要健身希望可以有營養師協助飲食。最近想要健身希望可以有營養師協助飲食。
            </div>
          </div>
        </div>
        {/* </div> */}
      </div>
      <div className={style.invited}>
        <h3>誰來應徵</h3>
        <div className={style.inviters}>
          <div className={style.inviter}>
            <div>林筱華 營養師對您的刊登有興趣</div>
            <button>查看詳情</button>
          </div>
          <div className={style.inviter}>
            <div>林筱華 營養師對您的刊登有興趣</div>
            <button>查看詳情</button>
          </div>
        </div>
      </div>
      <div className={style.published}>
        <h3>過去刊登</h3>
        <div className={style.list}>
          <div className={style["published-col"]}>
            <div>
              <div className={style.startDate}>預約開始時間：2021-05-24</div>
              <div className={style.subject}>想要健身想要健身</div>
            </div>
            <div className={style.success}>成功</div>
          </div>
          <div className={style["published-col"]}>
            <div>
              <div className={style.startDate}>預約開始時間：2021-05-24</div>
              <div className={style.subject}>想要健身想要健身</div>
            </div>
            <div className={style.expired}>已過期</div>
          </div>
        </div>
      </div>

      <div className={style.form} style={{ display: "none" }}>
        <h3>刊登</h3>
        <div>
          <label>
            <div>開始</div>
            <input type="date" name="startDate"></input>
          </label>
          <label>
            <div>結束</div>
            <input type="date" name="endDate"></input>
          </label>
        </div>
        <div className={style.title}>
          <label>
            <div>標題</div>
            <input type="text" name="subject"></input>
          </label>
        </div>
        <div className={style.content}>
          <label>
            <div>內容</div>
            <textarea name="content"></textarea>
          </label>
        </div>
        <div className={style.buttons}>
          <button className={style.send}>刊登</button>
          <button className={style.cancel}>取消</button>
        </div>
      </div>
    </div>
  );
}

export default Publish;
