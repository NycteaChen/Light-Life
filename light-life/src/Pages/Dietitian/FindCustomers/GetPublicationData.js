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
import style from "../../../style/findCustomers.module.scss";

function GetPublicationData() {
  return (
    <div className={style.publicationList}>
      <div className={style.publication}>
        <div className={style.col}>
          <div className={style.name}>陳曉明</div>
          <div className={style.subject}>想找一個可以幫我健身的人</div>
          <div>
            <div>預約時間</div>
            <div>2021-05-27~2021-05-31</div>
          </div>
          <button>查看詳情</button>
        </div>
      </div>
    </div>
  );
}

export default GetPublicationData;
