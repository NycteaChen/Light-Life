import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import Profile from "../cusotmerProfile.js";
import DietrayRecord from "../dietaryRecord.js";
import Target from "../target.js";
import firebase from "firebase/app";
import "firebase/firestore";

function ReserveList({ reserve, setReserve }) {
  const [isChecked, setIsChecked] = useState(false);
  const [index, setIndex] = useState();
  const checkReserveMessage = (e) => {
    setIndex(e.target.id);
    setIsChecked(true);
  };

  const removeReserveHandler = (e) => {
    const docID = reserve[parseInt(e.target.id)].id;
    setReserve([...reserve.filter((r, index) => index != e.target.id)]);
    console.log(docID);
    firebase
      .firestore()
      .collection("reserve")
      .doc(docID)
      .delete()
      .then(() => {
        console.log("delete");
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  console.log(reserve);

  if (reserve.id || reserve.length > 0) {
    return (
      <>
        {reserve.map((r, idx) => (
          <div key={idx}>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <img
                src={r.image}
                alt="dietitian"
                style={{ width: "200px", height: "200px", borderRadius: "50%" }}
              />
              <div>
                <div>
                  <span>{r.dietitianName}</span>營養師
                </div>
                <div>
                  <div>預約時間</div>
                  <div>
                    <div>{r.reverseStartDate}</div>
                    <div>至</div>
                    <div>{r.reverseEndDate}</div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <button onClick={checkReserveMessage} id={idx}>
                查看訊息
              </button>
              <button onClick={removeReserveHandler} id={idx}>
                取消預約
              </button>
              {isChecked && index == idx ? <div>test</div> : ""}
            </div>
          </div>
        ))}
      </>
    );
  } else {
    return <div>目前沒有預約喔</div>;
  }
}

function ReserveForm({ setIsReserve, props, setReserve }) {
  const params = useParams();
  const today = new Date(+new Date() + 8 * 3600 * 1000);
  const initStartDate = today.toISOString().substr(0, 10);
  const [input, setInput] = useState({});
  const db = firebase.firestore();

  const getInputHandler = (e) => {
    const { name } = e.target;
    setInput({
      ...input,
      [name]: e.target.value,
      addDate: initStartDate,
      dietitian: props.id,
      dietitianName: props.name,
      image: props.image,
      inviter: params.cID,
      status: "0",
    });
  };

  const sendReverseHandler = () => {
    db.collection("reserve")
      .add(input)
      .then((docRef) => {
        db.collection("reserve").doc(docRef.id).update("id", docRef.id);
      })
      .then(() => {
        db.collection("reserve")
          .get()
          .then((docs) => {
            const reserveArray = [];
            docs.forEach((doc) => {
              if (doc.data().inviter === params.cID) {
                reserveArray.push(doc.data());
              }
            });
            setReserve(reserveArray);
          });
      })
      .catch((error) => ("Error:", error));
  };

  const bindCancelHandler = () => {
    setIsReserve(false);
  };

  return (
    <div>
      <label>
        開始
        <input type="date" name="reverseStartDate" onChange={getInputHandler} />
      </label>
      <label>
        結束
        <input type="date" name="reverseEndDate" onChange={getInputHandler} />
      </label>

      <div>
        <label>邀請訊息</label>
        <div>
          <input
            type="textarea"
            name="reverseMessage"
            onChange={getInputHandler}
          />
        </div>
      </div>
      <div>
        <button onClick={sendReverseHandler}>發送</button>
        <button onClick={bindCancelHandler}>取消</button>
      </div>
    </div>
  );
}

function DietitianData({ props, setIsCheck, setReserve }) {
  const [isReserve, setIsReserve] = useState(false); //false
  const bindReserveHandler = () => {
    setIsReserve(true);
  };
  const bindCloseHandler = () => {
    setIsCheck(false);
  };
  return (
    <>
      <div>
        <div onClick={bindCloseHandler}>X</div>
        <div>
          <span>{props.name}</span> 營養師
        </div>
        <img
          src={props.image}
          alt="dietitian"
          style={{ width: "200px", height: "200px", borderRadius: "50%" }}
        />
        <div>
          性別：<span>{props.gender}</span>
        </div>
        <div>
          最高學歷：
          <span>
            {props.education.school}
            {props.education.department} {props.education.degree}
          </span>
        </div>
        <div>
          專長：
          <span>
            {props.skills.map((s, index) => (
              <span key={index}>
                {s}
                {props.skills[index + 1] ? "、" : ""}
              </span>
            ))}
          </span>
        </div>
        <div>
          <div>其他</div>
          <div>{props.other}</div>
        </div>
        <button onClick={bindReserveHandler}>發送預約邀請</button>
        {isReserve ? (
          <ReserveForm
            setIsReserve={setIsReserve}
            props={props}
            setReserve={setReserve}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

function GetDietitians({ props, setReserve }) {
  const [isCheck, setIsCheck] = useState(false); //false
  const [checkIndex, setCheckIndex] = useState("");
  const bindCheckHandler = (e) => {
    setCheckIndex(e.target.id);
    setIsCheck(true);
  };

  return (
    <>
      {props.map((d, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "20px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <img
              src={props ? d.image : ""}
              alt="dietitian"
              style={{ width: "200px", height: "200px", borderRadius: "50%" }}
            ></img>
            <div>
              <div>
                <span>{d.name}</span>營養師
              </div>
              <button onClick={bindCheckHandler} id={index}>
                查看詳情
              </button>
            </div>
          </div>
          {isCheck && index == checkIndex ? (
            <>
              <DietitianData
                setReserve={setReserve}
                props={d}
                setIsCheck={setIsCheck}
                style={{ marginLeft: "20px" }}
              />
            </>
          ) : (
            ""
          )}
        </div>
      ))}
    </>
  );
}

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
          if (doc.data().inviter === customerID) {
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

  console.log(profile.dietitian);

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
        <h3>OOO，您好！</h3>
        <Link to="/customer/9iYZMkuFdZRK9vxgt1zc/profile">基本資料</Link>
        <Link to="/customer/9iYZMkuFdZRK9vxgt1zc/dietary">飲食記錄</Link>
        <Link to="/customer/9iYZMkuFdZRK9vxgt1zc/target">目標設定</Link>
        <Switch>
          <Route exact path="/customer/:cID/profile">
            <Profile profileData={profile} />
          </Route>
          <Route path="/customer/:cID/dietary">
            <DietrayRecord />
          </Route>
          <Route exact path="/customer/:cID/target">
            <Target />
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
          <GetDietitians props={dietitians} setReserve={setReserve} />
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
}

export default Customer;
