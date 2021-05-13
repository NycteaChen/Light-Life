import firebase from "firebase";
import "firebase/functions";
import { firebaseConfig } from "./firebaseConfig";
firebase.initializeApp(firebaseConfig);

const getDietitianData = () => {
  firebase.firestore();
};
