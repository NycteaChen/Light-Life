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

export function logout() {
  auth
    .signOut()
    .then(() => {
      window.location.href = "/";
    })
    .catch(function (error) {
      console.log(error.message);
    });
}

export function getDietitiansData() {
  refDietitians.get().then((docs) => {});
}

export function getMyCustomerData(dID, cID) {
  return refDietitians.doc(dID).collection("customers").doc(cID).get();
}

export function getCustomerData(id) {
  return refCustomers.doc(id).get();
}

// 客戶個人資料更新
export function updateCustomerData(id, update) {
  return refCustomers.doc(id).update(update);
}

// 飲食記錄資料
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

// 目標
export function getTargetDate(dID, cID) {
  return refDietitians
    .doc(dID)
    .collection("customers")
    .doc(cID)
    .collection("target")
    .get();
}

export function deleteTarget(dID, cID, res) {
  return refDietitians
    .doc(dID)
    .collection("customers")
    .doc(cID)
    .collection("target")
    .doc(`${res}`)
    .delete()
    .then(() => console.log("delete"))
    .catch((error) => console.log("Error:", error));
}

export function updateTarget(dID, cID, res, input) {
  return refDietitians
    .doc(dID)
    .collection("customers")
    .doc(cID)
    .collection("target")
    .doc(`${res}`)
    .update(input);
}
