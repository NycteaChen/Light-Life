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
import style from "../../../style/dietitianProfile.module.scss";

function Publish() {
  return (
    <div style={{ marginLeft: "300px" }}>
      <div>刊登需求</div>
      <button>新增</button>
    </div>
  );
}

export default Publish;
