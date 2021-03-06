import React from "react";
import { Link, useParams } from "react-router-dom";
import { logout } from "../../utils/Firebase";
import style from "../../style/mobileBottom.module.scss";
import Swal from "sweetalert2";
import exit from "../../images/exit.png";
import user from "../../images/user.png";

export default function MobileBottom() {
  const { cID } = useParams();
  const { dID } = useParams();
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
  return (
    <>
      <div className={style.mobileBottom}>
        <Link
          className={style.link}
          to={dID ? `/dietitian/${dID}` : `/customer/${cID}`}
        >
          <img src={user} alt="member" />
          <span>會員主頁</span>
        </Link>
        <button onClick={logoutHandler} className={style.link}>
          <img src={exit} alt="logout" />
          <span>登出</span>
        </button>
      </div>
      <aside>
        <a
          href={dID ? `/dietitian/${dID}#top` : `/customer/${cID}#top`}
          id={style.toTop}
        >
          {" "}
        </a>
      </aside>
    </>
  );
}
