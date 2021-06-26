import React from "react";
import style from "../../style/home.module.scss";
import notFound from "../../style/notFound.module.scss";
import { useLocation } from "react-router-dom";
export default function Footer() {
  const { pathname } = useLocation();
  return (
    <footer className={pathname === "/" ? "" : notFound.footer}>
      <div>
        <a
          href="https://github.com/NycteaChen"
          target="_blank"
          rel="noreferrer"
        >
          <i className={`fa fa-github ${style.gitIcon}`} aria-hidden="true"></i>
        </a>
        <p>jungturn01tw@gmail.com</p>
      </div>
      <p>&copy;2021 Light Life</p>
    </footer>
  );
}
