import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import Profile from "../cusotmerProfile";
import DietrayRecord from "../dietaryRecord.js";
import Target from "../target.js";
import firebase from "firebase/app";
import "firebase/firestore";

function CustomerApi({ customerData }) {
  // const [target, setTarget] = useState({});
  // useEffect(() => {
  //   firebase
  //     .firestore()
  //     .collection("customers")
  //     .get()
  //     .then((snapshot) => {
  //       const users = [];
  //       snapshot.forEach((doc) => {
  //         if (doc.data().dietitian === "cJUCoL1hZz36cVgf7WRz") {
  //           users.push(doc.data());
  //         }
  //         console.log(users);
  //       });
  //       return users[0];
  //     })
  //     .then((res) => {
  //       setProfile(res);
  //     });
  // }, []);

  // useEffect(()=>{
  //   firebase
  //   .firestore()
  //   .collection("customers")
  //   .
  // }, [])

  return (
    <Router>
      <Link
        to={`/dietitian/${customerData.dietitian}/customer/${customerData.id}/profile`}
      >
        基本資料
      </Link>
      <Link
        to={`/dietitian/${customerData.dietitian}/customer/${customerData.id}/dietary`}
      >
        飲食記錄
      </Link>
      <Link
        to={`/dietitian/${customerData.dietitian}/customer/${customerData.id}/target`}
      >
        目標設定
      </Link>
      <Switch>
        <Route exact path={`/dietitian/:dID/customer/:cID/profile`}>
          <Profile profileData={customerData} />
        </Route>
        <Route path={`/dietitian/:dID/customer/:cID/dietary`}>
          <DietrayRecord props={customerData} />
        </Route>
        <Route exact path={`/dietitian/:dID/customer/:cID/target`}>
          <Target />
        </Route>
      </Switch>
    </Router>
  );
}

function Customers({ customers }) {
  return (
    <Router>
      {customers.map((c) => (
        <div key={c.id}>
          <Link to={`/dietitian/${c.dietitian}/customer/${c.id}`}>
            {c.name}
          </Link>
          <Switch>
            <Route path={`/dietitian/${c.dietitian}/customer/${c.id}`}>
              <CustomerApi customerData={c} />
            </Route>
          </Switch>
        </div>
      ))}
    </Router>
  );
}

function Dietitian() {
  const [users, setUsers] = useState([]);
  const dietitianID = useParams().dID;
  useEffect(() => {
    firebase
      .firestore()
      .collection("customers")
      .get()
      .then((snapshot) => {
        const usersArray = [];
        snapshot.forEach((doc) => {
          if (doc.data().dietitian === dietitianID) {
            usersArray.push(doc.data());
          }
        });
        setUsers(usersArray);
      });
  }, []);
  return (
    <>
      <Customers customers={users} />
      <div>找客戶</div>
      {/* <div>
        <div>找客戶</div>
        <div>邀請中</div>
      </div> */}
    </>
  );
}

export default Dietitian;
