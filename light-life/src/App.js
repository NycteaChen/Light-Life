import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Pages/Home/Home.js";
import Header from "./Pages/Components/Header.js";
import Dietitian from "./Pages/Dietitian/Dietitian.js";
import Customer from "./Pages/Customer/Customer.js";
import NotFound from "./Pages/NotFound/NotFound.js";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/dietitian/:dID">
          <Header />
          <Dietitian />
        </Route>
        <Route path="/customer/:cID">
          <Header />
          <Customer />
        </Route>
        <Route>
          <Header />
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}
export default App;
