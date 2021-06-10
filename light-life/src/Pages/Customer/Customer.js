import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useLocation,
  useHistory,
} from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import Swal from "sweetalert2";
import GetDietitiansData from "./FindDietitians/GetDietitinasData.js";
import ReserveList from "./Reverse/ReserveList.js";
import CustomerProfile from "../Components/CustomerProfile/EditCustomerProfile.js";
import DietrayRecord from "../Components/DietaryRecord/DietaryRecord.js";
import CustomerTarget from "./Target/CustomerTarget.js";
import Publish from "./Publish/Publish.js";
import MobileBottom from "../Components/MobileBottom.js";
import NotFound from "../NotFound/NotFound.js";
import style from "../../style/basic.module.scss";
import loadStyle from "../../style/home.module.scss";
import image from "../../style/image.module.scss";
import loading from "../../images/lightlife-straight.png";
import spinner from "../../images/loading.gif";
import logo from "../../images/lightlife-straight.png";
import noImage from "../../images/noimage.png";
import exit from "../../images/exit.png";

function Customer() {
  const [load, setLoad] = useState(loadStyle.loading);
  const [profile, setProfile] = useState({});
  const [dietitians, setDietitians] = useState(null);
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
  const [nav, setNav] = useState("");
  const keyword = useLocation().pathname;
  const path = keyword.split("/")[3];
  const [notFound, setNotFound] = useState(false);
  let history = useHistory();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User

        firebase
          .firestore()
          .collection("customers")
          .where("email", "==", user.email)
          .get()
          .then((docs) => {
            docs.forEach((doc) => {
              if (doc.data().id !== customerID) {
                history.push("/");
              }
            });
          });
      } else {
        history.push("/");
      }
    });

    firebase
      .firestore()
      .collection("customers")
      .get()
      .then((docs) => {
        const memberArray = [];
        docs.forEach((doc) => memberArray.push(doc.data().id));
        if (!memberArray.find((m) => m === customerID)) {
          setNotFound(true);
        }
      });
    if (
      path &&
      path !== "profile" &&
      path !== "dietary" &&
      path !== "target" &&
      path !== "publish" &&
      path !== "findDietitians" &&
      path !== "reserve-list"
    ) {
      setNotFound(true);
    }
  }, []);

  useEffect(() => {
    firebase
      .firestore()
      .collection("customers")
      .doc(`${customerID}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          if (doc.data().dietitian) {
            setDID(doc.data().dietitian);
          }
        }
        return doc.data();
      })
      .then((doc) => {
        if (doc) {
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
                const start = new Date(res[0].startDate).getTime();

                if (start <= today) {
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
                      if (start < today) {
                        firebase
                          .firestore()
                          .collection("pending")
                          .doc(res[0].id)
                          .delete()
                          .then(() => {
                            console.log("Document successfully deleted!");
                          })
                          .catch((error) => {
                            console.error("Error removing document: ", error);
                          });
                      }
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
        console.log(pending);
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
          if (startDate <= today && e.status === "0") {
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
    if (keyword.includes("profile")) {
      setNav({ profile: style["nav-active"] });
    } else if (keyword.includes("dietary")) {
      setNav({ dietary: style["nav-active"] });
    } else if (keyword.includes("target")) {
      setNav({ target: style["nav-active"] });
    } else if (keyword.includes("publish")) {
      setNav({ publish: style["nav-active"] });
    } else if (keyword.includes("findDietitian")) {
      setNav({ findDietitian: style["nav-active"] });
    } else if (keyword.includes("reserve")) {
      setNav({ reserve: style["nav-active"] });
    }
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
          } else if (dID && doc.data().id === dID) {
            setDName(doc.data().name);
          }
        });
        return users;
      })
      .then((users) => {
        firebase
          .firestore()
          .collection("reserve")
          .where("inviterID", "==", customerID)
          .get()
          .then((docs) => {
            const reserveArray = [];
            if (!docs.empty) {
              docs.forEach((doc) => {
                if (doc.data().status === "0") {
                  // || doc.data().status === "1"
                  reserveArray.push(doc.data());
                }
              });
              // users.forEach((u) => {
              //   if (!reserveArray.find((r) => r.dietitian === u.id)) {
              //     user.push(u);
              //   }
              // });
              // setDietitians(user);
              // } else {
              //   setDietitians(users);
              // }
            }
            return { reserveArray, users };
          })
          .then((res) => {
            const user = [];
            firebase
              .firestore()
              .collection("pending")
              .where("customer", "==", customerID)
              .get()
              .then((docs) => {
                if (!docs.empty) {
                  docs.forEach((doc) => {
                    res["reserveArray"].push(doc.data());
                  });

                  res["users"].forEach((u) => {
                    if (
                      !res["reserveArray"].find((r) => r.dietitian === u.id)
                    ) {
                      user.push(u);
                    }
                  });
                  setDietitians(user);
                } else {
                  res["users"].forEach((u) => {
                    if (
                      !res["reserveArray"].find((r) => r.dietitian === u.id)
                    ) {
                      user.push(u);
                    }
                  });
                  setDietitians(user);
                }
              });
          });
      });
  }, [reserve]);

  const activeHandler = (e) => {
    const { title } = e.target;
    if (title) {
      setNav({ [title]: style["nav-active"] });
    } else {
      setNav({});
    }
  };

  const logoutHandler = () => {
    Swal.fire({
      text: "確定登出嗎?",
      confirmButtonText: "確定",
      cancelButtonText: "取消",
      confirmButtonColor: "#1e4d4e",
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        firebase
          .auth()
          .signOut()
          .then(function () {
            // 登出後強制重整一次頁面
            window.location.href = "/";
          })
          .catch(function (error) {
            console.log(error.message);
          });
      }
    });
  };

  if (!notFound) {
    if (profile.id) {
      return (
        <>
          <MobileBottom />
          <main className={style["d-main"]}>
            <nav>
              <a href="/">
                <img src={logo} id={style["menu-logo"]} />
              </a>
              <div className={style["straight-nav"]}>
                <Link
                  title="profile"
                  className={`${style["nav-title"]} ${nav.profile || ""}`}
                  onClick={activeHandler}
                  to={`/customer/${profile.id}/profile`}
                >
                  <i class="fa fa-user" aria-hidden="true" title="profile"></i>
                  <div title="profile">會員資料</div>
                </Link>
                <Link
                  title="dietary"
                  className={`${style["nav-title"]} ${nav.dietary || ""}`}
                  onClick={activeHandler}
                  to={`/customer/${profile.id}/dietary`}
                >
                  <i
                    class="fa fa-cutlery"
                    aria-hidden="true"
                    title="dietary"
                  ></i>
                  <div title="dietary">飲食記錄</div>
                </Link>
                <Link
                  title="target"
                  className={`${style["nav-title"]} ${nav.target || ""}`}
                  onClick={activeHandler}
                  to={`/customer/${profile.id}/target`}
                >
                  <i
                    class="fa fa-bullseye"
                    aria-hidden="true"
                    title="target"
                  ></i>
                  <div title="target">目標設定</div>
                </Link>

                <Link
                  title="publish"
                  className={`${style["nav-title"]} ${nav.publish || ""}`}
                  onClick={activeHandler}
                  to={`/customer/${customerID}/publish`}
                >
                  <i
                    class="fa fa-file-text-o"
                    aria-hidden="true"
                    title="publish"
                  ></i>
                  <div title="publish">刊登需求</div>
                </Link>

                <Link
                  title="findDietitian"
                  className={`${style["nav-title"]} ${nav.findDietitian || ""}`}
                  onClick={activeHandler}
                  to={`/customer/${customerID}/findDietitians`}
                >
                  <i
                    class="fa fa-search"
                    aria-hidden="true"
                    title="findDietitian"
                  ></i>
                  <div title="findDietitian">找營養師</div>
                </Link>

                <Link
                  title="reserve"
                  className={`${style["nav-title"]} ${nav.reserve || ""}`}
                  onClick={activeHandler}
                  to={`/customer/${customerID}/reserve-list`}
                >
                  <i
                    class="fa fa-list-alt"
                    aria-hidden="true"
                    title="reserve"
                  ></i>
                  <div title="reserve">預約清單</div>
                </Link>
                <Link
                  className={style["nav-title"]}
                  onClick={activeHandler}
                  to={`/customer/${customerID}/`}
                >
                  <i class="fa fa-arrow-left" aria-hidden="true"></i>
                  <div>會員主頁</div>
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
                    <div>您的營養師：{dName} 營養師</div>
                  ) : (
                    <div>目前沒有使用服務喔</div>
                  )}
                </div>
              </div>

              <div className={style["mobile-list"]}>
                <Link
                  title="profile"
                  className={style["nav-title"]}
                  to={`/customer/${profile.id}/profile`}
                  onClick={activeHandler}
                >
                  <i class="fa fa-user" aria-hidden="true" title="profile"></i>
                  <div title="profile">會員資料</div>
                </Link>
                <Link
                  title="dietary"
                  className={style["nav-title"]}
                  to={`/customer/${profile.id}/dietary`}
                  onClick={activeHandler}
                >
                  <i
                    class="fa fa-cutlery"
                    aria-hidden="true"
                    title="dietary"
                  ></i>
                  <div title="dietary">飲食記錄</div>
                </Link>
                <Link
                  title="target"
                  className={style["nav-title"]}
                  to={`/customer/${profile.id}/target`}
                  onClick={activeHandler}
                >
                  <i
                    class="fa fa-bullseye"
                    aria-hidden="true"
                    title="target"
                  ></i>
                  <div title="target">目標設定</div>
                </Link>

                <Link
                  title="publish"
                  className={style["nav-title"]}
                  to={`/customer/${customerID}/publish`}
                  onClick={activeHandler}
                >
                  <i
                    class="fa fa-file-text-o"
                    aria-hidden="true"
                    title="publish"
                  ></i>
                  <div title="publish">刊登需求</div>
                </Link>

                <Link
                  title="findDietitian"
                  className={style["nav-title"]}
                  onClick={activeHandler}
                  to={`/customer/${customerID}/findDietitians`}
                >
                  <i
                    class="fa fa-search"
                    aria-hidden="true"
                    title="findDietitian"
                  ></i>
                  <div title="findDietitian">找營養師</div>
                </Link>

                <Link
                  title="reserve"
                  className={style["nav-title"]}
                  onClick={activeHandler}
                  to={`/customer/${customerID}/reserve-list`}
                >
                  <i
                    class="fa fa-list-alt"
                    aria-hidden="true"
                    title="reserve"
                  ></i>
                  <div title="reserve">預約清單</div>
                </Link>
              </div>
            </div>

            <Switch>
              <Route exact path="/customer/:cID">
                <div className={style.indexMessage}>
                  <div className={style.title}>服務使用情形</div>
                  <div className={style.content}>
                    <div className={style.serving}>
                      <div className={style.subtitle}>進行中服務</div>
                      <div>
                        <div className={style.each}>
                          {serviceDate ? (
                            serviceDate.startDate ? (
                              <>
                                <div>{dName} 營養師</div>
                                <div>
                                  <div>
                                    開始日期：
                                    {serviceDate ? serviceDate.startDate : ""}
                                  </div>
                                  <div>
                                    結束日期：
                                    {serviceDate ? serviceDate.endDate : ""}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>暫無</>
                            )
                          ) : (
                            <div className={image.spinner}>
                              <img src={spinner} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className={style.pendingService}>
                      <div className={style.subtitle}>尚未進行的服務</div>
                      <div>
                        {pending ? (
                          pending.length > 0 ? (
                            pending.map((p) => (
                              <div className={style.each}>
                                <div>{p.dietitianName} 營養師</div>
                                <div>
                                  <div>開始日期：{p.startDate}</div>
                                  <div>結束日期：{p.endDate}</div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className={style.each}>暫無</div>
                          )
                        ) : (
                          <div className={image.spinner}>
                            <img src={spinner} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Route>
              <Route exact path="/customer/:cID/profile">
                <CustomerProfile profile={profile} setProfile={setProfile} />
              </Route>
              <Route exact path="/customer/:cID/dietary">
                <DietrayRecord />
              </Route>
              <Route exact path="/customer/:cID/target">
                <CustomerTarget />
              </Route>
              <Route exact path="/customer/:cID/publish">
                <Publish reserve={reserve} />
              </Route>
              <Route exact path="/customer/:cID/findDietitians">
                <GetDietitiansData
                  props={dietitians}
                  setReserve={setReserve}
                  profile={profile}
                  reserve={reserve}
                />
              </Route>
              <Route exact path="/customer/:cID/reserve-list">
                <ReserveList reserve={reserve} setReserve={setReserve} />
              </Route>
            </Switch>
          </main>
        </>
      );
    } else {
      return (
        <main className="d-main">
          <div className={load}>
            <img src={loading} />
          </div>
        </main>
      );
    }
  } else {
    return (
      <Switch>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    );
  }
}

export default Customer;
