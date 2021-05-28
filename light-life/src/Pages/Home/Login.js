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
import logo from "../../images/lightlife-straight.png";

function Login({ display, setDisplay }) {
  const noImage =
    "https://firebasestorage.googleapis.com/v0/b/light-life-5fdaa.appspot.com/o/images%2Fnoimage.png?alt=media&token=99c5898a-d5c4-45c9-a166-94563585aa0d";
  const [login, setLogin] = useState(style.appear);
  const [signup, setSignup] = useState(style.disappear);
  const [image, setImage] = useState(style.left);
  const [client, setClient] = useState("dietitian");
  const [dietitian, setDietitian] = useState(style.active);
  const [customer, setCustomer] = useState("");
  const [input, setInput] = useState({});
  const [valid, setValid] = useState({});
  const [eye, setEye] = useState({
    on: "none",
    slash: "block",
    mode: "password",
  });
  const [email, setEmail] = useState("");
  const [show, setShow] = useState("");

  const bindSignupHandler = () => {
    setLogin(style.disappear);
    setSignup(style.appear);
    setImage(style.right);
    setInput({});
    setValid({});
    setEye({
      on: "none",
      slash: "block",
      mode: "password",
    });
  };
  const bindLoginHandler = () => {
    setLogin(style.appear);
    setSignup(style.disappear);
    setImage(style.left);
    setInput({});
    setValid({});
    setEye({
      on: "none",
      slash: "block",
      mode: "password",
    });
  };

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

  const bindForgetPasswordHandler = () => {
    setShow(style.show);
  };

  const getEmail = (e) => {
    setEmail(e.target.value);
  };

  const cancelHandler = () => {
    setShow("");
  };
  const bindSendPasswordEmailButton = () => {
    if (email !== "") {
      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(function () {
          window.alert("已發送信件至信箱，請按照信件說明重設密碼");
          window.location.reload(); // 送信後，強制頁面重整一次
        })
        .catch(function (error) {
          console.log(error.message);
        });
    } else {
      alert("沒有輸入喔");
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
      setValid({ ...valid, [name]: e.target.value });
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

  const loginHandler = () => {
    if (valid.email && valid.password) {
      firebase
        .firestore()
        .collection(`${client}s`)
        .where("email", "==", `${valid.email}`)
        .get()
        .then((querySnapshot) => {
          if (!querySnapshot.empty) {
            let userID;
            querySnapshot.forEach((i) => {
              userID = i.data().id;
            });

            firebase
              .auth()
              .signInWithEmailAndPassword(valid.email, valid.password)
              .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                alert("歡迎回來");
                window.location.href = `/${client}/${userID}`;
                setInput({});
                setValid({});
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode + errorMessage);
                alert("密碼錯誤");
              });
          } else {
            alert("沒有此帳號喔，請檢查您輸入是否正確或選錯登入端");
          }
        });
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
          alert("註冊成功");
          const { currentUser } = firebase.auth();
          currentUser
            .sendEmailVerification()
            .then(function () {
              // 驗證信發送完成
              window.alert("驗證信已發送到您的信箱，請查收。");
            })
            .catch((error) => {
              // 驗證信發送失敗
              console.log(error.message);
            });

          firebase
            .firestore()
            .collection(`${client}s`)
            .add({
              name: valid.name,
              image: noImage,
              email: valid.email,
            })
            .then((docRef) => {
              firebase
                .firestore()
                .collection(`${client}s`)
                .doc(docRef.id)
                .update("id", docRef.id);
            })
            .then(() => {
              setValid({});
            });
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

  const googleLoginHandler = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        firebase
          .firestore()
          .collection("dietitians")
          .where("email", "==", user.email)
          .get()
          .then((res) => {
            if (!res.empty) {
              let id;
              res.forEach((i) => (id = i.data().id));
              window.location.href = `/dietitian/${id}`;
            } else {
              firebase
                .firestore()
                .collection("customers")
                .where("email", "==", user.email)
                .get()
                .then((res) => {
                  if (!res.empty) {
                    let id;
                    res.forEach((i) => (id = i.data().id));
                    window.location.href = `/customer/${id}`;
                  } else {
                    firebase
                      .firestore()
                      .collection(`${client}s`)
                      .add({
                        name: user.displayName,
                        image: user.photoURL,
                        email: user.email,
                      })
                      .then((docRef) => {
                        firebase
                          .firestore()
                          .collection(`${client}s`)
                          .doc(docRef.id)
                          .update("id", docRef.id);

                        return docRef.id;
                      })
                      .then((res) => {
                        window.location.href = `/${client}/${res}`;
                      });
                  }
                });
            }
          });
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential;
        // ...
      });
  };
  const facebookLoginHandler = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        console.log(user);
        console.log(result);
        firebase
          .firestore()
          .collection("dietitians")
          .where("email", "==", user.email)
          .get()
          .then((res) => {
            if (!res.empty) {
              let id;
              res.forEach((i) => (id = i.data().id));
              window.location.href = `/dietitian/${id}`;
            } else {
              firebase
                .firestore()
                .collection("customers")
                .where("email", "==", user.email)
                .get()
                .then((res) => {
                  if (!res.empty) {
                    let id;
                    res.forEach((i) => (id = i.data().id));
                    window.location.href = `/customer/${id}`;
                  } else {
                    firebase
                      .firestore()
                      .collection(`${client}s`)
                      .add({
                        name: user.displayName,
                        image: `${user.photoURL}?height=500`,
                        email: user.email,
                      })
                      .then((docRef) => {
                        firebase
                          .firestore()
                          .collection(`${client}s`)
                          .doc(docRef.id)
                          .update("id", docRef.id);

                        return docRef.id;
                      })
                      .then((res) => {
                        window.location.href = `/${client}/${res}`;
                      });
                  }
                });
            }
          });
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential;
        // ...
      });
  };

  return (
    <>
      <div className={style["login-col"]} style={{ display: display }}>
        <div className={`${style.emailForm} ${show}`}>
          <label>
            <div>請輸入信箱</div>{" "}
            <input
              type="email"
              value={email !== "" ? email : ""}
              onChange={getEmail}
            />
          </label>
          <div>
            <button onClick={bindSendPasswordEmailButton}>確認</button>
            <button onClick={cancelHandler}>取消</button>
          </div>
        </div>

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
            <div className={style.hints}>
              <div className={style.hint}>
                還沒
                <a id="signup" onClick={bindSignupHandler}>
                  註冊
                </a>
                ?
              </div>
              <div className={style.hint}>
                忘記
                <a id="forget-password" onClick={bindForgetPasswordHandler}>
                  密碼
                </a>
              </div>
            </div>
            <button onClick={loginHandler}>登入</button>

            <button type="button" onClick={googleLoginHandler}>
              Google 登入
            </button>
            <button type="button" onClick={facebookLoginHandler}>
              Facebook 登入
            </button>
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
              <a id="login" onClick={bindLoginHandler}>
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
