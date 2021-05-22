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
import Profile from "../Components/CustomerProfile/CusotmerProfile.js";
import DietrayRecord from "../Components/DietaryRecord/DietaryRecord.js";
import DietitianTarget from "../Dietitian/Target/DietitianTarget.js";

function Dietitian() {
  const [users, setUsers] = useState([]);
  const [isInvited, setIsInvited] = useState(false);
  const [invitedList, setInvitedList] = useState([]);
  const [profile, setProfile] = useState({});
  const [selectedID, setSelectedID] = useState("");
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

  const checkInvitedList = () => {
    setIsInvited(true);
  };

  const clostInvitedList = () => {
    setIsInvited(false);
  };

  const getSelectedCustomer = (e) => {
    setSelectedID(e.target.className);
  };

  if (users.length > 0) {
    return (
      <main className="d-main">
        <nav>
          <a href="/">
            <img src={logo} id="menu-logo" />
          </a>
          <div className="mobile-nav">
            <div className="nav-title">
              <Link to={`/dietitian/${dietitianID}/profile`}>編輯會員資料</Link>
            </div>
            <ul>
              <div className="nav-title">客戶清單</div>
              <div className="customerList" style={{ display: "block" }}>
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
            <div className="nav-title">找客戶</div>
            <div className="nav-title" onClick={checkInvitedList}>
              誰找我
            </div>
            {isInvited ? (
              <div>
                <div onClick={clostInvitedList}>X</div>
                <InvitedList
                  invitedList={invitedList}
                  setInvitedList={setInvitedList}
                />
              </div>
            ) : (
              ""
            )}
            <Link className="nav-title" to={`/dietitian/${dietitianID}`}>
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
              <Link to={`/dietitian/${dietitianID}/profile`}>編輯會員資料</Link>
            </div>
            <div>找客戶</div>
            <div>客戶清單</div>
            <div>誰找我</div>
          </div>
        </div>
        <Switch>
          <Route exact path={`/dietitian/:dID/profile`}>
            <DietitianProfile profile={profile} />
          </Route>
        </Switch>
        <div style={{ marginLeft: "250px", overflow: "auto" }}>
          <Switch>
            <Route
              exact
              path={`/dietitian/${dietitianID}/customer/${selectedID}`}
            >
              <Router>
                <Link
                  to={`/dietitian/${dietitianID}/customer/${selectedID}/profile`}
                >
                  基本資料
                </Link>
                <Link
                  to={`/dietitian/${dietitianID}/customer/${selectedID}/dietary`}
                >
                  飲食記錄
                </Link>
                <Link
                  to={`/dietitian/${dietitianID}/customer/${selectedID}/target`}
                >
                  目標設定
                </Link>
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
        </div>
      </main>
    );
  } else {
    return <div>loading</div>;
  }
}

export default Dietitian;
