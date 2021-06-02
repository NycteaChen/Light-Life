import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import style from "../../style/login.module.scss";
import logo from "../../images/lightlife-straight.png";
import { Formik } from "formik";
import swal from "sweetalert";
import { invalid } from "moment";

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
  const [validStyle, setValidStyle] = useState({});
  const [email, setEmail] = useState("");
  const [show, setShow] = useState("");
  const [showMessage, setShowMessage] = useState({});
  const [emails, setEmails] = useState([]);
  useEffect(() => {
    firebase
      .firestore()
      .collection("dietitians")
      .get()
      .then((docs) => {
        const emailsArray = [];
        docs.forEach((doc) => {
          emailsArray.push(doc.data().email);
        });
        return emailsArray;
      })
      .then((emailsArray) => {
        firebase
          .firestore()
          .collection("customers")
          .get()
          .then((docs) => {
            docs.forEach((doc) => {
              emailsArray.push(doc.data().email);
            });
            setEmails(emailsArray);
          });
      });
  }, []);

  const bindSignupHandler = () => {
    setLogin(style.disappear);
    setSignup(style.appear);
    setImage(style.right);
    setShowMessage({});
    setInput({});
    setValid({});
    setValidStyle({});
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
    setShowMessage({});
    setInput({});
    setValid({});
    setValidStyle({});
    setEye({
      on: "none",
      slash: "block",
      mode: "password",
    });
  };

  const bindSelectHandler = (e) => {
    if (showMessage.alreadyEmail) {
      setShowMessage({
        alreadyEmail: style.showMessage,
      });
    } else {
      setShowMessage({});
    }

    if (e.target.className.includes("dietitian")) {
      setClient("dietitian");
      setDietitian(style.active);
      setCustomer("");
      if (valid.email && login === style.appear) {
        firebase
          .firestore()
          .collection(`dietitians`)
          .where("email", "==", `${valid.email}`)
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              setValidStyle({
                email: style.invalid,
              });
            } else {
              setValidStyle({
                email: style.valid,
              });
            }
          });
      }
    } else {
      setCustomer(style.active);
      setClient("customer");
      setDietitian("");
      if (valid.email && login === style.appear) {
        firebase
          .firestore()
          .collection(`customers`)
          .where("email", "==", `${valid.email}`)
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              setValidStyle({
                email: style.invalid,
              });
            } else {
              setValidStyle({
                email: style.valid,
              });
            }
          });
      }
    }
  };

  const closeHandler = () => {
    setDisplay("none");
    setInput({});
    setValid({});
    setValidStyle({});
    setShowMessage({});
  };

  const bindForgetPasswordHandler = (e) => {
    if (e.target.id === "forget-password") {
      setShow(style.show);
      setValidStyle({ ...validStyle, reset: "" });
    } else {
      setShow("");
      setShowMessage({});
      setValidStyle({ ...validStyle, reset: "" });
      setEmail("");
    }
  };

  const getEmail = (e) => {
    setEmail(e.target.value);
  };

  const bindSendPasswordEmailButton = () => {
    if (email !== "") {
      firebase
        .auth()
        .sendPasswordResetEmail(email)
        .then(function () {
          swal("已發送信件至信箱", "請按照信件說明重設密碼", "success").then(
            () => {
              setShow("");
              setEmail("");
              setShowMessage({});
              setValidStyle({ ...validStyle, reset: "" });
            }
          );
        })
        .catch(function (error) {
          console.log(error);
          console.log(error.message);
          setValidStyle({ ...validStyle, reset: style.invalid });
          setShowMessage({
            formHeight: style.formHeight,
            wrongEmail: style.showMessage,
          });
        });
    } else {
      setValidStyle({ ...validStyle, reset: style.invalid });
      setShowMessage({
        formHeight: style.formHeight,
        noEnter: style.showMessage,
      });
    }
  };

  const getInputHandler = (e) => {
    const { name } = e.target;
    setInput({ ...input, [name]: e.target.value });
    if (e.target.validity.valid) {
      setValid({ ...valid, [name]: e.target.value });
      if (signup === style.appear) {
        setValidStyle({ ...validStyle, [name]: style.valid });
      }
      if (name === "email") {
        if (login === style.appear) {
          if (
            emails.find((f) => f === e.target.value) &&
            client === "dietitian"
          ) {
            firebase
              .firestore()
              .collection(`dietitians`)
              .where("email", "==", `${e.target.value}`)
              .get()
              .then((querySnapshot) => {
                if (querySnapshot.empty) {
                  setValidStyle({
                    email: style.invalid,
                  });
                } else {
                  setValidStyle({
                    email: style.valid,
                  });
                }
              });
          } else if (
            emails.find((f) => f === e.target.value) &&
            client === "customer"
          ) {
            firebase
              .firestore()
              .collection(`customers`)
              .where("email", "==", `${e.target.value}`)
              .get()
              .then((querySnapshot) => {
                if (querySnapshot.empty) {
                  setValidStyle({
                    email: style.invalid,
                  });
                } else {
                  setValidStyle({
                    email: style.valid,
                  });
                }
              });
          } else {
            setValidStyle({ ...validStyle, email: style.invalid });
          }
        } else {
          if (emails.find((f) => f === e.target.value)) {
            setShowMessage({
              alreadyEmail: style.showMessage,
            });
            setValidStyle({
              ...validStyle,
              email: style.invalid,
            });
          } else {
            setValidStyle({
              ...validStyle,
              email: style.valid,
            });
            setShowMessage({});
          }
        }
      }
    } else {
      delete valid[name];
      if (signup === style.appear) {
        setValidStyle({ ...validStyle, [name]: style.invalid });
      } else if (name === "email") {
        setValidStyle({ ...validStyle, email: style.invalid });
      }
    }
  };
  const switchPasswordModeHandler = (e) => {
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
                setInput({});
                setValid({});
                setValidStyle({});
                alert("歡迎回來");
                window.location.href = `/${client}/${userID}`;
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode + errorMessage);
                setShowMessage({ wrongPassword: style.showMessage });
                setValidStyle({
                  email: style.valid,
                  password: style.invalid,
                });
              });
          } else {
            setShowMessage({ wrongAccount: style.showMessage });
            setValidStyle({
              email: style.invalid,
              password: style.invalid,
            });
          }
        });
    } else {
      alert("none");
      setShowMessage({ incomplete: style.showMessage });
      setValidStyle({
        email: style.invalid,
        password: style.invalid,
      });
    }
  };

  const signupHandler = (e) => {
    if (valid.email && valid.password && valid.name) {
      if (!showMessage.alreadyEmail && validStyle.email !== style.invalid) {
        swal({
          title: `確定註冊${client === "dietitian" ? "營養師" : "客戶"}端嗎?`,
          text: `若您是${client === "dietitian" ? "客戶" : "營養師"}，請選擇${
            client === "dietitian" ? "客戶" : "營養師"
          }端註冊`,
          icon: "warning",
          buttons: true,
          // dangerMode: true,
        }).then((ok) => {
          if (ok) {
            firebase
              .auth()
              .createUserWithEmailAndPassword(valid.email, valid.password)
              .then((userCredential) => {
                // Signed in
                const user = userCredential.user;

                const { currentUser } = firebase.auth();
                currentUser
                  .sendEmailVerification()
                  .then(function () {
                    swal("註冊成功", "驗證信已發送到您的信箱", "success");
                    setInput({});
                    setValidStyle({});
                  })
                  .catch((error) => {
                    swal("Oops!驗證信發送失敗", `${error.message}`, "warning");
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

                setValidStyle({
                  ...validStyle,
                  email: style.invalid,
                });
              });
          }
        });
      } else {
        setValidStyle({
          ...validStyle,
          email: style.invalid,
        });
      }
    } else {
      setValidStyle({
        name: validStyle.name === style.valid ? style.valid : style.invalid,
        email: validStyle.email === style.valid ? style.valid : style.invalid,
        password:
          validStyle.password === style.valid ? style.valid : style.invalid,
      });
      setShowMessage({
        incomplete: style.showMessage,
      });
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
        <div
          className={`${style.emailForm} ${show} ${
            showMessage.formHeight || ""
          } `}
        >
          <label>
            <div>請輸入信箱</div>{" "}
            <input
              type="email"
              className={validStyle.reset || ""}
              pattern="^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$"
              value={email !== "" ? email : ""}
              onChange={getEmail}
            />
          </label>
          <div className={`${style.message} ${showMessage.noEnter || ""}`}>
            沒有輸入喔
          </div>
          <div className={`${style.message} ${showMessage.wrongEmail || ""}`}>
            信箱輸入有誤
          </div>
          <div>
            <button onClick={bindSendPasswordEmailButton}>確認</button>
            <button onClick={bindForgetPasswordHandler}>取消</button>
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
          <form action="javascript:void(0);" autocomplete="off">
            <label>
              <div>帳號</div>
              <input
                type="email"
                name="email"
                className={validStyle.email || ""}
                placeholder="diet@test.com or cus@test.com"
                pattern="^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$"
                value={input.email ? input.email : ""}
                onChange={getInputHandler}
              />
            </label>
            <label>
              <div>密碼</div>
              <input
                type={eye.mode}
                name="password"
                className={validStyle.password || ""}
                placeholder="abc123"
                pattern="^([a-zA-Z]+\d+|\d+[a-zA-Z]+)[a-zA-Z0-9]*$"
                minlength="6"
                maxlength="12"
                value={input.password ? input.password : ""}
                onChange={getInputHandler}
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
            <div
              className={`${style.message} ${showMessage.wrongAccount || ""}`}
            >
              帳號或登入端有誤
            </div>
            <div
              className={`${style.message} ${showMessage.wrongPassword || ""}`}
            >
              密碼錯誤
            </div>
            <div className={`${style.message} ${showMessage.incomplete || ""}`}>
              資料請填寫完整喔
            </div>
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

          <form action="javascript:void(0);" autocomplete="off">
            <label>
              <div>姓名</div>
              <input
                type="text"
                name="name"
                className={validStyle.name || ""}
                placeholder="請輸入姓名"
                pattern="^[\u4e00-\u9fa5]+$|^[a-zA-Z\s]+$"
                value={input.name ? input.name : ""}
                onChange={getInputHandler}
              />
            </label>
            <label>
              <div>帳號</div>
              <input
                type="email"
                name="email"
                className={validStyle.email || ""}
                placeholder="請輸入e-mail"
                pattern="^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$"
                value={input.email ? input.email : ""}
                onChange={getInputHandler}
              />
            </label>

            <label>
              <div>密碼</div>
              <input
                type={eye.mode}
                name="password"
                className={validStyle.password || ""}
                placeholder="請輸入至少6位英數字"
                pattern="^([a-zA-Z]+\d+|\d+[a-zA-Z]+)[a-zA-Z0-9]*$"
                minlength="6"
                maxlength="12"
                value={input.password ? input.password : ""}
                onChange={getInputHandler}
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

            <div className={`${style.message} ${showMessage.incomplete || ""}`}>
              資料請填寫完整喔
            </div>
            <div
              className={`${style.message} ${showMessage.alreadyEmail || ""}`}
            >
              此信箱已有人使用
            </div>
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
