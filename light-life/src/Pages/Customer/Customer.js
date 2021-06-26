import React, { useEffect, useState } from "react";
import {
  Switch,
  Route,
  Link,
  useParams,
  useLocation,
  useHistory,
} from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import { authState } from "../../utils/Firebase.js";
import {
  getCustomerData,
  getMyCustomerData,
  updateCustomerData,
  getDietitianData,
  getPendingData,
  setMyCustomerData,
  deletePending,
  getCustomerReserve,
  updateReserve,
  getDietitiansData,
  logout,
} from "../../utils/Firebase.js";
import {
  getToday,
  dateToISOString,
  transDateToTime,
} from "../../utils/DatePicker.js";
import Swal from "sweetalert2";
import GetDietitiansData from "./FindDietitians/GetDietitinasData.js";
import ReserveList from "./Reverse/ReserveList.js";
import EditCustomerProfile from "./EditCustomerProfile/EditCustomerProfile.js";
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
  const load = loadStyle.loading;
  const [profile, setProfile] = useState({});
  const [dietitians, setDietitians] = useState(null);
  const [reserve, setReserve] = useState([]);
  const { cID } = useParams();
  const [dName, setDName] = useState("");
  const [serviceDate, setServiceDate] = useState(null);
  const [pending, setPending] = useState(null);
  const today = transDateToTime(dateToISOString(getToday()));
  const [dID, setDID] = useState("");
  const [nav, setNav] = useState("");
  const keyword = useLocation().pathname;
  const path = keyword.split("/")[3];
  const [notFound, setNotFound] = useState(false);
  const navArray = [
    "profile",
    "dietary",
    "target",
    "publish",
    "findDietitian",
    "reserve",
  ];
  let history = useHistory();

  useEffect(() => {
    authState("customers", history, cID, setNotFound);

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
  }, []); //eslint-disable-line

  useEffect(() => {
    getCustomerData(cID)
      .then((doc) => {
        if (doc.exists) {
          if (doc.data().dietitian) {
            setDID(doc.data().dietitian);
          }
        }
        return doc.data();
      })
      .then((doc) => {
        if (doc && doc.dietitian) {
          getMyCustomerData(doc.dietitian, cID).then((res) => {
            if (res) {
              const end = new Date(res.data().endDate).getTime();
              if (end < today) {
                updateCustomerData(cID, {
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
        getPendingData("customer", cID).then((docs) => {
          const pendingArray = [];
          if (!docs.empty) {
            docs.forEach((doc) => {
              pendingArray.push(doc.data());
            });
            const promises = [];
            pendingArray.forEach((p) => {
              const promise = getDietitianData(p.dietitian).then((res) => {
                return {
                  ...p,
                  dietitianName: res.data().name,
                };
              });
              promises.push(promise);
            });
            Promise.all(promises).then((res) => {
              res.sort((a, b) => {
                const dateA = transDateToTime(a.startDate);
                const dateB = transDateToTime(b.startDate);

                if (dateA < dateB) {
                  return -1;
                } else if (dateA > dateB) {
                  return 1;
                } else {
                  return 0;
                }
              });
              const start = transDateToTime(res[0].startDate);
              if (start <= today) {
                setProfile({ ...doc, dietitian: res[0].dietitian });
                updateCustomerData(cID, {
                  ...doc,
                  dietitian: res[0].dietitian,
                });
                setMyCustomerData(res[0].dietitian, cID, {
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
                      deletePending(res[0].id).catch((error) => {
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
      });

    getCustomerReserve("inviterID", cID).then((docs) => {
      const reserveArray = [];
      docs.forEach((doc) => {
        reserveArray.push(doc.data());
      });
      reserveArray.forEach((e) => {
        const startDate = transDateToTime(e.reserveStartDate);
        if (startDate <= today && e.status === "0") {
          e.status = "3";
          updateReserve(e.reserveID, e);
        }
      });
      setReserve(reserveArray);
    });
    navArray.forEach((d) => {
      if (keyword.includes(d)) {
        setNav({ [d]: style["nav-active"] });
      }
    });
  }, []); //eslint-disable-line

  useEffect(() => {
    getDietitiansData()
      .then((docs) => {
        const users = [];
        docs.forEach((doc) => {
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
        getCustomerReserve("inviterID", cID)
          .then((docs) => {
            const reserveArray = [];
            if (!docs.empty) {
              docs.forEach((doc) => {
                if (doc.data().status === "0" || doc.data().status === "1") {
                  reserveArray.push(doc.data());
                }
              });
            }
            return { reserveArray, users };
          })
          .then((res) => {
            const user = [];
            getPendingData("customer", cID).then((docs) => {
              if (!docs.empty) {
                docs.forEach((doc) => {
                  res["reserveArray"].push(doc.data());
                });

                res["users"].forEach((u) => {
                  if (!res["reserveArray"].find((r) => r.dietitian === u.id)) {
                    user.push(u);
                  }
                });
                setDietitians(user);
              } else {
                res["users"].forEach((u) => {
                  if (!res["reserveArray"].find((r) => r.dietitian === u.id)) {
                    user.push(u);
                  }
                });
                setDietitians(user);
              }
            });
          });
      });
  }, [reserve]); //eslint-disable-line

  const activeHandler = (e) => {
    const { title } = e.target;
    if (title) {
      setNav({ [title]: style["nav-active"] });
    } else {
      setNav({});
    }
  };

  const logoutHandler = (e) => {
    Swal.fire({
      text: "確定登出嗎?",
      confirmButtonText: "確定",
      cancelButtonText: "取消",
      confirmButtonColor: "#1e4d4e",
      showCancelButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        logout();
      }
    });
  };

  const alertHandler = () => {
    Swal.fire({
      text: "有使用營養師服務才可以使用喔",
      confirmButtonText: "確定",
      confirmButtonColor: "#1e4d4e",
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
                <img src={logo} id={style["menu-logo"]} alt="logo" />
              </a>
              <div className={style["straight-nav"]}>
                <Link
                  title="profile"
                  className={`${style["nav-title"]} ${nav.profile || ""}`}
                  onClick={activeHandler}
                  to={`/customer/${profile.id}/profile`}
                >
                  <i
                    className="fa fa-user"
                    aria-hidden="true"
                    title="profile"
                  ></i>
                  <div title="profile">會員資料</div>
                </Link>
                {profile.dietitian ? (
                  <Link
                    title="dietary"
                    className={`${style["nav-title"]} ${nav.dietary || ""}`}
                    onClick={activeHandler}
                    to={`/customer/${profile.id}/dietary`}
                  >
                    <i
                      className="fa fa-cutlery"
                      aria-hidden="true"
                      title="dietary"
                    ></i>
                    <div title="dietary">飲食記錄</div>
                  </Link>
                ) : (
                  <span
                    className={style["nav-unactive"]}
                    onClick={alertHandler}
                  >
                    <i
                      className="fa fa-cutlery"
                      aria-hidden="true"
                      title="dietary"
                    ></i>
                    <div title="dietary">飲食記錄</div>
                  </span>
                )}
                <Link
                  title="target"
                  className={`${style["nav-title"]} ${nav.target || ""}`}
                  onClick={activeHandler}
                  to={`/customer/${profile.id}/target`}
                >
                  <i
                    className="fa fa-bullseye"
                    aria-hidden="true"
                    title="target"
                  ></i>
                  <div title="target">目標設定</div>
                </Link>

                <Link
                  title="publish"
                  className={`${style["nav-title"]} ${nav.publish || ""}`}
                  onClick={activeHandler}
                  to={`/customer/${cID}/publish`}
                >
                  <i
                    className="fa fa-file-text-o"
                    aria-hidden="true"
                    title="publish"
                  ></i>
                  <div title="publish">刊登需求</div>
                </Link>

                <Link
                  title="findDietitian"
                  className={`${style["nav-title"]} ${nav.findDietitian || ""}`}
                  onClick={activeHandler}
                  to={`/customer/${cID}/findDietitians`}
                >
                  <i
                    className="fa fa-search"
                    aria-hidden="true"
                    title="findDietitian"
                  ></i>
                  <div title="findDietitian">找營養師</div>
                </Link>

                <Link
                  title="reserve"
                  className={`${style["nav-title"]} ${nav.reserve || ""}`}
                  onClick={activeHandler}
                  to={`/customer/${cID}/reserve-list`}
                >
                  <i
                    className="fa fa-list-alt"
                    aria-hidden="true"
                    title="reserve"
                  ></i>
                  <div title="reserve">預約清單</div>
                </Link>
                <Link
                  className={style["nav-title"]}
                  onClick={activeHandler}
                  to={`/customer/${cID}/`}
                >
                  <i className="fa fa-arrow-left" aria-hidden="true"></i>
                  <div>會員主頁</div>
                </Link>
                <span onClick={logoutHandler}>
                  <img src={exit} alt="logout" id={style.logout} />
                </span>
                <div className={style["copyright"]}>&copy;2021 Light Life</div>
              </div>
            </nav>

            <div className={style.profile}>
              <img src={profile ? profile.image : noImage} alt="profile" />
              <div className={style.welcome}>
                <div>{profile.name}，您好！</div>
                <div className={style["service-status"]}>
                  {profile.dietitian ? (
                    <div>您的營養師：{dName} 營養師</div>
                  ) : (
                    <div>目前沒有使用營養師服務</div>
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
                  <i
                    className="fa fa-user"
                    aria-hidden="true"
                    title="profile"
                  ></i>
                  <div title="profile">會員資料</div>
                </Link>
                {profile.dietitian ? (
                  <Link
                    title="dietary"
                    className={style["nav-title"]}
                    to={`/customer/${profile.id}/dietary`}
                    onClick={activeHandler}
                  >
                    <i
                      className="fa fa-cutlery"
                      aria-hidden="true"
                      title="dietary"
                    ></i>
                    <div title="dietary">飲食記錄</div>
                  </Link>
                ) : (
                  <span
                    onClick={alertHandler}
                    className={`${style["nav-title"]} ${style["nav-unactive"]}`}
                  >
                    <i
                      className="fa fa-cutlery"
                      aria-hidden="true"
                      title="dietary"
                    ></i>
                    <div title="dietary">飲食記錄</div>
                  </span>
                )}
                <Link
                  title="target"
                  className={style["nav-title"]}
                  to={`/customer/${profile.id}/target`}
                  onClick={activeHandler}
                >
                  <i
                    className="fa fa-bullseye"
                    aria-hidden="true"
                    title="target"
                  ></i>
                  <div title="target">目標設定</div>
                </Link>

                <Link
                  title="publish"
                  className={style["nav-title"]}
                  to={`/customer/${cID}/publish`}
                  onClick={activeHandler}
                >
                  <i
                    className="fa fa-file-text-o"
                    aria-hidden="true"
                    title="publish"
                  ></i>
                  <div title="publish">刊登需求</div>
                </Link>

                <Link
                  title="findDietitian"
                  className={style["nav-title"]}
                  onClick={activeHandler}
                  to={`/customer/${cID}/findDietitians`}
                >
                  <i
                    className="fa fa-search"
                    aria-hidden="true"
                    title="findDietitian"
                  ></i>
                  <div title="findDietitian">找營養師</div>
                </Link>

                <Link
                  title="reserve"
                  className={style["nav-title"]}
                  onClick={activeHandler}
                  to={`/customer/${cID}/reserve-list`}
                >
                  <i
                    className="fa fa-list-alt"
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
                  <div className={style.title}>營養師服務使用狀態</div>
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
                                    {serviceDate.startDate}
                                  </div>
                                  <div>
                                    結束日期：
                                    {serviceDate.endDate}
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>暫無</>
                            )
                          ) : (
                            <div className={image.spinner}>
                              <img src={spinner} alt="spinner" />
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
                            pending.map((p, index) => (
                              <div className={style.each} key={index}>
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
                            <img src={spinner} alt="spinner" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Route>
              <Route exact path="/customer/:cID/profile">
                <EditCustomerProfile
                  profile={profile}
                  setProfile={setProfile}
                />
              </Route>
              <Route exact path="/customer/:cID/dietary">
                <DietrayRecord />
              </Route>
              <Route exact path="/customer/:cID/target">
                <CustomerTarget />
              </Route>
              <Route exact path="/customer/:cID/publish">
                <Publish
                  reserve={reserve}
                  pending={pending}
                  setPending={setPending}
                />
              </Route>
              <Route exact path="/customer/:cID/findDietitians">
                <GetDietitiansData
                  props={dietitians}
                  setReserve={setReserve}
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
            <img src={loading} alt="loading" />
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
