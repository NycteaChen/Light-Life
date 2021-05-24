import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./Pages/Home/Home.js";
import Dietitian from "./Pages/Dietitian/Dietitian.js";
import Customer from "./Pages/Customer/Customer.js";
import styled from "styled-components";
import logo from "./images/lightlife-horizontal.png";

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
            <header className="m-header">
              <div className="logo-nav">
                <a href="/">
                  <img src={logo} id="logo" alt="logo" />
                </a>
                <div id="menu" style={{ width: "24px", height: "24px" }}></div>
              </div>
            </header>
            <Dietitian />
          </Route>
          <Route path="/customer/:cID">
            <header className="m-header">
              <div className="logo-nav">
                <a href="/">
                  <img src={logo} id="logo" alt="logo" />
                </a>
                <div id="menu" style={{ width: "24px", height: "24px" }}></div>
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
