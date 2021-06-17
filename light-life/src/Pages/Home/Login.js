import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import {
  getDietitiansData,
  getCustomersData,
  getUserWithEmail,
  sendPasswordEmail,
  normalLoginHandler,
  signUp,
  initProfileData,
  providerLogin,
  onAuth,
} from "../../utils/Firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import style from "../../style/login.module.scss";
import logo from "../../images/lightlife-straight.png";
import Swal from "sweetalert2";
import apple from "../../images/apple.gif";
import "animate.css/animate.min.css";

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
    getDietitiansData()
      .then((docs) => {
        const emailsArray = [];
        docs.forEach((doc) => {
          emailsArray.push(doc.data().email);
        });
        return emailsArray;
      })
      .then((emailsArray) => {
        getCustomersData().then((docs) => {
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
        getUserWithEmail("dietitians", valid.email).then((querySnapshot) => {
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
        getUserWithEmail("customers", valid.email).then((querySnapshot) => {
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
      sendPasswordEmail(email)
        .then(() => {
          Swal.fire({
            title: "已發送信件至信箱",
            text: "請按照信件說明重設密碼",
            icon: "info",
            confirmButtonText: "確定",
            confirmButtonColor: "#1e4d4e",
          }).then(() => {
            setShow("");
            setEmail("");
            setShowMessage({});
            setValidStyle({ ...validStyle, reset: "" });
          });
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
    if (e.target.validity.valid && e.target.value) {
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
            getUserWithEmail("dietitians", e.target.value).then(
              (querySnapshot) => {
                if (querySnapshot.empty) {
                  setValidStyle({
                    email: style.invalid,
                  });
                } else {
                  setValidStyle({
                    email: style.valid,
                  });
                }
              }
            );
          } else if (
            emails.find((f) => f === e.target.value) &&
            client === "customer"
          ) {
            getUserWithEmail("customers", e.target.value).then(
              (querySnapshot) => {
                if (querySnapshot.empty) {
                  setValidStyle({
                    email: style.invalid,
                  });
                } else {
                  setValidStyle({
                    email: style.valid,
                  });
                }
              }
            );
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
      getUserWithEmail(client, valid.email).then((querySnapshot) => {
        if (!querySnapshot.empty) {
          let userID;
          querySnapshot.forEach((i) => {
            userID = i.data().id;
          });
          normalLoginHandler(valid.email, valid.password)
            .then((userCredential) => {
              const user = userCredential.user;
              console.log(user);
              setShowMessage({ welcomeback: style.showloginMessage });

              setTimeout(() => {
                setInput({});
                setValid({});
                setValidStyle({});
                window.location.href = `/${client}/${userID}`;
              }, 1500);
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
            // password: style.invalid,
          });
        }
      });
    } else {
      setShowMessage({
        incomplete: style.showMessage,
      });
      setValidStyle({
        email: style.invalid,
        password: style.invalid,
      });
    }
  };

  const signupHandler = (e) => {
    if (valid.email && valid.password && valid.name) {
      if (!showMessage.alreadyEmail && validStyle.email !== style.invalid) {
        Swal.fire({
          title: `確定註冊${client === "dietitian" ? "營養師" : "客戶"}端嗎?`,
          text: `若您是${client === "dietitian" ? "客戶" : "營養師"}，請選擇${
            client === "dietitian" ? "客戶" : "營養師"
          }端註冊`,
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "取消",
          confirmButtonText: "確定",
          confirmButtonColor: "#1e4d4e",
        }).then((res) => {
          if (res.isConfirmed) {
            signUp(valid.email, valid.password)
              .then(() => {
                // const user = userCredential.user;
                const { currentUser } = onAuth();
                currentUser
                  .sendEmailVerification()
                  .then(function () {
                    Swal.fire({
                      title: "註冊成功",
                      text: "驗證信已發送到您的信箱",
                      icon: "success",
                      confirmButtonText: "確定",
                      confirmButtonColor: "#1e4d4e",
                    })
                      .then(() => {
                        setInput({});
                        setValidStyle({});
                      })
                      .then(() => window.location.reload());
                  })
                  .catch((error) => {
                    Swal.fire({
                      title: "Oops!驗證信發送失敗",
                      text: `${error.message}`,
                      icon: "warning",
                      confirmButtonText: "確定",
                      confirmButtonColor: "#1e4d4e",
                    });
                  });

                initProfileData(client)
                  .add({
                    name: valid.name,
                    image: noImage,
                    email: valid.email,
                  })
                  .then((docRef) => {
                    initProfileData(client)
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
    providerLogin(provider)
      .then((result) => {
        const user = result.user;
        getUserWithEmail("dietitians", user.email).then((res) => {
          if (!res.empty) {
            let id;
            res.forEach((i) => (id = i.data().id));
            setShowMessage({ welcomeback: style.showloginMessage });
            setTimeout(() => {
              window.location.href = `/dietitian/${id}`;
            }, 1500);
          } else {
            getUserWithEmail("customers", user.email).then((res) => {
              if (!res.empty) {
                let id;
                res.forEach((i) => (id = i.data().id));
                setShowMessage({ welcomeback: style.showloginMessage });
                setTimeout(() => {
                  window.location.href = `/customer/${id}`;
                }, 1500);
              } else {
                Swal.fire({
                  title: `確定以${
                    client === "dietitian" ? "營養師" : "客戶"
                  }身分登入嗎?`,
                  text: `若您是${
                    client === "dietitian" ? "客戶" : "營養師"
                  }，請選擇${client === "dietitian" ? "客戶" : "營養師"}端註冊`,
                  icon: "warning",
                  showCancelButton: true,
                  cancelButtonText: "取消",
                  confirmButtonText: "確定",
                  confirmButtonColor: "#1e4d4e",
                }).then((res) => {
                  if (res.isConfirmed) {
                    initProfileData(client)
                      .add({
                        name: user.displayName,
                        image: user.photoURL,
                        email: user.email,
                      })
                      .then((docRef) => {
                        initProfileData(client)
                          .doc(docRef.id)
                          .update("id", docRef.id);

                        return docRef.id;
                      })
                      .then((res) => {
                        setShowMessage({
                          welcomeback: style.showloginMessage,
                        });
                        setTimeout(() => {
                          window.location.href = `/${client}/${res}`;
                        }, 1500);
                      });
                  } else {
                    const user = onAuth().currentUser;
                    user
                      .delete()
                      .then(() => {
                        // User deleted.
                        console.log("delete user");
                      })
                      .catch((error) => {
                        // An error ocurred
                        // ...
                        console.log(error);
                      });
                  }
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
        console.log(errorCode, errorMessage);
        console.log(email);
        console.log(credential);
        Swal.fire({
          text: "此帳號在別的登入端已經使用",
          icon: "warning",
          confirmButtonText: "確定",
          confirmButtonColor: "#1e4d4e",
        });
      });
  };
  const facebookLoginHandler = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    providerLogin(provider)
      .then((result) => {
        const user = result.user;

        getUserWithEmail("dietitians", user.email).then((res) => {
          if (!res.empty) {
            let id;
            res.forEach((i) => (id = i.data().id));
            setShowMessage({ welcomeback: style.showloginMessage });
            setTimeout(() => {
              window.location.href = `/dietitian/${id}`;
            }, 1500);
          } else {
            getUserWithEmail("customers", user.email).then((res) => {
              if (!res.empty) {
                let id;
                res.forEach((i) => (id = i.data().id));
                setShowMessage({ welcomeback: style.showloginMessage });
                setTimeout(() => {
                  window.location.href = `/customer/${id}`;
                }, 1500);
              } else {
                Swal.fire({
                  title: `確定以${
                    client === "dietitian" ? "營養師" : "客戶"
                  }身分登入嗎?`,
                  text: `若您是${
                    client === "dietitian" ? "客戶" : "營養師"
                  }，請選擇${client === "dietitian" ? "客戶" : "營養師"}端註冊`,
                  icon: "warning",
                  showCancelButton: true,
                  cancelButtonText: "取消",
                  confirmButtonText: "確定",
                  confirmButtonColor: "#1e4d4e",
                }).then((res) => {
                  if (res.isConfirmed) {
                    initProfileData(client)
                      .add({
                        name: user.displayName,
                        image: `${user.photoURL}?height=500`,
                        email: user.email,
                      })
                      .then((docRef) => {
                        initProfileData(client)
                          .doc(docRef.id)
                          .update("id", docRef.id);

                        return docRef.id;
                      })
                      .then((res) => {
                        setShowMessage({
                          welcomeback: style.showloginMessage,
                        });
                        setTimeout(() => {
                          window.location.href = `/${client}/${res}`;
                        }, 1500);
                      });
                  } else {
                    const user = onAuth().currentUser;
                    user
                      .delete()
                      .then(() => {
                        // User deleted.
                        console.log("delete user");
                      })
                      .catch((error) => {
                        // An error ocurred
                        console.log(error);
                      });
                  }
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
        console.log(errorCode, errorMessage);
        // The email of the user's account used.
        const email = error.email;
        console.log(email);
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential;
        console.log(credential);
        // ...
        Swal.fire({
          text: "此帳號在別的登入端已經使用",
          icon: "warning",
          confirmButtonText: "確定",
          confirmButtonColor: "#1e4d4e",
        });
      });
  };
  return (
    <>
      <div className={`${style.loginMessage} ${showMessage.welcomeback || ""}`}>
        <img src={apple} alt="apple" />
        <div>歡迎回來</div>
      </div>
      <div className={`${style["login-col"]}`} style={{ display: display }}>
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
          <img src={logo} alt="logo" />
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
              <span
                className={`nav-link ${dietitian} dietitian`}
                aria-current="page"
                data-bs-toggle="tab"
                role="tab"
                aria-selected="true"
                onClick={bindSelectHandler}
              >
                營養師
              </span>
            </li>
            <li
              className="nav-item customer"
              role="presentation"
              onClick={bindSelectHandler}
            >
              <span
                className={`nav-link ${customer} customer`}
                data-bs-toggle="tab"
                role="tab"
                aria-selected="false"
                onClick={bindSelectHandler}
              >
                客戶
              </span>
            </li>
          </ul>
          {/*eslint-disable-next-line */}
          <form action="javascript:void(0);" autocomplete="off">
            <label>
              <div>帳號</div>
              <input
                type="email"
                name="email"
                className={validStyle.email || ""}
                placeholder="diet@test.com / cus@test.com"
                pattern="^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$"
                value={input.email || ""}
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
                minlength="6"
                maxlength="15"
                value={input.password || ""}
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
                <span id="signup" onClick={bindSignupHandler}>
                  註冊
                </span>
                ?
              </div>
              <div className={style.hint}>
                忘記
                <span id="forget-password" onClick={bindForgetPasswordHandler}>
                  密碼
                </span>
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
          <img src={logo} alt="logo" />
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
              <span
                className={`nav-link ${dietitian} dietitian`}
                aria-current="page"
                data-bs-toggle="tab"
                role="tab"
                aria-selected="true"
                onClick={bindSelectHandler}
              >
                營養師
              </span>
            </li>
            <li
              className="nav-item customer"
              role="presentation"
              onClick={bindSelectHandler}
            >
              <span
                className={`nav-link ${customer} customer`}
                data-bs-toggle="tab"
                role="tab"
                aria-selected="false"
                onClick={bindSelectHandler}
              >
                客戶
              </span>
            </li>
          </ul>
          {/*eslint-disable-next-line */}
          <form action="javascript:void(0);" autocomplete="off">
            <label>
              <div>姓名</div>
              <input
                type="text"
                name="name"
                className={validStyle.name || ""}
                placeholder="請輸入姓名"
                pattern="^[\u4e00-\u9fa5]+$|^[a-zA-Z\s]+$"
                value={input.name || ""}
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
                value={input.email || ""}
                onChange={getInputHandler}
              />
            </label>

            <label>
              <div>密碼</div>
              <input
                type={eye.mode}
                name="password"
                className={validStyle.password || ""}
                placeholder="請輸入至少6位字元"
                minlength="6"
                maxlength="15"
                value={input.password || ""}
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
              <span id="login" onClick={bindLoginHandler}>
                登入頁
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
