import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import InvitedList from "./Invite/InvitedList.js";
import MyCustomers from "./MyCustomer/MyCustomers.js";
import firebase from "firebase/app";
import "firebase/firestore";

function Dietitian() {
  const [users, setUsers] = useState([]);
  const [isInvited, setIsInvited] = useState(false);
  const [invitedList, setInvitedList] = useState([]);
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
  }, []);

  const checkInvitedList = () => {
    setIsInvited(true);
  };

  const clostInvitedList = () => {
    setIsInvited(false);
  };
  if (users.length > 0) {
    return (
      <>
        <div>編輯會員資料</div>
        <MyCustomers customers={users} />
        <div>找客戶</div>
        <div onClick={checkInvitedList}>誰找我</div>
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
      </>
    );
  } else {
    return <div>loading</div>;
  }
}

export default Dietitian;
