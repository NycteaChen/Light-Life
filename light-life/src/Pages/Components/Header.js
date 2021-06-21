import React from "react";
import logo from "../../images/lightlife-horizontal.png";
import style from "../../style/basic.module.scss";

export default function Header() {
  return (
    <header className={style["m-header"]}>
      <div className={style["logo-nav"]}>
        <a href="/">
          <img src={logo} id={style.logo} alt="logo" />
        </a>
      </div>
    </header>
  );
}
