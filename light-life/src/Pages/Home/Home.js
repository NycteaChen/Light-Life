import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import Login from "./Login.js";
import Swal from "sweetalert2";
import logo from "../../images/lightlife-horizontal.png";
import loading from "../../images/lightlife-straight.png";
import style from "../../style/home.module.scss";
import noImage from "../../images/noimage.png";
import exit from "../../images/exit.png";
import WOW from "wowjs";
import "animate.css/animate.min.css";
import $ from "jquery";
function Home() {
  const [display, setDisplay] = useState("none");
  const [user, setUser] = useState({});
  const [button, setButton] = useState("submit");
  const [input, setInput] = useState({});
  const [load, setLoad] = useState(style.loading);
  const bindLoginButton = () => {
    setDisplay("flex");
  };

  const sendContactHandler = () => {
    if (input.name && input.email && input.text) {
      setButton("button");
      Swal.fire({
        text: "確定送出嗎?",
        showCancelButton: true,
        cancelButtonText: "取消",
        confirmButtonText: "確定",
        confirmButtonColor: "#1e4d4e",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "發送成功",
            text: "感謝您的來信",
            icon: "success",
            confirmButtonText: "確定",
            confirmButtonColor: "#1e4d4e",
          });
          setInput({});
        }
      });
    } else {
      setButton("submit");
    }
  };

  const getInputHandler = (e) => {
    const { name } = e.target;
    setInput({ ...input, [name]: e.target.value });
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        console.log(user);

        firebase
          .firestore()
          .collection("dietitians")
          .where("email", "==", user.email)
          .get()
          .then((docs) => {
            if (!docs.empty) {
              docs.forEach((doc) => {
                setUser({
                  image: doc.data().image,
                  id: doc.data().id,
                  client: "dietitian",
                });
              });
            }
          });
        firebase
          .firestore()
          .collection("customers")
          .where("email", "==", user.email)
          .get()
          .then((docs) => {
            if (!docs.empty) {
              docs.forEach((doc) => {
                setUser({
                  image: doc.data().image,
                  id: doc.data().id,
                  client: "customer",
                });
              });
            }
          });

        setTimeout(() => {
          setLoad(style.loadFadeout);
        }, 1000);
      } else {
        // User is signed out
        // ...
        console.log("no one");
        setTimeout(() => {
          setLoad(style.loadFadeout);
        }, 500);
      }
    });

    const wow = new WOW.WOW({
      boxClass: `${style.wow}`,
      offset: 150,
      live: true,
    });
    wow.init();
  }, []);

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

  return (
    <>
      <div className={load}>
        <img src={loading} />
      </div>
      <div
        className={style.mask}
        style={{
          display: display,
        }}
      ></div>
      <Login display={display} setDisplay={setDisplay} />
      <header className={style["home-header"]}>
        <div>
          <a href="/">
            <img src={logo} alt="LightLifeLogo" id="logo" id={style.logo} />
          </a>
          <nav className={style["header-nav"]}>
            <a href="#about">關於本站</a>
            <a href="#contact">聯絡我們</a>
            {user.client ? (
              <>
                <Link to={`/${user.client}/${user.id}`} className={style.icon}>
                  <img
                    className={style["login-image"]}
                    src={user.image || noImage}
                  />
                </Link>
                <a onClick={logoutHandler} className={style.icon}>
                  <img
                    src={exit}
                    alt="logout"
                    className={style["logout-image"]}
                  />
                </a>
              </>
            ) : (
              <a onClick={bindLoginButton}>登入</a>
            )}
          </nav>
        </div>
      </header>
      <main className={style["home-main"]}>
        <div className={style.cover}>
          <div className={style["main-title"]}>
            <h2>Bring you to light life</h2>
            <div>專業營養團隊，帶您活出輕盈光彩</div>
            {user.client ? (
              <Link to={`/${user.client}/${user.id}`}>
                <button>使用服務</button>
              </Link>
            ) : (
              <a>
                <button onClick={bindLoginButton}>使用服務</button>
              </a>
            )}
          </div>
        </div>
        <div className={style.col}>
          <div className={style.background}></div>
          <div className={style.content} id="about">
            <article className={style.about}>
              <section className={`${style.wow} animated animate__slideInLeft`}>
                <div className={style.sectionText}>
                  <h2>關於本站</h2>
                  <h3>您在尋找客戶嗎？</h3>
                  <p>
                    本站是一個營養師媒合平台，我們提供營養師一個接案管道，讓您能自由開拓自己的營養事業。
                  </p>
                  <p>本站設有客戶管理系統，讓您能方便管理您的每位客戶。</p>
                  <p>若您是有高考證照的營養師，即可註冊本站服務。</p>
                </div>
                <img className={style.firstImg} alt="lightlife-about" />
              </section>
              <section
                className={`${style.wow} animated animate__slideInRight`}
              >
                <div className={style.sectionText}>
                  <h3 className={style.subtitle}>您想尋找營養師嗎？</h3>
                  <p>本站有來自各地的專業營養師，讓您能選擇自己的營養管家。</p>
                  <p>
                    營養師將為您分析每日飲食狀況，此外您可以向您的營養師詢問各類營養資訊。
                  </p>
                  <p>若您是需要營養師的民眾，即可註冊本站服務。</p>
                </div>
                <img className={style.secondImg} alt="service" />
              </section>
            </article>
          </div>
        </div>
        <div className={style.contact} id="contact">
          <div
            className={`${style["contact-title"]} ${style.wow} animated animate__fadeInUp`}
          >
            <h2>聯絡我們</h2>
            <p>對本站有任何疑問或回饋請告訴我們！</p>
          </div>
          <section className={`${style.wow} animated animate__fadeInUp`}>
            <form autocomplete="off">
              <label>
                您的大名
                <div>
                  <input
                    type="text"
                    name="name"
                    value={input.name ? input.name : ""}
                    onChange={getInputHandler}
                    required
                  />
                </div>
              </label>
              <label>
                信箱
                <div>
                  <input
                    type="email"
                    name="email"
                    pattern="^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$"
                    value={input.email ? input.email : ""}
                    onChange={getInputHandler}
                    required
                  />
                </div>
              </label>
              <label>
                內容
                <div>
                  <textarea
                    name="text"
                    rows="6"
                    cols="40"
                    value={input.text ? input.text : ""}
                    onChange={getInputHandler}
                    required
                  ></textarea>
                </div>
              </label>
              <div id="submit">
                <button type={button} onClick={sendContactHandler}>
                  提交
                </button>
              </div>
            </form>
          </section>
        </div>
        <section className={style.service}>
          <p>We will bring you to light life!</p>
          {user.client ? (
            <Link to={`/${user.client}/${user.id}`}>
              <button>使用服務</button>
            </Link>
          ) : (
            <a>
              <button onClick={bindLoginButton}>使用服務</button>
            </a>
          )}
        </section>
      </main>
      <aside>
        <a href="#top" id={style.toTop}></a>
      </aside>
      <footer>
        <div>
          <a
            href="https://github.com/NycteaChen"
            target="_blank"
            rel="noreferrer"
          >
            <i
              className={`fa fa-github ${style.gitIcon}`}
              aria-hidden="true"
            ></i>
          </a>
          <p>jungturn01tw@gmail.com</p>
        </div>
        <p>&copy;2021 Light Life</p>
      </footer>
    </>
  );
}

export default Home;
