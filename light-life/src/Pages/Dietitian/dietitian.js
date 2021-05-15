import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Profile from "../cusotmerProfile";
import DietrayRecord from "../dietaryRecord.js";
import Target from "../target.js";
import firebase from "firebase/app";
import "firebase/firestore";

function Dietitian() {
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
      <Router>
        <Link to="/dietitian/id=cJUCoL1hZz36cVgf7WRz/customer/id=9iYZMkuFdZRK9vxgt1zc">
          客戶1
        </Link>
        <Link to="/dietitian/id=cJUCoL1hZz36cVgf7WRz/customer2">客戶2</Link>
        <Switch>
          <Route path="/dietitian/id=cJUCoL1hZz36cVgf7WRz/customer/id=9iYZMkuFdZRK9vxgt1zc">
            <Router>
              <Link to="/dietitian/id=cJUCoL1hZz36cVgf7WRz/customer/id=9iYZMkuFdZRK9vxgt1zc/profile">
                基本資料
              </Link>
              <Link to="/dietitian/id=cJUCoL1hZz36cVgf7WRz/customer/id=9iYZMkuFdZRK9vxgt1zc/dietary">
                飲食記錄
              </Link>
              <Link to="/dietitian/id=cJUCoL1hZz36cVgf7WRz/customer/id=9iYZMkuFdZRK9vxgt1zc/target">
                目標設定
              </Link>
              <Switch>
                <Route
                  exact
                  path="/dietitian/id=cJUCoL1hZz36cVgf7WRz/customer/id=9iYZMkuFdZRK9vxgt1zc/profile"
                >
                  <Profile profileData={profile} />
                </Route>
                <Route path="/dietitian/id=cJUCoL1hZz36cVgf7WRz/customer/id=9iYZMkuFdZRK9vxgt1zc/dietary">
                  <DietrayRecord />
                </Route>
                <Route
                  exact
                  path="/dietitian/id=cJUCoL1hZz36cVgf7WRz/customer/id=9iYZMkuFdZRK9vxgt1zc/target"
                >
                  <Target />
                </Route>
              </Switch>
            </Router>
          </Route>
        </Switch>
      </Router>
      <div>找客戶</div>
      {/* <div>
        <div>找客戶</div>
        <div>邀請中</div>
      </div> */}
    </>
  );
}

export default Dietitian;
