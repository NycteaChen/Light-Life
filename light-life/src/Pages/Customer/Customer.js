import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import GetDietitiansData from "./FindDietitians/GetDietitinasData.js";
import ReserveList from "./Reverse/ReserveList.js";
import Profile from "../Components/CustomerProfile/EditCustomerProfile.js";
import DietrayRecord from "../Components/DietaryRecord/DietaryRecord.js";
import CustomerTarget from "./Target/CustomerTarget.js";
import firebase from "firebase/app";
import "firebase/firestore";

function Customer() {
  const [profile, setProfile] = useState({});
  const [dietitians, setDietitians] = useState([]);
  const [reserve, setReserve] = useState([]);
  const [find, setFind] = useState(false);
  const [index, setIndex] = useState();
  const customerID = useParams().cID;
  const [dName, setDName] = useState();
  let dID;
  useEffect(() => {
    firebase
      .firestore()
      .collection("customers")
      .doc(`${customerID}`)
      .get()
      .then((doc) => {
        dID = doc.data().dietitian;
        setProfile(doc.data());
      });
    firebase
      .firestore()
      .collection("dietitians")
      .get()
      .then((snapshot) => {
        const users = [];
        snapshot.forEach((doc) => {
          if (doc.data().id !== dID) {
            users.push(doc.data());
          } else {
            setDName(doc.data().name);
          }
        });
        return users;
      })
      .then((res) => {
        setDietitians(res);
      });
    firebase
      .firestore()
      .collection("reserve")
      .get()
      .then((docs) => {
        const reserveArray = [];
        docs.forEach((doc) => {
          if (doc.data().inviterID === customerID) {
            reserveArray.push(doc.data());
          }
        });
        setReserve(reserveArray);
      });
  }, []);

  const bindOpenHandler = (e) => {
    setIndex(e.target.id);
    setFind(true);
  };
  const bindCloseHandler = () => {
    setFind(false);
  };
  if (profile.dietitian) {
    return (
      <>
        <>
          {profile.dietitian !== "" ? (
            <h2>我的營養師：{dName} 營養師</h2>
          ) : (
            <h2>目前沒有使用服務喔</h2>
          )}
        </>
        <Router>
          <h3>{profile.name}，您好！</h3>
          <>
            <Link to={`/customer/${profile.id}/profile`}>基本資料</Link>
            <Link to={`/customer/${profile.id}/dietary`}>飲食記錄</Link>
            <Link to={`/customer/${profile.id}/target`}>目標設定</Link>
          </>
          <Switch>
            <Route exact path="/customer/:cID/profile">
              <Profile props={profile} />
            </Route>
            <Route path="/customer/:cID/dietary">
              <DietrayRecord />
            </Route>
            <Route exact path="/customer/:cID/target">
              <CustomerTarget />
            </Route>
          </Switch>
        </Router>
        <div onClick={bindOpenHandler} id="0">
          刊登需求
        </div>
        {find && index === "0" ? (
          <>
            <div onClick={bindCloseHandler}>X</div>
          </>
        ) : (
          ""
        )}
        <div onClick={bindOpenHandler} id="1">
          找營養師
        </div>
        {find && index === "1" ? (
          <>
            <div onClick={bindCloseHandler}>X</div>
            <GetDietitiansData
              props={dietitians}
              setReserve={setReserve}
              profile={profile}
            />
          </>
        ) : (
          ""
        )}
        <div onClick={bindOpenHandler} id="2">
          預約清單
        </div>
        {find && index === "2" ? (
          <>
            <div onClick={bindCloseHandler}>X</div>
            <ReserveList reserve={reserve} setReserve={setReserve} />
          </>
        ) : (
          ""
        )}
      </>
    );
  } else {
    return <div>loading</div>;
  }
}

export default Customer;
