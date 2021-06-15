import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Pages/Home/Home.js";
import Dietitian from "./Pages/Dietitian/Dietitian.js";
import Customer from "./Pages/Customer/Customer.js";
import NotFound from "./Pages/NotFound/NotFound.js";
import logo from "./images/lightlife-horizontal.png";
import style from "./style/basic.module.scss";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/dietitian/:dID">
          <header className={style["m-header"]}>
            <div className={style["logo-nav"]}>
              <a href="/">
                <img src={logo} id={style.logo} alt="logo" />
              </a>
            </div>
          </header>
          <Dietitian />
        </Route>
        <Route path="/customer/:cID">
          <header className={style["m-header"]}>
            <div className={style["logo-nav"]}>
              <a href="/">
                <img src={logo} id={style.logo} alt="logo" />
              </a>
              <div id="menu" style={{ width: "24px", height: "24px" }}></div>
            </div>
          </header>
          <Customer />
        </Route>
        <Route>
          <header className={style["m-header"]}>
            <div className={style["logo-nav"]}>
              <a href="/">
                <img src={logo} id={style.logo} alt="logo" />
              </a>
            </div>
          </header>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}
export default App;
