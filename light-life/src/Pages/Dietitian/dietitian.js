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

function ShowInviterData({ props, idx, invitedList, setInvitedList }) {
  const [inviterData, setInviterData] = useState({});
  useEffect(() => {
    firebase
      .firestore()
      .collection("customers")
      .doc(props.inviterID)
      .get()
      .then((res) => {
        console.log(res.data());
        setInviterData(res.data());
      });
  }, []);
  console.log(props);
  console.log(invitedList);
  const inviteButtonHandler = (e) => {
    if (e.target.id === "accept") {
      console.log(e.target.id);
    }
    if (e.target.id === "decline") {
      console.log(e.target.id);
      // firebase.firestore().collection("reserve")
    }
  };

  return (
    <div>
      <div>
        <h2>
          預約服務時間：
          <span>
            {props.reverseStartDate}~{props.reverseEndDate}
          </span>
        </h2>
        <h2>客戶資料</h2>
        <img
          src={inviterData.image}
          alt="customer"
          style={{ width: "200px", height: "200px", borderRadius: "50%" }}
        />
        <div>
          <div>姓名</div>
          <div>{inviterData.name}</div>
        </div>
        <div>
          <div>性別</div>
          <div>{inviterData.gender}</div>
        </div>
        <div>
          <div>年齡</div>
          <div>
            <span>{inviterData.age}</span> 歲
          </div>
        </div>
        <div>
          <div>身高</div>
          <div>
            <span>{inviterData.height}</span> cm
          </div>
        </div>
        <div>
          <div>體重</div>
          <div>
            <span>{inviterData.weight}</span> kg
          </div>
        </div>
        <div>
          <div>教育程度</div>
          <div>
            <span>{inviterData.education}</span>
          </div>
        </div>
        <div>
          <div>職業</div>
          <div>
            <span>{inviterData.career}</span>
          </div>
        </div>
        <div>
          <div>其他</div>
          <div>
            <span>{inviterData.other}</span>
          </div>
        </div>
        <div>
          <div>預約訊息</div>
          <div>{props.reverseMessage}</div>
        </div>
      </div>
      <div>
        <button onClick={inviteButtonHandler} id="accept">
          接受
        </button>
        <button onClick={inviteButtonHandler} id="decline">
          婉拒
        </button>
      </div>
    </div>
  );
}

function InvitedList({ invitedList, setInvitedList }) {
  const [isChecked, setIsChecked] = useState(false);
  const [buttonIndex, setButtonIndex] = useState();
  const checkInviter = (e) => {
    setButtonIndex(e.target.id);
    setIsChecked(true);
  };

  console.log(invitedList);
  return (
    <div>
      <h3>
        有 <span>{invitedList.length}</span> 位客人預約您的服務
      </h3>
      {invitedList.map((i, index) => (
        <div key={index}>
          <div>
            <span>
              {i.inviterName} {i.inviterGender === "男" ? "先生" : "小姐"}
            </span>
            指定您的服務
          </div>
          <button onClick={checkInviter} id={index}>
            查看詳情
          </button>
          {isChecked && buttonIndex == index ? (
            <div>
              <ShowInviterData
                props={i}
                idx={buttonIndex}
                invitedList={invitedList}
                setInvitedList={setInvitedList}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      ))}
    </div>
  );
}

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
        <Customers customers={users} />
        <div>找客戶</div>
        {/* <div>
        <div>找客戶</div>
        <div>邀請中</div>
      </div> */}
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
