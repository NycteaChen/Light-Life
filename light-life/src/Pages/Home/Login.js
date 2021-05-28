import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useLocation,
} from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";

import "bootstrap/dist/css/bootstrap.min.css";
import style from "../../style/login.module.scss";
// import "../../style/login.scss";
import logo from "../../images/lightlife-straight.png";
// import { Nav } from "react-bootstrap";
function Login({ display, setDisplay }) {
  const [login, setLogin] = useState(style.appear);
  const [signup, setSignup] = useState(style.disappear);
  const [image, setImage] = useState(style.left);
  const [client, setClient] = useState("dietitian");
  const [dietitian, setDietitian] = useState(style.active);
  const [customer, setCustomer] = useState("");
  const [input, setInput] = useState({});
  const [valid, setValid] = useState({});
  const [user, setUser] = useState("");
  const [eye, setEye] = useState({
    on: "none",
    slash: "block",
    mode: "password",
  });

  const bindSignupHandler = () => {
    setLogin(style.disappear);
    setSignup(style.appear);
    setImage(style.right);
    setInput({});
  };
  const bindLoginHandler = () => {
    setLogin(style.appear);
    setSignup(style.disappear);
    setImage(style.left);
    setInput({});
  };

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid;
        console.log(uid);
        console.log(user);
      } else {
        // User is signed out
        // ...
        console.log("no one");
      }
    });
  }, []);

  const bindSelectHandler = (e) => {
    if (e.target.className.includes("dietitian")) {
      setClient("dietitian");
      setDietitian(style.active);
      setCustomer("");
    } else {
      setCustomer(style.active);
      setClient("customer");
      setDietitian("");
    }
  };
  const closeHandler = () => {
    setDisplay("none");
    setInput({});
    setValid({});
  };

  const getInputHandler = (e) => {
    const { name } = e.target;
    console.log(e.target.validity.valid);
    setInput({ ...input, [name]: e.target.value });
    if (e.target.validity.valid) {
      setValid({ ...input, [name]: e.target.value });
    } else {
      delete valid[name];
    }
  };

  const switchPasswordModeHandler = (e) => {
    console.log(e.target.className.includes("eye-slash"));
    if (e.target.className.includes("eye-slash")) {
      setEye({
        on: "block",
        slash: "none",
        mode: "text",
      });
    } else {
      setEye({
        on: "none",
        slash: "block",
        mode: "password",
      });
    }
  };
  console.log(eye);
  console.log(input);
  console.log(valid);

  const loginHandler = () => {
    if (valid.email && valid.password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(valid.email, valid.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);

          alert("歡迎回來");
          setInput({});
          setValid({});
          setUser(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode + errorMessage);
          alert("帳號密碼錯誤");
        });
    } else {
      console.log("none");
    }
  };

  const signupHandler = () => {
    if (valid.email && valid.password && valid.name) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(valid.email, valid.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);
          setInput({});
          setValid({});
          alert("註冊成功");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode + errorMessage);
          alert("此信箱已有人使用");
        });
    } else {
      console.log("none");
    }
  };

  return (
    <>
      <div className={style["login-col"]} style={{ display: display }}>
        <div className={`${style["login-image"]} ${image}`}></div>
        <div className={`${style.login} ${login}`}>
          <img src={logo} />
          <i
            aria-hidden="true"
            className={`${style.close} fa fa-times`}
            onClick={closeHandler}
          ></i>
          <div className={style.title}>登入</div>
          <ul className="nav nav-tabs" role="tablist">
            <li
              className="nav-item dietitian"
              role="presentation"
              onClick={bindSelectHandler}
            >
              <a
                className={`nav-link ${dietitian} dietitian`}
                aria-current="page"
                data-bs-toggle="tab"
                href="#"
                role="tab"
                aria-selected="true"
                onClick={bindSelectHandler}
              >
                營養師
              </a>
            </li>
            <li
              className="nav-item customer"
              role="presentation"
              onClick={bindSelectHandler}
            >
              <a
                className={`nav-link ${customer} customer`}
                data-bs-toggle="tab"
                href="#"
                role="tab"
                aria-selected="false"
                onClick={bindSelectHandler}
              >
                客戶
              </a>
            </li>
          </ul>
          <form action="javascript:void(0);">
            <label>
              <div>帳號</div>
              <input
                type="email"
                name="email"
                placeholder="請輸入e-mail"
                pattern="^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$"
                value={input.email ? input.email : ""}
                onChange={getInputHandler}
                required
              />
            </label>
            <label>
              <div>密碼</div>
              <input
                type={eye.mode}
                name="password"
                placeholder="請輸入至少6位英數字"
                pattern="^([a-zA-Z]+\d+|\d+[a-zA-Z]+)[a-zA-Z0-9]*$"
                minlength="6"
                maxlength="12"
                value={input.password ? input.password : ""}
                onChange={getInputHandler}
                required
              />
              <i
                class={`fa fa-eye-slash ${style["eye-slash"]}`}
                style={{ display: eye.slash }}
                aria-hidden="true"
                onClick={switchPasswordModeHandler}
              ></i>
              <i
                class={`fa fa-eye ${style["eye-on"]}`}
                aria-hidden="true"
                style={{ display: eye.on }}
                onClick={switchPasswordModeHandler}
              ></i>
            </label>

            <div className={style.hint}>
              還沒
              <a href="#" id="signup" onClick={bindSignupHandler}>
                註冊
              </a>
              ?
            </div>

            <button onClick={loginHandler}>登入</button>

            <button>Google 登入</button>
            <button>Facebook 登入</button>
          </form>
        </div>
        <div className={`${style.signup} ${signup}`}>
          <img src={logo} />
          <i
            aria-hidden="true"
            className={`${style.close} fa fa-times`}
            onClick={closeHandler}
          ></i>
          <div className={style.title}>註冊</div>
          <ul className="nav nav-tabs" role="tablist">
            <li
              className="nav-item dietitian"
              role="presentation"
              onClick={bindSelectHandler}
            >
              <a
                className={`nav-link ${dietitian} dietitian`}
                aria-current="page"
                data-bs-toggle="tab"
                href="#"
                role="tab"
                aria-selected="true"
                onClick={bindSelectHandler}
              >
                營養師
              </a>
            </li>
            <li
              className="nav-item customer"
              role="presentation"
              onClick={bindSelectHandler}
            >
              <a
                className={`nav-link ${customer} customer`}
                data-bs-toggle="tab"
                href="#"
                role="tab"
                aria-selected="false"
                onClick={bindSelectHandler}
              >
                客戶
              </a>
            </li>
          </ul>

          <form action="javascript:void(0);">
            <label>
              <div>姓名</div>
              <input
                type="text"
                name="name"
                placeholder="請輸入姓名"
                pattern="^[\u4e00-\u9fa5]+$|^[a-zA-Z\s]+$"
                value={input.name ? input.name : ""}
                onChange={getInputHandler}
                required
              />
            </label>
            <label>
              <div>帳號</div>
              <input
                type="email"
                name="email"
                placeholder="請輸入e-mail"
                pattern="^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$"
                value={input.email ? input.email : ""}
                onChange={getInputHandler}
                required
              />
            </label>

            <label>
              <div>密碼</div>
              <input
                type={eye.mode}
                name="password"
                placeholder="請輸入至少6位英數字"
                pattern="^([a-zA-Z]+\d+|\d+[a-zA-Z]+)[a-zA-Z0-9]*$"
                minlength="6"
                maxlength="12"
                value={input.password ? input.password : ""}
                onChange={getInputHandler}
                required
              />
              <i
                class={`fa fa-eye-slash ${style["eye-slash"]}`}
                style={{ display: eye.slash }}
                aria-hidden="true"
                onClick={switchPasswordModeHandler}
              ></i>
              <i
                class={`fa fa-eye ${style["eye-on"]}`}
                aria-hidden="true"
                style={{ display: eye.on }}
                onClick={switchPasswordModeHandler}
              ></i>
            </label>
            <div>
              <button onClick={signupHandler}>註冊</button>
            </div>
            <div className={style.hint}>
              返回
              <a href="#" id="login" onClick={bindLoginHandler}>
                登入頁
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
