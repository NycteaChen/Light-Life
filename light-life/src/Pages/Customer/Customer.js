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
import CustomerProfile from "../Components/CustomerProfile/EditCustomerProfile.js";
import DietrayRecord from "../Components/DietaryRecord/DietaryRecord.js";
import CustomerTarget from "./Target/CustomerTarget.js";
import Publish from "./Publish/Publish.js";
import firebase from "firebase/app";
import "firebase/firestore";
import style from "../../style/basic.module.scss";
import logo from "../../images/lightlife-straight.png";
import noImage from "../../images/noimage.png";
import exit from "../../images/exit.png";

function Customer() {
  const [profile, setProfile] = useState({});
  const [dietitians, setDietitians] = useState([]);
  const [reserve, setReserve] = useState([]);
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

  if (profile.id) {
    return (
      <main className={style["d-main"]}>
        <nav>
          <a href="/">
            <img src={logo} id={style["menu-logo"]} />
          </a>
          <div className={style["straight-nav"]}>
            <Link
              className={style["nav-title"]}
              to={`/customer/${profile.id}/profile`}
            >
              <div>基本資料</div>
            </Link>
            <Link
              className={style["nav-title"]}
              to={`/customer/${profile.id}/dietary`}
            >
              <div>飲食記錄</div>
            </Link>
            <Link
              className={style["nav-title"]}
              to={`/customer/${profile.id}/target`}
            >
              <div>目標設定</div>
            </Link>

            <Link
              className={style["nav-title"]}
              to={`/customer/${customerID}/publish`}
            >
              <div>刊登需求</div>
            </Link>

            <Link
              className={style["nav-title"]}
              to={`/customer/${customerID}/findDietitian`}
            >
              <div>找營養師</div>
            </Link>

            <Link
              className={style["nav-title"]}
              to={`/customer/${customerID}/reserve-list`}
            >
              <div>預約清單</div>
            </Link>
            <Link
              className={style["nav-title"]}
              to={`/customer/${customerID}/`}
            >
              <div>返回會員首頁</div>
            </Link>
            <a href="/">
              <img src={exit} alt="logout" id={style.logout} />
            </a>
            <div className={style["copyright"]}>&copy;2021 Light Life</div>
          </div>
        </nav>

        <div className={style.profile}>
          <img src={profile ? profile.image : noImage} />
          <div className={style.welcome}>
            <div>
              <h4>{profile.name}，您好！</h4>
            </div>
            <div className={style["service-status"]}>
              {profile.dietitian !== "" ? (
                <h5>我的營養師：{dName} 營養師</h5>
              ) : (
                <h5>目前沒有使用服務喔</h5>
              )}
            </div>
          </div>

          <div className={style["selectList"]}>
            <Link
              className={style["nav-title"]}
              to={`/customer/${profile.id}/profile`}
            >
              <div>基本資料</div>
            </Link>
            <Link
              className={style["nav-title"]}
              to={`/customer/${profile.id}/dietary`}
            >
              <div>飲食記錄</div>
            </Link>
            <Link
              className={style["nav-title"]}
              to={`/customer/${profile.id}/target`}
            >
              <div>目標設定</div>
            </Link>

            <Link
              className={style["nav-title"]}
              to={`/customer/${customerID}/publish`}
            >
              <div>刊登需求</div>
            </Link>

            <Link
              className={style["nav-title"]}
              to={`/customer/${customerID}/findDietitian`}
            >
              <div>找營養師</div>
            </Link>

            <Link
              className={style["nav-title"]}
              to={`/customer/${customerID}/reserve-list`}
            >
              <div>預約清單</div>
            </Link>
          </div>
        </div>

        <Switch>
          <Route exact path="/customer/:cID">
            <div className={style.indexWelcome}>{profile.name}，歡迎回來！</div>
          </Route>
          <Route exact path="/customer/:cID/profile">
            <CustomerProfile props={profile} />
          </Route>
          <Route exact path="/customer/:cID/dietary">
            <DietrayRecord />
          </Route>
          <Route exact path="/customer/:cID/target">
            <CustomerTarget />
          </Route>
          <Route exact path="/customer/:cID/publish">
            <Publish />
          </Route>
          <Route exact path="/customer/:cID/findDietitian">
            <GetDietitiansData
              props={dietitians}
              setReserve={setReserve}
              profile={profile}
            />
          </Route>
          <Route exact path="/customer/:cID/reserve-list">
            <ReserveList reserve={reserve} setReserve={setReserve} />
          </Route>
        </Switch>
      </main>
    );
  } else {
    return (
      <main className={style["d-main"]}>
        <div style={{ marginLeft: "360px" }}>loading</div>
      </main>
    );
  }
}

export default Customer;
