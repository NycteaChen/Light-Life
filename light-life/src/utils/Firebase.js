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

export function getMyCustomerData(dID, cID) {
  return refDietitians.doc(dID).collection("customers").doc(cID).get();
}

export function getCustomerData(id) {
  return refCustomers.doc(id).get();
}

export function updateCustomerData(id, update) {
  return refCustomers.doc(id).update(update);
}

export function getDietData(dID, cID, date) {
  return refDietitians
    .doc(dID)
    .collection("customers")
    .doc(cID)
    .collection("diet")
    .doc(date)
    .get();
}

export function updateDietAdvice(dID, cID, date, advice) {
  return refDietitians
    .doc(dID)
    .collection("customers")
    .doc(cID)
    .collection("diet")
    .doc(date)
    .update(advice);
}

export function updateCustomerDiet(dID, cID, date, set) {
  return refDietitians
    .doc(dID)
    .collection("customers")
    .doc(cID)
    .collection("diet")
    .doc(date)
    .set(set, { merge: true });
}
