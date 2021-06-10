import React from "react";
import home from "../../style/home.module.scss";
import style from "../../style/NotFound.module.scss";
import notFound from "../../images/404.png";

const NoMatch = () => {
  return (
    <>
      <main className={style.main}>
        <img src={notFound} />
      </main>
      <footer className={style.footer}>
        <div>
          <a
            href="https://github.com/NycteaChen"
            target="_blank"
            rel="noreferrer"
          >
            <i
              className={`fa fa-github ${home.gitIcon}`}
              aria-hidden="true"
            ></i>
          </a>
          <p>jungturn01tw@gmail.com</p>
        </div>
        <p>&copy;2021 Light Life</p>
      </footer>
    </>
  );
};

export default NoMatch;
