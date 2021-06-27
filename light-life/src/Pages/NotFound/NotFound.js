import React from "react";
import Footer from "../Components/Footer.js";
import style from "../../style/NotFound.module.scss";
import notFound from "../../images/404.png";

const NotFound = () => {
  return (
    <>
      <main className={style.main}>
        <img src={notFound} alt="404" />
      </main>
      <Footer />
    </>
  );
};

export default NotFound;
