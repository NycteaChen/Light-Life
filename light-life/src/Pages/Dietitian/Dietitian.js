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
import {
  authState,
  getDietitiansData,
  getTheSameDietitian,
  getMyCustomerData,
  updateCustomerData,
  updateDietitianData,
  getPendingData,
  getCustomerData,
  deletePublication,
  setMyCustomerData,
  getCustomerReserve,
  getDietitianData,
  logout,
} from "../../utils/Firebase.js";
import {
  getToday,
  dateToISOString,
  transDateToTime,
} from "../../utils/DatePicker.js";
import Swal from "sweetalert2";
import InvitedList from "./Invite/InvitedList.js";
import DietitianProfile from "../Dietitian/DietitianProfile/DietitianProfile.js";
import CustomerProfile from "../Components/CustomerProfile/CustomerProfile.js";
import DietrayRecord from "../Components/DietaryRecord/DietaryRecord.js";
import DietitianTarget from "../Dietitian/Target/DietitianTarget.js";
import GetPublication from "../Dietitian/FindCustomers/GetPublication.js";
import MobileBottom from "../Components/MobileBottom.js";
import NotFound from "../NotFound/NotFound.js";
import basic from "../../style/basic.module.scss";
import style from "../../style/customerData.module.scss";
import customer from "../../style/customerProfile.module.scss";
import image from "../../style/image.module.scss";
import logo from "../../images/lightlife-straight.png";
import noImage from "../../images/noimage.png";
import exit from "../../images/exit.png";
import loadStyle from "../../style/home.module.scss";
import loading from "../../images/lightlife-straight.png";
import spinner from "../../images/loading.gif";

function Dietitian() {
  const [load, setLoad] = useState(loadStyle.loading);
  const [users, setUsers] = useState(null);
  const [invitedList, setInvitedList] = useState([]);
  const [profile, setProfile] = useState({});
  const [selectedID, setSelectedID] = useState("");
  const [display, setDisplay] = useState("none");
  const [date, setDate] = useState({});
  const { dID } = useParams();
  const path = useLocation().pathname.split("/")[3];
  const customerID = useLocation().pathname.split("/")[4];
  const customerDataPath = useLocation().pathname.split("/")[5];
  const customerPath = useLocation().pathname.includes("customer");
  const today = new Date(+new Date() + 8 * 3600 * 1000).getTime();
  const todayTime = transDateToTime(dateToISOString(getToday()));
  const [pending, setPending] = useState(null);
  const props = {};
  const [nav, setNav] = useState("");
  const [active, setActive] = useState("");
  const keyword = useLocation().pathname;
  const [notFound, setNotFound] = useState(false);
  let history = useHistory();

  useEffect(() => {
    authState("dietitians", history, dID, setNotFound);
    getDietitiansData().then((docs) => {
      const memberArray = [];
      docs.forEach((doc) => memberArray.push(doc.data().id));
      if (!memberArray.find((m) => m === dID)) {
        setNotFound(true);
      }
    });
  }, []); //eslint-disable-line

  useEffect(() => {
    getTheSameDietitian(dID).then((docs) => {
      const usersArray = [];
      if (!docs.empty) {
        docs.forEach((doc) => {
          usersArray.push(doc.data());
        });
        usersArray.forEach((i, index) => {
          getMyCustomerData(dID, i.id).then((res) => {
            if (res.exists) {
              const endDate = transDateToTime(res.data().endDate);
              if (endDate < todayTime) {
                updateCustomerData(i.id, {
                  dietitian: firebase.firestore.FieldValue.delete(),
                });
                usersArray.splice(index, 1);
              } else {
                usersArray[index].endDate = res.data().endDate;
                usersArray[index].startDate = res.data().startDate;
                setUsers(usersArray);
              }
            }
          });
        });
      } else {
        setUsers(usersArray);
        if (customerPath) {
          history.push(`/dietitian/${dID}`);
        }
      }
      getPendingData("dietitian", dID).then((docs) => {
        const pendingArray = [];
        if (!docs.empty) {
          docs.forEach((doc) => {
            pendingArray.push(doc.data());
          });
          const promises = [];
          pendingArray.forEach((p) => {
            const promise = getCustomerData(p.customer).then((res) => {
              return {
                ...p,
                customerName: res.data().name,
                customerGender: res.data().gender,
              };
            });
            promises.push(promise);
          });
          Promise.all(promises).then((res) => {
            res.sort((a, b) => {
              const dateA = transDateToTime(a.startDatenew);
              const dateB = transDateToTime(b.startDatenew);
              if (dateA < dateB) {
                return -1;
              } else if (dateA > dateB) {
                return 1;
              } else {
                return 0;
              }
            });
            const newPendingArray = [];
            res.forEach((r) => {
              const start = transDateToTime(r.startDate);
              if (r.startDate === dateToISOString(getToday())) {
                updateCustomerData(r.customer, { dietitian: r.dietitian }).then(
                  () => {
                    getCustomerData(r.customer)
                      .then((doc) => {
                        if (
                          usersArray.length > 0 &&
                          !usersArray.find((i) => i.id === doc.data().id)
                        ) {
                          setUsers([...usersArray, doc.data()]);
                        } else if (usersArray.length > 0) {
                          setUsers([...usersArray]);
                        } else {
                          setUsers([doc.data()]);
                        }
                      })
                      .then(() => {
                        deletePublication(r.id).catch((error) => {
                          console.error("Error removing document: ", error);
                        });
                      });
                  }
                );
                setMyCustomerData(r.dietitian, r.customer, {
                  startDate: r.startDate,
                  endDate: r.endDate,
                });
              } else if (start < todayTime) {
                console.log("晚");
              } else {
                newPendingArray.push(r);
              }
            });
            setPending(newPendingArray);
          });
        } else {
          setPending([]);
        }
      });
    });

    getCustomerReserve("dietitian", dID).then((docs) => {
      const invitedArray = [];
      docs.forEach((doc) => {
        const startDate = transDateToTime(doc.data().reserveStartDate);
        if (startDate > today && doc.data().status === "0") {
          invitedArray.push(doc.data());
        }
      });
      setInvitedList(invitedArray);
    });
    getDietitianData(dID)
      .then((res) => setProfile(res.data()))
      .then(() =>
        setTimeout(() => {
          setLoad(style.loadFadeout);
        }, 500)
      );

    if (customerPath && customerID) {
      if (customerID !== "") {
        getMyCustomerData(dID, customerID).then((doc) => {
          if (doc.exists) {
            setDate({
              start: doc.data().startDate,
              end: doc.data().endDate,
            });
          } else {
            setNotFound(true);
          }
        });
      }
    } else if (customerPath && !customerID) {
      setNotFound(true);
    } else if (
      path &&
      path !== "customer" &&
      path !== "inviteMe" &&
      path !== "profile" &&
      path !== "findCustomers"
    ) {
      setNotFound(true);
    }

    if (
      customerDataPath &&
      customerDataPath !== "profile" &&
      customerDataPath !== "dietary" &&
      customerDataPath !== "target"
    ) {
      setNotFound(true);
    }

    if (keyword.includes("customer") || keyword.includes("customers")) {
      setNav({ customerList: basic["nav-active"] });
    } else if (keyword.includes("profile")) {
      setNav({ profile: basic["nav-active"] });
    } else if (keyword.includes("findCustomer")) {
      setNav({ findCustomer: basic["nav-active"] });
    } else if (keyword.includes("inviteMe")) {
      setNav({ whoInvite: basic["nav-active"] });
    }

    if (keyword.includes("customer") && keyword.includes("profile")) {
      setActive({ cProfile: style.active });
    } else if (keyword.includes("customer") && keyword.includes("dietary")) {
      setActive({ cDietary: style.active });
    } else if (keyword.includes("customer") && keyword.includes("target")) {
      setActive({ cTarget: style.active });
    }
  }, []); //eslint-disable-line

  useEffect(() => {
    if (profile && profile.email && !profile.name) {
      setProfile({ ...profile, isServing: false });
      updateDietitianData(dID, { isServing: false });
    }
  }, [profile && profile.name]); //eslint-disable-line

  const getSelectedCustomer = (e) => {
    setActive({});
    setSelectedID(e.target.className);
    getMyCustomerData(dID, e.target.className).then((doc) => {
      setDate({
        start: doc.data().startDate,
        end: doc.data().endDate,
      });
    });
  };

  const bindListHandler = (e) => {
    if (e.target.className.includes("list")) {
      setDisplay("block");
    } else {
      setDisplay("none");
    }
    const { title } = e.target;
    const { id } = e.target;
    if (title) {
      setNav({ [title]: basic["nav-active"] });
    } else if (id) {
      setActive({ [id]: style.active });
    } else {
      if (!title) {
        setNav({});
      } else if (!id) {
        setActive({});
      }
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
        logout();
      }
    });
  };
  const changeServiceStatusHandler = () => {
    if (
      profile.name &&
      profile.education &&
      profile.education["degree"] &&
      profile.education["school"] &&
      profile.education["department"] &&
      profile.gender
    ) {
      setProfile({ ...profile, isServing: !profile.isServing });
      updateDietitianData(dID, { isServing: !profile.isServing });
    } else {
      Swal.fire({
        text: "個人資料填寫完整才能開放服務喔",
        confirmButtonText: "確定",
        confirmButtonColor: "#1e4d4e",
      });
    }
  };
  const showMobileCustomerList = async () => {
    const userObject = {};
    users.forEach((e) => {
      userObject[e["name"]] = e.name;
    });
    if (users.length > 0) {
      await Swal.fire({
        cancelButtonText: "取消",
        confirmButtonText: "確定",
        confirmButtonColor: "#1e4d4e",
        input: "select",
        inputOptions: userObject,
        inputPlaceholder: "選取客戶",
        showCancelButton: true,
        inputValidator: (value) => {
          return new Promise((resolve) => {
            if (value) {
              const selectedUser = users.find((u) => u.name === value);
              setDate({
                start: selectedUser.startDate,
                end: selectedUser.endDate,
              });
              history.push(
                `/dietitian/${selectedUser.dietitian}/customer/${selectedUser.id}/`
              );
              resolve();
            } else {
              resolve("沒有選取");
            }
          });
        },
      });
    } else {
      Swal.fire({
        text: "目前沒有客戶喔",
        cancelButtonText: "取消",
        confirmButtonText: "確定",
        confirmButtonColor: "#1e4d4e",
        showCancelButton: true,
      });
    }
  };

  if (!notFound) {
    if (profile && profile.email) {
      return (
        <>
          <MobileBottom />
          <main className={basic["d-main"]}>
            <nav>
              <a href="/">
                <img src={logo} id={basic["menu-logo"]} alt="logo" />
              </a>
              <div className={basic["straight-nav"]}>
                <Link
                  title="profile"
                  className={`${basic["nav-title"]} ${nav.profile || ""}`}
                  to={`/dietitian/${dID}/profile`}
                  onClick={bindListHandler}
                >
                  <i
                    className="fa fa-user"
                    aria-hidden="true"
                    title="profile"
                  ></i>
                  <div title="profile">會員資料</div>
                </Link>
                <ul>
                  {users && users.length > 0 ? (
                    <div
                      title="customerList"
                      className={`${basic["nav-title"]} list ${
                        nav.customerList || ""
                      }`}
                      onClick={bindListHandler}
                    >
                      <i
                        className="fa fa-users list"
                        aria-hidden="true"
                        title="customerList"
                      ></i>
                      <div
                        title="customerList"
                        className="list"
                        onClick={bindListHandler}
                      >
                        客戶清單
                      </div>
                    </div>
                  ) : (
                    <div className={basic["nav-unactive"]}>
                      <i
                        className="fa fa-users list"
                        aria-hidden="true"
                        title="customerList"
                      ></i>
                      <div title="customerList" className="list">
                        客戶清單
                      </div>
                    </div>
                  )}

                  <div
                    className={`${basic.customerList} list `}
                    style={{ display: display }}
                  >
                    {users && users.length > 0
                      ? users.map((c) => (
                          <Link
                            to={`/dietitian/${c.dietitian}/customer/${c.id}/`}
                            key={c.id}
                            className={c.id}
                            onClick={getSelectedCustomer}
                          >
                            <li className={c.id}>{c.name} </li>
                          </Link>
                        ))
                      : ""}
                  </div>
                </ul>

                <Link
                  title="findCustomer"
                  className={`${basic["nav-title"]} ${nav.findCustomer || ""}`}
                  onClick={bindListHandler}
                  to={`/dietitian/${dID}/findCustomers`}
                >
                  <i
                    className="fa fa-search"
                    aria-hidden="true"
                    title="findCustomer"
                  ></i>
                  <div title="findCustomer">找客戶</div>
                </Link>

                <Link
                  title="whoInvite"
                  className={`${basic["nav-title"]} ${nav.whoInvite || ""}`}
                  onClick={bindListHandler}
                  to={`/dietitian/${dID}/inviteMe`}
                >
                  <i
                    className="fa fa-envira"
                    aria-hidden="true"
                    title="whoInvite"
                  ></i>
                  <div title="whoInvite">誰找我</div>
                </Link>
                <Link
                  className={basic["nav-title"]}
                  onClick={bindListHandler}
                  to={`/dietitian/${dID}`}
                >
                  <i className="fa fa-arrow-left" aria-hidden="true"></i>
                  <div>會員主頁</div>
                </Link>
                <span onClick={logoutHandler}>
                  <img src={exit} alt="logout" id={basic.logout} />
                </span>
                <div className={basic.copyright}>&copy;2021 Light Life</div>
              </div>
            </nav>

            <div className={basic.profile}>
              <img src={profile.image || noImage} alt="profileImage" />
              <div className={basic.welcome}>
                <div>{profile.name || ""}，您好</div>
                <div className={basic["service-status"]}>
                  <div>服務狀態：{profile.isServing ? "公開" : "私人"}</div>
                  <div>
                    <input
                      type="checkbox"
                      id="service"
                      className={`${basic.toggle} ${basic["toggle-round"]}`}
                      checked={profile.isServing ? true : false}
                      onChange={changeServiceStatusHandler}
                    />
                    <label className={basic.label} htmlFor="service"></label>
                  </div>
                </div>
              </div>
              <div className={basic["d-List"]}>
                <Link
                  title="profile"
                  className={`${basic["nav-title"]}`}
                  to={`/dietitian/${dID}/profile`}
                  onClick={bindListHandler}
                >
                  <i
                    className="fa fa-user"
                    aria-hidden="true"
                    title="profile"
                  ></i>
                  <div title="profile">會員資料</div>
                </Link>
                <Link
                  title="findCustomer"
                  className={basic["nav-title"]}
                  to={`/dietitian/${dID}/findCustomers`}
                  onClick={bindListHandler}
                >
                  <i
                    className="fa fa-search"
                    aria-hidden="true"
                    title="findCustomer"
                  ></i>
                  <div title="findCustomer">找客戶</div>
                </Link>

                <span
                  className={`${basic["nav-title"]}`}
                  title="customerList"
                  onClick={showMobileCustomerList}
                >
                  <i
                    className="fa fa-users"
                    aria-hidden="true"
                    title="customerList"
                  ></i>
                  <div title="customerList">客戶清單</div>
                </span>

                <Link
                  className={basic["nav-title"]}
                  to={`/dietitian/${dID}/inviteMe`}
                  onClick={bindListHandler}
                  title="whoInvite"
                >
                  <i
                    className="fa fa-envira"
                    aria-hidden="true"
                    title="whoInvite"
                  ></i>
                  <div title="whoInvite">誰找我</div>
                </Link>
              </div>
            </div>

            <Switch>
              <Route exact path="/dietitian/:dID">
                <div className={basic.indexMessage}>
                  <div className={basic.title}>客戶服務情況</div>
                  <div className={basic.content}>
                    <div className={basic.serving}>
                      <div className={basic.subtitle}>
                        目前服務人數：
                        <span>
                          {users && users.length > 0 ? users.length : 0}
                        </span>
                        人
                      </div>
                      <div>
                        {users ? (
                          users.length > 0 ? (
                            users.map((u) => (
                              <div className={basic.each} key={u.id}>
                                <div>
                                  {u.name} {u.gender === "男" ? "先生" : "小姐"}
                                </div>
                                <div>結束日期：{u.endDate}</div>
                              </div>
                            ))
                          ) : (
                            <div className={basic.each}>暫無</div>
                          )
                        ) : (
                          <div className={image.spinner}>
                            <img src={spinner} alt="spinner" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={basic.pendingService}>
                      <div className={basic.subtitle}>尚未進行的服務</div>
                      <div>
                        {pending ? (
                          pending.length > 0 ? (
                            pending.map((p) => (
                              <div className={basic.each} key={p.customerName}>
                                <div>
                                  {p.customerName}{" "}
                                  {p.customerGender === "男" ? "先生" : "小姐"}
                                </div>
                                <div>
                                  <div>開始日期：{p.startDate}</div>
                                  <div>結束日期：{p.endDate}</div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className={basic.each}>暫無</div>
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
              <Route exact path={`/dietitian/:dID/profile`}>
                <DietitianProfile profile={profile} setProfile={setProfile} />
              </Route>

              <Route exact path={`/dietitian/:dID/findCustomers`}>
                <GetPublication />
              </Route>
              <Route exact path={`/dietitian/:dID/inviteMe`}>
                <div>
                  <InvitedList
                    invitedList={invitedList}
                    setInvitedList={setInvitedList}
                    pending={pending}
                    setPending={setPending}
                  />
                </div>
              </Route>
            </Switch>

            <Switch>
              <Route
                path={`/dietitian/${dID}/customer/${
                  customerID ? customerID : selectedID
                }`}
              >
                <div className={style["customer-data"]}>
                  <div className={style["customer-dataSelect"]}>
                    <Link
                      id="cProfile"
                      className={`${style["link-select"]} ${
                        active.cProfile || ""
                      }`}
                      to={`/dietitian/${dID}/customer/${
                        customerID || selectedID
                      }/profile`}
                      onClick={bindListHandler}
                    >
                      <i
                        className="fa fa-address-book-o"
                        aria-hidden="true"
                      ></i>
                      {users && users.length > 0 && customerID
                        ? users.filter((e) => e.id === customerID)[0].name
                        : ""}
                    </Link>
                    <Link
                      id="cDietary"
                      className={`${style["link-select"]} ${
                        active.cDietary || ""
                      }`}
                      to={`/dietitian/${dID}/customer/${
                        customerID || selectedID
                      }/dietary`}
                      onClick={bindListHandler}
                    >
                      <i
                        className="fa fa-cutlery"
                        aria-hidden="true"
                        title="dietary"
                      ></i>
                      飲食記錄
                    </Link>
                    <Link
                      id="cTarget"
                      className={`${style["link-select"]} ${
                        active.cTarget || ""
                      }`}
                      to={`/dietitian/${dID}/customer/${
                        customerID || selectedID
                      }/target`}
                      onClick={bindListHandler}
                    >
                      <i
                        className="fa fa-bullseye"
                        aria-hidden="true"
                        title="target"
                      ></i>
                      目標設定
                    </Link>
                  </div>
                </div>
                <Switch>
                  <Route exact path={`/dietitian/:dID/customer/:cID/profile`}>
                    <>
                      <div className={style["service-time"]}>
                        <div>
                          服務時間<span>：</span>
                        </div>
                        <div>
                          {date.start || ""}~{date.end || ""}
                        </div>
                      </div>
                      <div
                        id="customer-profile"
                        className={customer["customer-profile"]}
                      >
                        <div className={customer["profile-data"]}>
                          <CustomerProfile props={props} />
                        </div>
                      </div>
                    </>
                  </Route>
                  <Route exact path={`/dietitian/:dID/customer/:cID/dietary`}>
                    <DietrayRecord />
                  </Route>
                  <Route exact path={`/dietitian/:dID/customer/:cID/target`}>
                    <DietitianTarget />
                  </Route>
                </Switch>
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

export default Dietitian;
