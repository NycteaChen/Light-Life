import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import style from "../../style/mobileBottom.module.scss";
import Swal from "sweetalert2";
import exit from "../../images/exit.png";
import user from "../../images/user.png";
export default function MobileBottom() {
  const params = useParams();
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
      <div className={style.mobileBottom}>
        <Link
          className={style.link}
          to={
            params.dID ? `/dietitian/${params.dID}` : `/customer/${params.cID}`
          }
        >
          <img src={user} alt="member" />
          <span>會員主頁</span>
        </Link>
        <a onClick={logoutHandler} className={style.link}>
          <img src={exit} alt="logout" />
          <span>登出</span>
        </a>
      </div>
      <aside>
        <a href="#top" id={style.toTop}></a>
      </aside>
    </>
  );
}
