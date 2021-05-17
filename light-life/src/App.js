import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./Pages/Home/home.js";
import Dietitian from "./Pages/Dietitian/dietitian.js";
import Customer from "./Pages/Customer/customer.js";

function App() {
  const dID = "cJUCoL1hZz36cVgf7WRz";
  const cID = "9iYZMkuFdZRK9vxgt1zc";

  return (
    <Router>
      <a href="/">Home</a>
      <Switch>
        <Route exact path="/">
          <Home />
          <Link to={`/dietitian/${dID}`}>Dietitian</Link>
          <Link to={`/customer/${cID}`}>Customer</Link>
        </Route>
        <Route path="/dietitian/:dID">
          <Dietitian />
        </Route>
        <Route path="/customer/:cID">
          <Customer />
        </Route>
      </Switch>
    </Router>
  );
}
export default App;
