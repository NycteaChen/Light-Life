import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import InvitedList from "./Invite/InvitedList.js";
import DietitianProfile from "../Dietitian/DietitianProfile/DietitianProfile.js";
import firebase from "firebase/app";
import logo from "../../images/lightlife-straight.svg";
import noImage from "../../images/noimage.png";
import exit from "../../images/exit.png";
import "firebase/firestore";
import "../../style/basic.scss";
import "../../style/customerData.scss";
import Profile from "../Components/CustomerProfile/CusotmerProfile.js";
import DietrayRecord from "../Components/DietaryRecord/DietaryRecord.js";
import DietitianTarget from "../Dietitian/Target/DietitianTarget.js";

function Dietitian() {
  const [users, setUsers] = useState([]);
  const [invitedList, setInvitedList] = useState([]);
  const [profile, setProfile] = useState({});
  const [selectedID, setSelectedID] = useState("");
  const [display, setDisplay] = useState("none");
  const dietitianID = useParams().dID;
  const input = {};
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
    firebase
      .firestore()
      .collection("reserve")
      .get()
      .then((docs) => {
        const invitedArray = [];
        docs.forEach((doc) => {
          if (doc.data().dietitian === dietitianID) {
            invitedArray.push(doc.data());
          }
        });
        setInvitedList(invitedArray);
      });
    firebase
      .firestore()
      .collection("dietitians")
      .doc(dietitianID)
      .get()
      .then((res) => setProfile(res.data()));
  }, []);

  const getSelectedCustomer = (e) => {
    setSelectedID(e.target.className);
  };

  const bindListHandler = (e) => {
    if (e.target.className.includes("list")) {
      setDisplay("block");
    } else {
      setDisplay("none");
    }
  };

  if (users.length > 0) {
    return (
      <main className="d-main">
        <nav>
          <a href="/">
            <img src={logo} id="menu-logo" />
          </a>
          <div className="mobile-nav">
            <div className="nav-title" onClick={bindListHandler}>
              <Link to={`/dietitian/${dietitianID}/profile`}>編輯會員資料</Link>
            </div>
            <ul>
              <div
                className="nav-title list"
                style={{ cursor: "pointer" }}
                onClick={bindListHandler}
              >
                客戶清單
              </div>
              <div className="customerList list" style={{ display: display }}>
                {users.map((c, index) => (
                  <li
                    key={index}
                    className={c.id}
                    onClick={getSelectedCustomer}
                  >
                    <Link
                      to={`/dietitian/${c.dietitian}/customer/${c.id}`}
                      className={c.id}
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </div>
            </ul>
            <div className="nav-title" onClick={bindListHandler}>
              找客戶
            </div>
            <div className="nav-title" onClick={bindListHandler}>
              <Link to={`/dietitian/${dietitianID}/inviteMe`}>誰找我 </Link>
            </div>

            <Link
              className="nav-title"
              onClick={bindListHandler}
              to={`/dietitian/${dietitianID}`}
            >
              返回會員主頁
            </Link>
            <a href="/">
              <img src={exit} alt="logout" id="logout" />
            </a>
          </div>
        </nav>
        <div className="profile">
          <img src={profile ? profile.image : noImage} />
          <div className="welcome">
            <div>
              <span>{profile ? profile.name : ""}</span>，您好
            </div>
            <div className="service-status">
              <div>服務開放中</div>
              <label>
                <input type="checkbox" />
              </label>
            </div>
          </div>
          <div className="selectList">
            <div>
              <Link
                to={`/dietitian/${dietitianID}/profile`}
                onClick={bindListHandler}
              >
                編輯會員資料
              </Link>
            </div>
            <div onClick={bindListHandler}>找客戶</div>
            <div className="list">
              <Link
                className="list"
                to={`/dietitian/${dietitianID}/customers`}
                onClick={bindListHandler}
              >
                客戶清單
              </Link>
            </div>
            <div onClick={bindListHandler}>
              <Link to={`/dietitian/${dietitianID}/inviteMe`}>誰找我 </Link>
            </div>
          </div>
        </div>

        <Switch>
          <Route exact path="/dietitian/:dID">
            <div className="indexWelcome">{profile.name}營養師，歡迎回來！</div>
          </Route>
          <Route exact path={`/dietitian/:dID/profile`}>
            <DietitianProfile profile={profile} />
          </Route>
          <Route exact path={`/dietitian/:dID/customers`}>
            <div className="mobileCustomerList" style={{ display: display }}>
              {users.map((c, index) => (
                <li key={index} className={c.id} onClick={getSelectedCustomer}>
                  <Link
                    to={`/dietitian/${c.dietitian}/customer/${c.id}`}
                    className={c.id}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </div>
          </Route>
          <Route exact path={`/dietitian/:dID/inviteMe`}>
            <div>
              <InvitedList
                invitedList={invitedList}
                setInvitedList={setInvitedList}
              />
            </div>
          </Route>
        </Switch>

        {/* <div style={{ marginLeft: "250px", overflow: "auto" }}> */}

        <Switch>
          <Route
            exact
            path={`/dietitian/${dietitianID}/customer/${selectedID}`}
          >
            <Router>
              <div className="customer-data">
                <div className="customer-name">
                  <span>陳安妮</span>
                </div>
                <div className="customer-dataSelect">
                  <Link
                    className="link-select"
                    to={`/dietitian/${dietitianID}/customer/${selectedID}/profile`}
                  >
                    基本資料
                  </Link>
                  <Link
                    className="link-select"
                    to={`/dietitian/${dietitianID}/customer/${selectedID}/dietary`}
                  >
                    飲食記錄
                  </Link>
                  <Link
                    className="link-select"
                    to={`/dietitian/${dietitianID}/customer/${selectedID}/target`}
                  >
                    目標設定
                  </Link>
                </div>
              </div>
              <Switch>
                <Route exact path={`/dietitian/:dID/customer/:cID/profile`}>
                  <Profile props={users[0]} input={input} />
                </Route>
                <Route path={`/dietitian/:dID/customer/:cID/dietary`}>
                  <DietrayRecord />
                </Route>
                <Route exact path={`/dietitian/:dID/customer/:cID/target`}>
                  <DietitianTarget />
                </Route>
              </Switch>
            </Router>
          </Route>
        </Switch>
      </main>
    );
  } else {
    return <div>loading</div>;
  }
}

export default Dietitian;
