import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers } from "redux";
import { connect, Provider } from "react-redux";

const initState = {
  name: "Jack",
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const store = createStore(reducer);
