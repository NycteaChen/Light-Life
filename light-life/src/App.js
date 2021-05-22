import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./Pages/Home/Home.js";
import Dietitian from "./Pages/Dietitian/Dietitian.js";
import Customer from "./Pages/Customer/Customer.js";
import styled from "styled-components";
import logo from "./images/lightlife-horizontal.svg";
import "./style/home.scss";

function App() {
  const dID = "cJUCoL1hZz36cVgf7WRz";
  const cID = "9iYZMkuFdZRK9vxgt1zc";

  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/">
            <Link to={`/dietitian/${dID}`}>Dietitian</Link>
            <Link to={`/customer/${cID}`}>Customer</Link>
            <Home />
          </Route>
          <Route path="/dietitian/:dID">
            <header>
              <div style={{ maxWidth: "unset" }}>
                <a href="/">
                  <img src={logo} alt="LightLifeLogo" id="logo" />
                </a>
              </div>
            </header>
            <Dietitian />
          </Route>
          <Route path="/customer/:cID">
            <header>
              <div style={{ maxWidth: "unset" }}>
                <a href="/">
                  <img src={logo} alt="LightLifeLogo" id="logo" />
                </a>
              </div>
            </header>
            <Customer />
          </Route>
        </Switch>
      </Router>
    </>
  );
}
export default App;
