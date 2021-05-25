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

function CustomerTarget() {
  const [target, setTarget] = useState([]);
  const params = useParams();

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
      <div id="dietitian-target">
        <h2>目標設定</h2>
        <h3>已設立目標</h3>
        <div id="customer-target">
          <TargetHandler target={target} />
        </div>
      </div>
    </>
  );
}

export default CustomerTarget;
