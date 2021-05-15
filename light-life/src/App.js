import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Home from "./Pages/Home/home.js";
import Dietitian from "./Pages/Dietitian/dietitian.js";
import Customer from "./Pages/Customer/customer.js";

function App() {
  return (
    <Router>
      <a href="/">Home</a>
      <Switch>
        <Route exact path="/">
          <Home />
          <a href="/dietitian">Dietitian</a>
          <Link to="/customer">Customer</Link>
        </Route>
        <Route path="/dietitian">
          <Dietitian />
        </Route>
        <Route path="/customer">
          <Customer />
        </Route>
      </Switch>
    </Router>
  );
}
export default App;
