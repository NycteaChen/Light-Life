import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "firebase/auth";
import firebase from "firebase/app";

const config = {
  apiKey: "AIzaSyDWQ9x5T_LfnSKqiIQUMUOFvzrH4jB75N8",
  authDomain: "light-life-5fdaa.firebaseapp.com",
  projectId: "light-life-5fdaa",
  storageBucket: "light-life-5fdaa.appspot.com",
  messagingSenderId: "877092105937",
  appId: "1:877092105937:web:1363765ebc0ff241265ff0",
  measurementId: "G-GQVDFHW3BY",
};
// firebase.initializeApp(config);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
