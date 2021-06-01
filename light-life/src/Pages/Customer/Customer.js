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
  const [dName, setDName] = useState("");
  const [serviceDate, setServiceDate] = useState(null);
  const [pending, setPending] = useState(null);
  const getToday = new Date(+new Date() + 8 * 3600 * 1000)
    .toISOString()
    .substr(0, 10);
  const today = new Date(getToday).getTime();
  const [dID, setDID] = useState("");
  useEffect(() => {
    firebase
      .firestore()
      .collection("customers")
      .doc(`${customerID}`)
      .get()
      .then((doc) => {
        if (doc.data().dietitian) {
          setDID(doc.data().dietitian);
        }
        return doc.data();
      })
      .then((doc) => {
        if (doc.dietitian) {
          firebase
            .firestore()
            .collection("dietitians")
            .doc(doc.dietitian)
            .collection("customers")
            .doc(customerID)
            .get()
            .then((res) => {
              if (res) {
                const end = new Date(res.data().endDate).getTime();
                if (end < today) {
                  setServiceDate({});
                  setDName("");
                  setProfile({ ...doc, dietitian: "" });
                  firebase
                    .firestore()
                    .collection("customers")
                    .doc(`${customerID}`)
                    .update({
                      dietitian: firebase.firestore.FieldValue.delete(),
                    });
                } else {
                  setServiceDate({
                    startDate: res.data().startDate,
                    endDate: res.data().endDate,
                  });
                  setProfile(doc);
                }
              } else {
                setServiceDate({});
                setProfile(doc);
              }
            });
        } else {
          setServiceDate({});
          setProfile(doc);
        }
        firebase
          .firestore()
          .collection("pending")
          .where("customer", "==", customerID)
          .get()
          .then((docs) => {
            const pendingArray = [];
            if (!docs.empty) {
              docs.forEach((doc) => {
                pendingArray.push(doc.data());
              });
              const promises = [];
              pendingArray.forEach((p) => {
                const promise = firebase
                  .firestore()
                  .collection("dietitians")
                  .doc(p.dietitian)
                  .get()
                  .then((res) => {
                    return {
                      ...p,
                      dietitianName: res.data().name,
                    };
                  });
                promises.push(promise);
              });
              Promise.all(promises).then((res) => {
                res.sort((a, b) => {
                  const dateA = new Date(a.startDate).getTime();
                  const dateB = new Date(b.startDate).getTime();
                  if (dateA < dateB) {
                    return -1;
                  } else if (dateA > dateB) {
                    return 1;
                  } else {
                    return 0;
                  }
                });
                if (res[0].startDate === getToday) {
                  setProfile({ ...doc, dietitian: res[0].dietitian });
                  firebase
                    .firestore()
                    .collection("customers")
                    .doc(`${customerID}`)
                    .update({ ...doc, dietitian: res[0].dietitian });
                  firebase
                    .firestore()
                    .collection("dietitians")
                    .doc(res[0].dietitian)
                    .collection("customers")
                    .doc(`${customerID}`)
                    .set({
                      startDate: res[0].startDate,
                      endDate: res[0].endDate,
                    })
                    .then(() => {
                      setServiceDate({
                        startDate: res[0].startDate,
                        endDate: res[0].endDate,
                      });
                      setDName(res[0].dietitianName);
                    })
                    .then(() => {
                      res.shift();
                      setPending(res);
                    });
                } else {
                  setPending(res);
                }
              });
            } else {
              setPending([]);
            }
          });

        //刪除成功的刊登或預約???
        // .then(() => {
        //   firebase
        //     .firestore()
        //     .collection("publish")
        //     .where("id", "==", customerID)
        //     .where("status", "==", "1")
        //     .where("startDate", "==", getToday)
        //     .get()
        //     .then((res) => {
        //       let docID;
        //       res.forEach((i) => {
        //         console.log(i.data());
        //         docID = i.data().publishID;
        //       });
        //       return docID;
        //     })
        //     .then((res) => {
        //       if (res) {
        //         console.log(res);
        //         firebase.firestore().collection("publish").doc(res).delete();
        //       }
        //     });

        //   firebase
        //     .firestore()
        //     .collection("reserve")
        //     .where("inviterID", "==", customerID)
        //     .where("status", "==", "1")
        //     .where("reserveStartDate", "==", getToday)
        //     .get()
        //     .then((res) => {
        //       let docID;
        //       res.forEach((i) => {
        //         console.log(i.data());
        //         docID = i.data().reserveID;
        //       });
        //       return docID;
        //     })
        //     .then((res) => {
        //       if (res) {
        //         console.log(res);
        //         firebase.firestore().collection("publish").doc(res).delete();
        //       }
        //     });
        // });
      });

    firebase
      .firestore()
      .collection("reserve")
      .where("inviterID", "==", customerID)
      .get()
      .then((docs) => {
        const reserveArray = [];
        docs.forEach((doc) => {
          reserveArray.push(doc.data());
        });
        reserveArray.forEach((e) => {
          const startDate = new Date(e.reserveStartDate).getTime();
          if (startDate <= today) {
            e.status = "3";
            firebase
              .firestore()
              .collection("reserve")
              .doc(e.reserveID)
              .update(e);
          }
        });
        setReserve(reserveArray);
      });
  }, []);

  useEffect(() => {
    firebase
      .firestore()
      .collection("dietitians")
      .get()
      .then((snapshot) => {
        const users = [];
        snapshot.forEach((doc) => {
          if (dID && doc.data().id !== dID && doc.data().isServing) {
            users.push(doc.data());
          } else if (!dID && doc.data().isServing) {
            users.push(doc.data());
          }
          // else if (doc.data().isServing) {
          //   setDName(doc.data().name);
          // }
        });

        firebase
          .firestore()
          .collection("reserve")
          .where("inviterID", "==", customerID)
          .get()
          .then((docs) => {
            if (!docs.empty) {
              const reserveArray = [];
              docs.forEach((doc) => {
                reserveArray.push(doc.data());
              });
              let user;
              reserveArray.forEach((r) => {
                user = users.filter(
                  (u) =>
                    (u.id === r.dietitian &&
                      (r.status !== "1") & (r.status !== "0")) ||
                    u.id !== r.dietitian
                );
              });

              setDietitians(user);
            } else {
              setDietitians(users);
            }
          });

        // return users;
      });
    // .then((res) => {
    //   setDietitians(res);
    // });
  }, [reserve]);

  const logoutHandler = () => {
    firebase
      .auth()
      .signOut()
      .then(function () {
        alert("已登出");
        // 登出後強制重整一次頁面
        window.location.href = "/";
      })
      .catch(function (error) {
        console.log(error.message);
      });
  };

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
              to={`/customer/${customerID}/findDietitians`}
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
            <a onClick={logoutHandler}>
              <img src={exit} alt="logout" id={style.logout} />
            </a>
            <div className={style["copyright"]}>&copy;2021 Light Life</div>
          </div>
        </nav>

        <div className={style.profile}>
          <img src={profile ? profile.image : noImage} />
          <div className={style.welcome}>
            <div>{profile.name}，您好！</div>
            <div className={style["service-status"]}>
              {profile.dietitian ? (
                <div>我的營養師：{dName} 營養師</div>
              ) : (
                <div>目前沒有使用服務喔</div>
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
              to={`/customer/${customerID}/findDietitians`}
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
            <div className={style.indexMessage}>
              <div>{profile.name}，歡迎回來！</div>
              <div>
                <div>當前進行之服務時間</div>
                {serviceDate ? (
                  serviceDate.startDate ? (
                    <>
                      <div>
                        {serviceDate ? serviceDate.startDate : ""}~
                        {serviceDate ? serviceDate.endDate : ""}
                      </div>
                    </>
                  ) : (
                    <div>暫無</div>
                  )
                ) : (
                  <div>loading</div>
                )}
              </div>
              <div>
                <div>尚未進行的服務</div>
                {pending ? (
                  pending.length > 0 ? (
                    pending.map((p) => (
                      <div>
                        <div>
                          <div>{p.dietitianName} 營養師</div>
                          <div>
                            時間：{p.startDate}~{p.endDate}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>無</div>
                  )
                ) : (
                  <div>loading</div>
                )}
              </div>
            </div>
          </Route>
          <Route exact path="/customer/:cID/profile">
            <CustomerProfile />
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
          <Route exact path="/customer/:cID/findDietitians">
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
