import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  useParams,
} from "react-router-dom";

import TargetHandler from "../../Components/TargetHandler.js";
import style from "../../../style/target.module.scss";

function CustomerTarget() {
  const [target, setTarget] = useState([]);
  const params = useParams();
  console.log(params);
  useEffect(() => {
    firebase
      .firestore()
      .collection("customers")
      .doc(params.cID)
      .get()
      .then((doc) => {
        return doc.data().dietitian;
      })
      .then((res) => {
        firebase
          .firestore()
          .collection("dietitians")
          .doc(res)
          .collection("customers")
          .doc(params.cID)
          .collection("target")
          .get()
          .then((docs) => {
            const targetArray = [];
            docs.forEach((doc) => {
              targetArray.push(doc.data());
            });
            setTarget(targetArray);
          });
      });
  }, []);

  return (
    <>
      <div className={style["target-setting"]} id="dietitian-target">
        <h3>已設立目標</h3>
        <div className={style["c-targets"]}>
          <TargetHandler target={target} />
        </div>
      </div>
    </>
  );
}

export default CustomerTarget;
