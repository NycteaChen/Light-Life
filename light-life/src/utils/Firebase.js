import firebase from "firebase";
import "firebase/functions";
import firebaseConfig from "../FirebaseConfig";
firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();
let auth = firebase.auth();
let refDietitians = db.collection("dietitians");
let refCustomers = db.collection("customers");
let refPending = db.collection("pending");
let refPublish = db.collection("publish");
let refReserve = db.collection("reserve");

export function getDietitiansData() {
  refDietitians.get().then((docs) => {});
}

export function getCustomerData(id) {
  return refCustomers.doc(id).get();
}

export function updateCustomerData(id, update) {
  return refCustomers.doc(id).update(update);
}
