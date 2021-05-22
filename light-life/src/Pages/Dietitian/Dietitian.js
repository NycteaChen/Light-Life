import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InvitedList from "./Invite/InvitedList.js";
import MyCustomers from "./MyCustomer/MyCustomers.js";
import firebase from "firebase/app";
import logo from "../../images/lightlife-straight.svg";
import noImage from "../../images/noimage.png";
import exit from "../../images/exit.png";
import "firebase/firestore";
import "../../style/basic.scss";

function Dietitian() {
  const [users, setUsers] = useState([]);
  const [isInvited, setIsInvited] = useState(false);
  const [invitedList, setInvitedList] = useState([]);
  const [profile, setProfile] = useState({});
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
  if (users.length > 0) {
    return (
      <main>
        <nav>
          <a href="/">
            <img src={logo} id="menu-logo" />
          </a>
          <div className="mobile-nav">
            <div className="nav-title">編輯會員資料</div>
            <MyCustomers customers={users} />
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
            <a className="nav-title" href="/dietitian/cJUCoL1hZz36cVgf7WRz">
              返回會員主頁
            </a>
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
            <div>編輯會員資料</div>
            <div>找客戶</div>
            <div>客戶清單</div>
            <div>誰找我</div>
          </div>
        </div>
      </main>
    );
  } else {
    return <div>loading</div>;
  }
}

export default Dietitian;
