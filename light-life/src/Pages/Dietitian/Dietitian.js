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
import styled from "styled-components";
import spinner from "../../images/loading.gif";

function Dietitian() {
  const [load, setLoad] = useState(loadStyle.loading);
  const [users, setUsers] = useState(null);
  const [invitedList, setInvitedList] = useState([]);
  const [profile, setProfile] = useState({});
  const [selectedID, setSelectedID] = useState("");
  const [display, setDisplay] = useState("none");
  const [date, setDate] = useState({});
  const dietitianID = useParams().dID;
  const customerID = useLocation().pathname.split("/")[4];
  const customer = useLocation().pathname.includes("customer");
  const today = new Date(+new Date() + 8 * 3600 * 1000).getTime();
  const getToday = new Date(+new Date() + 8 * 3600 * 1000)
    .toISOString()
    .substr(0, 10);
  const todayTime = new Date(getToday).getTime();
  const [pending, setPending] = useState(null);
  const input = {};
  const props = {};
  const [nav, setNav] = useState("");
  const [active, setActive] = useState("");
  const keyword = useLocation().pathname;
  const [member, setMember] = useState([]);
  const [notFound, setNotFound] = useState(false);
  let history = useHistory();

  useEffect(() => {
    firebase
      .firestore()
      .collection("dietitians")
      .get()
      .then((docs) => {
        const memberArray = [];
        docs.forEach((doc) => memberArray.push(doc.data().id));
        if (!memberArray.find((m) => m === dietitianID)) {
          setNotFound(true);
        }
      });
  }, []);

  useEffect(() => {
    firebase
      .firestore()
      .collection("customers")
      .where("dietitian", "==", dietitianID)
      .get()
      .then((snapshot) => {
        const usersArray = [];
        if (!snapshot.empty) {
          snapshot.forEach((doc) => {
            usersArray.push(doc.data());
          });
          usersArray.forEach((i, index) => {
            firebase
              .firestore()
              .collection("dietitians")
              .doc(dietitianID)
              .collection("customers")
              .doc(i.id)
              .get()
              .then((res) => {
                if (res.exists) {
                  const endDate = new Date(res.data().endDate).getTime();
                  if (endDate < todayTime) {
                    firebase
                      .firestore()
                      .collection("customers")
                      .doc(i.id)
                      .update({
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
          if (customer) {
            history.push(`/dietitian/${dietitianID}`);
          }
        }

        firebase
          .firestore()
          .collection("pending")
          .where("dietitian", "==", dietitianID)
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
                  .collection("customers")
                  .doc(p.customer)
                  .get()
                  .then((res) => {
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
                const newPendingArray = [];
                res.forEach((r) => {
                  const start = new Date(r.startDate).getTime();
                  if (r.startDate === getToday) {
                    firebase
                      .firestore()
                      .collection("customers")
                      .doc(r.customer)
                      .update({ dietitian: r.dietitian })
                      .then(() => {
                        firebase
                          .firestore()
                          .collection("customers")
                          .doc(r.customer)
                          .get()
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
                            firebase
                              .firestore()
                              .collection("pending")
                              .doc(r.id)
                              .delete()
                              .then(() => {
                                console.log("Document successfully deleted!");
                              })
                              .catch((error) => {
                                console.error(
                                  "Error removing document: ",
                                  error
                                );
                              });
                          });
                      });
                    firebase
                      .firestore()
                      .collection("dietitians")
                      .doc(r.dietitian)
                      .collection("customers")
                      .doc(r.customer)
                      .set({
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
            // });
          });
      });
    firebase
      .firestore()
      .collection("reserve")
      .where("dietitian", "==", dietitianID)
      .get()
      .then((docs) => {
        const invitedArray = [];
        docs.forEach((doc) => {
          const startDate = new Date(doc.data().reserveStartDate).getTime();

          if (startDate > today && doc.data().status === "0") {
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
      .then((res) => setProfile(res.data()))
      .then(() =>
        setTimeout(() => {
          setLoad(style.loadFadeout);
        }, 500)
      );

    if (customerID) {
      firebase
        .firestore()
        .collection("dietitians")
        .doc(dietitianID)
        .collection("customers")
        .doc(customerID)
        .get()
        .then((doc) => {
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
  }, []);
  useEffect(() => {
    if (profile && profile.email && !profile.name) {
      setProfile({ ...profile, isServing: false });
      firebase
        .firestore()
        .collection("dietitians")
        .doc(dietitianID)
        .update({ isServing: false });
    }
  }, [profile && profile.name]);

  const getSelectedCustomer = (e) => {
    setActive({});
    setSelectedID(e.target.className);
    firebase
      .firestore()
      .collection("dietitians")
      .doc(dietitianID)
      .collection("customers")
      .doc(e.target.className)
      .get()
      .then((doc) => {
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

  const changeServiceStatusHandler = () => {
    if (profile.name && profile.education && profile.gender) {
      setProfile({ ...profile, isServing: !profile.isServing });
      firebase
        .firestore()
        .collection("dietitians")
        .doc(dietitianID)
        .update({ isServing: !profile.isServing });
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
      const { value: customer } = await Swal.fire({
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
                <img src={logo} id={basic["menu-logo"]} />
              </a>
              <div className={basic["straight-nav"]}>
                <Link
                  title="profile"
                  className={`${basic["nav-title"]} ${nav.profile || ""}`}
                  to={`/dietitian/${dietitianID}/profile`}
                  onClick={bindListHandler}
                >
                  <i class="fa fa-user" aria-hidden="true" title="profile"></i>
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
                        class="fa fa-users list"
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
                    <div className={basic["no-customers"]}>
                      <i class="fa fa-users list" aria-hidden="true"></i>
                      <div>客戶清單</div>
                    </div>
                  )}

                  <div
                    className={`${basic.customerList} list `}
                    style={{ display: display }}
                  >
                    {users && users.length > 0
                      ? users.map((c, index) => (
                          <Link
                            to={`/dietitian/${c.dietitian}/customer/${c.id}/`}
                            key={index}
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
                  to={`/dietitian/${dietitianID}/findCustomers`}
                >
                  <i
                    class="fa fa-search"
                    aria-hidden="true"
                    title="findCustomer"
                  ></i>
                  <div title="findCustomer">找客戶</div>
                </Link>

                <Link
                  title="whoInvite"
                  className={`${basic["nav-title"]} ${nav.whoInvite || ""}`}
                  onClick={bindListHandler}
                  to={`/dietitian/${dietitianID}/inviteMe`}
                >
                  <i
                    class="fa fa-envira"
                    aria-hidden="true"
                    title="whoInvite"
                  ></i>
                  <div title="whoInvite">誰找我</div>
                </Link>
                <Link
                  className={basic["nav-title"]}
                  onClick={bindListHandler}
                  to={`/dietitian/${dietitianID}`}
                >
                  <i class="fa fa-arrow-left" aria-hidden="true"></i>
                  <div>會員主頁</div>
                </Link>
                <a onClick={logoutHandler}>
                  <img src={exit} alt="logout" id={basic.logout} />
                </a>
                <div className={basic.copyright}>&copy;2021 Light Life</div>
              </div>
            </nav>

            <div className={basic.profile}>
              <img src={profile.image ? profile.image : noImage} />
              <div className={basic.welcome}>
                <div>{profile.name ? profile.name : ""}，您好</div>
                <div className={basic["service-status"]}>
                  <div>服務狀態：{profile.isServing ? "公開" : "私人"}</div>
                  <div>
                    <input
                      type="checkbox"
                      id="service"
                      className={`${basic.toggle} ${basic["toggle-round"]}`}
                      checked={profile.isServing ? true : false}
                      onClick={changeServiceStatusHandler}
                    />
                    <label className={basic.label} for="service"></label>
                  </div>
                </div>
              </div>
              <div className={basic["d-List"]}>
                <Link
                  title="profile"
                  className={`${basic["nav-title"]}`}
                  to={`/dietitian/${dietitianID}/profile`}
                  onClick={bindListHandler}
                >
                  <i class="fa fa-user" aria-hidden="true" title="profile"></i>
                  <div title="profile">會員資料</div>
                </Link>
                <Link
                  title="findCustomer"
                  className={basic["nav-title"]}
                  to={`/dietitian/${dietitianID}/findCustomers`}
                  onClick={bindListHandler}
                >
                  <i
                    class="fa fa-search"
                    aria-hidden="true"
                    title="findCustomer"
                  ></i>
                  <div title="findCustomer">找客戶</div>
                </Link>

                <a
                  className={`${basic["nav-title"]}`}
                  title="customerList"
                  onClick={showMobileCustomerList}
                >
                  <i
                    class="fa fa-users"
                    aria-hidden="true"
                    title="customerList"
                  ></i>
                  <div title="customerList">客戶清單</div>
                </a>

                <Link
                  className={basic["nav-title"]}
                  to={`/dietitian/${dietitianID}/inviteMe`}
                  onClick={bindListHandler}
                  title="whoInvite"
                >
                  <i
                    class="fa fa-envira"
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
                  <div className={basic.title}>服務狀況</div>
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
                              <div className={basic.each}>
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
                            <img src={spinner} />
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
                              <div className={basic.each}>
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
                            <img src={spinner} />
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
                    setPending={setPending}
                  />
                </div>
              </Route>
            </Switch>

            <Switch>
              <Route
                path={`/dietitian/${dietitianID}/customer/${
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
                      to={`/dietitian/${dietitianID}/customer/${
                        customerID ? customerID : selectedID
                      }/profile`}
                      onClick={bindListHandler}
                    >
                      <i class="fa fa-address-book-o" aria-hidden="true"></i>
                      {users && users.length > 0 && customerID
                        ? users.filter((e) => e.id === customerID)[0].name
                        : ""}
                    </Link>
                    <Link
                      id="cDietary"
                      className={`${style["link-select"]} ${
                        active.cDietary || ""
                      }`}
                      to={`/dietitian/${dietitianID}/customer/${
                        customerID ? customerID : selectedID
                      }/dietary`}
                      onClick={bindListHandler}
                    >
                      <i
                        class="fa fa-cutlery"
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
                      to={`/dietitian/${dietitianID}/customer/${
                        customerID ? customerID : selectedID
                      }/target`}
                      onClick={bindListHandler}
                    >
                      <i
                        class="fa fa-bullseye"
                        aria-hidden="true"
                        title="target"
                      ></i>
                      目標設定
                    </Link>
                  </div>
                </div>
                <Switch>
                  {/* <Route exact path={`/dietitian/:dID/customer/:cID/`}></Route> */}
                  <Route exact path={`/dietitian/:dID/customer/:cID/profile`}>
                    <>
                      <div className={style["service-time"]}>
                        <div>
                          服務時間<span>：</span>
                        </div>
                        <div>
                          {date.start ? date.start : ""}~
                          {date.end ? date.end : ""}
                        </div>
                      </div>
                      <div
                        id="customer-profile"
                        className={customer["customer-profile"]}
                      >
                        <div className={customer["profile-data"]}>
                          <CustomerProfile
                            props={props}
                            // id={selectedID}
                            input={input}
                          />
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
                {/* </Router> */}
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

export default Dietitian;
