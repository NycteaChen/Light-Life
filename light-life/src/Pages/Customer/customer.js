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

  return (
    <>
      <h2>我的營養師：</h2>
      <Router>
        <h3>OOO，您好！</h3>
        <Link to="/customer/id=9iYZMkuFdZRK9vxgt1zc/profile">基本資料</Link>
        <Link to="/customer/id=9iYZMkuFdZRK9vxgt1zc/dietary">飲食記錄</Link>
        <Link to="/customer/id=9iYZMkuFdZRK9vxgt1zc/target">目標設定</Link>
        <Switch>
          <Route exact path="/customer/id=9iYZMkuFdZRK9vxgt1zc/profile">
            <Profile profileData={profile} />
          </Route>
          <Route path="/customer/id=9iYZMkuFdZRK9vxgt1zc/dietary">
            <DietrayRecord />
          </Route>
          <Route exact path="/customer/id=9iYZMkuFdZRK9vxgt1zc/target">
            <Target />
          </Route>
        </Switch>
      </Router>
    </>
  );
}

export default Customer;
