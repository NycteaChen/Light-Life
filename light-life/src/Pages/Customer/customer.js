import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Profile from "../cusotmerProfile.js";
import DietrayRecord from "../dietaryRecord.js";
import Target from "../target.js";
import firebase from "firebase/app";
import "firebase/firestore";

function Customer() {
  const [profile, setProfile] = useState({});
  useEffect(() => {
    firebase
      .firestore()
      .collection("customers")
      .get()
      .then((snapshot) => {
        const users = [];
        snapshot.forEach((doc) => {
          users.push(doc.data());
        });
        return users[0];
      })
      .then((res) => {
        setProfile(res);
      });
  }, []);

  // const bingSaveHandler = () => {
  //   // db.collection("dietitians").doc("9iYZMkuFdZRK9vxgt1zc").update("id", docRef.id);

  //   console.log(profile);
  //   console.log("hi");
  // };

  return (
    <>
      <h2>我的營養師：</h2>
      <Router>
        <h3>OOO，您好！</h3>
        <Link to="/customer/profile">基本資料</Link>
        <Link to="/customer/dietary">飲食記錄</Link>
        <Link to="/customer/target">目標設定</Link>
        <Switch>
          <Route exact path="/customer/profile">
            <Profile profileData={profile} />
            {/* <button onClick={bingSaveHandler}>儲存</button> */}
          </Route>
          <Route path="/customer/dietary">
            <DietrayRecord />
          </Route>
          <Route exact path="/customer/target">
            <Target />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default Customer;
