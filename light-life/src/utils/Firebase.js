import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/functions";
import "firebase/auth";
import firebaseConfig from "../FirebaseConfig";
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const refDietitians = db.collection("dietitians");
const refCustomers = db.collection("customers");
const refPending = db.collection("pending");
const refPublish = db.collection("publish");
const refReserve = db.collection("reserve");

// 上傳照片
export async function getImg(image, ref) {
  if (image) {
    const imageName = image.name;
    const imageStorageRef = storage.ref(`${ref}/` + imageName);
    await imageStorageRef.put(image);
    const storageRef = storage.ref();
    const pathRef = await storageRef
      .child(`${ref}/` + imageName)
      .getDownloadURL();
    console.log(pathRef);
    return await pathRef;
  } else {
    return "";
  }
}

// 註冊
export function signUp(email, password) {
  return auth.createUserWithEmailAndPassword(email, password);
}

// 第三方
export function providerHandler(provider) {
  if (provider === "google") {
    return new firebase.auth.GoogleAuthProvider();
  } else if (provider === "facebook") {
    return new firebase.auth.FacebookAuthProvider();
  }
}

// 登出
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

// 寄信
export function sendPasswordEmail(email) {
  return auth.sendPasswordResetEmail(email);
}

// 登入
export function normalLoginHandler(email, password) {
  return auth.signInWithEmailAndPassword(email, password);
}

export function providerLogin(provider) {
  return auth.signInWithPopup(provider);
}

//判定用戶
export function authState(client, history, id, callback) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      if (client === "dietitians") {
        refDietitians
          .where("email", "==", user.email)
          .get()
          .then((docs) => {
            if (!docs.empty) {
              docs.forEach((doc) => {
                if (doc.data().id !== id && id.length === 20) {
                  history.push("/");
                } else if (doc.data().id !== id) {
                  callback(true);
                }
              });
            } else {
              history.push("/");
            }
          });
      } else {
        refCustomers
          .where("email", "==", user.email)
          .get()
          .then((docs) => {
            if (!docs.empty) {
              docs.forEach((doc) => {
                if (doc.data().id !== id && id.length === 20) {
                  history.push("/");
                } else if (doc.data().id !== id) {
                  callback(true);
                }
              });
            } else {
              history.push("/");
            }
          });
      }
    } else {
      history.push("/");
    }
  });
}

export function onAuth() {
  return auth;
}

export function getUserWithEmail(client, email) {
  if (client === "dietitians") {
    return refDietitians.where("email", "==", email).get();
  } else if (client === "customers") {
    return refCustomers.where("email", "==", email).get();
  } else {
    return db.collection(`${client}s`).where("email", "==", email).get();
  }
}

export function initProfileData(client) {
  return db.collection(`${client}s`);
}

// 所有營養師
export function getDietitiansData() {
  return refDietitians.get();
}

// 單一營養師
export function getDietitianData(dID) {
  return refDietitians.doc(dID).get();
}

// 營養師個人資料更新
export function updateDietitianData(id, update) {
  return refDietitians.doc(id).update(update);
}

// 營養師的特定顧客
export function getMyCustomerData(dID, cID) {
  return refDietitians.doc(dID).collection("customers").doc(cID).get();
}

export function setMyCustomerData(dID, cID, set) {
  return refDietitians.doc(dID).collection("customers").doc(cID).set(set);
}

// 所有客戶
export function getCustomersData() {
  return refCustomers.get();
}

// 客戶共同營養師
export function getTheSameDietitian(dID) {
  return refCustomers.where("dietitian", "==", dID).get();
}

// 單一客戶
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

export function setCustomerDiet(dID, cID, date, set) {
  return refDietitians
    .doc(dID)
    .collection("customers")
    .doc(cID)
    .collection("diet")
    .doc(date)
    .set(set, { merge: true });
}

// 目標
export function getTargetData(dID, cID) {
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

export function setTargetData(dID, cID, res, input) {
  return refDietitians
    .doc(dID)
    .collection("customers")
    .doc(cID)
    .collection("target")
    .doc(`${res}`)
    .set(input)
    .catch((error) => console.error("Error:", error));
}

// 待辦
export function addPending(add) {
  return refPending.add(add);
}

export function updatePendingID(id) {
  return refPending.doc(id).update("id", id);
}

export function getPendingData(client, id) {
  return refPending.where(client, "==", id).get();
}

export function deletePending(id) {
  return refPending.doc(id).delete();
}

// 刊登
export function setPublicationData(id, set, merge) {
  if (merge === true) {
    return refPublish.doc(id).set(set, { merge: true });
  } else {
    return refPublish.doc(id).set(set);
  }
}

export function addPublication(input) {
  return refPublish.add(input);
}

export function updatePublication(id, update) {
  return refPublish.doc(id).update(update);
}

export function getPublicationData() {
  return refPublish.get();
}

export function getCustomerPublish(cID) {
  return refPublish.where("id", "==", cID).get();
}

export function deletePublication(id) {
  return refPublish.doc(id).delete();
}

// 預約
export function getReserveData() {
  return refReserve.get();
}

export function getCustomerReserve(client, id) {
  return refReserve.where(client, "==", id).get();
}

export function updateReserve(id, update) {
  return refReserve.doc(id).update(update);
}

export function setReservation(id, set) {
  return refReserve.doc(`${id}`).set(set);
}

export function deleteReserve(id) {
  return refReserve.doc(id).delete();
}
