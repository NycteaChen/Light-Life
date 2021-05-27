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
  const [dietitian, setDietitian] = useState(style.active);
  const [customer, setCustomer] = useState("");

  const bindSignupHandler = () => {
    setLogin(style.disappear);
    setSignup(style.appear);
    setImage(style.right);
  };
  const bindLoginHandler = () => {
    setLogin(style.appear);
    setSignup(style.disappear);
    setImage(style.left);
  };

  const bindSelectHandler = (e) => {
    if (e.target.className.includes("dietitian")) {
      console.log("here");
      setDietitian(style.active);
      setCustomer("");
    } else {
      setDietitian("");
      setCustomer(style.active);
    }
  };
  const closeHandler = () => {
    setDisplay("none");
  };
  console.log(display);
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
          <form>
            <label>
              <div>帳號</div>
              <input
                type="email"
                name="email"
                placeholder="請輸入e-mail"
                required
              />
            </label>
            <label>
              <div>密碼</div>
              <input
                type="password"
                name="password"
                密碼
                placeholder="請輸入密碼"
                required
              />
            </label>

            <div className={style.hint}>
              還沒
              <a href="#" id="signup" onClick={bindSignupHandler}>
                註冊
              </a>
              ?
            </div>

            <button>登入</button>

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

          <form>
            <label>
              <div>姓名</div>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="請輸入姓名"
                required
              />
            </label>
            <label>
              <div>帳號</div>
              <input
                type="email"
                name="email"
                placeholder="請輸入e-mail"
                required
              />
            </label>

            <label>
              <div>密碼</div>
              <input
                type="password"
                name="password"
                密碼
                placeholder="請輸入密碼"
                required
              />
            </label>
            <div>
              <button>註冊</button>
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
