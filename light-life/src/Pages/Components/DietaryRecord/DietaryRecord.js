import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  useParams,
} from "react-router-dom";
import "firebase/firestore";
import DietitianRecord from "./DietitianRecord.js";
import CustomerRecord from "./CustomerRecord.js";
import style from "../../../style/dietary.module.scss";
// function ShowImages({ mealDetails, input, removeImageHandler }) {
//   if (!input.images) {
//     return (
//       <>
//         {mealDetails.images.map((i, index) => (
//           <div key={index}>
//             <div id={index} onClick={removeImageHandler}>
//               X
//             </div>
//             <a href={i} target="_blank" rel="noreferrer noopener">
//               <img
//                 src={i}
//                 alt="customer"
//                 style={{ width: "200px", height: "200px" }}
//               />
//             </a>
//           </div>
//         ))}
//         {input.imageUrl.map((i, index) => (
//           <div key={index}>
//             <a href={i} target="_blank" rel="noreferrer noopener">
//               <img
//                 src={i}
//                 alt="customer"
//                 style={{ width: "200px", height: "200px" }}
//               />
//             </a>
//           </div>
//         ))}
//       </>
//     );
//   } else {
//     return (
//       <>
//         {input.images.map((i, index) => (
//           <div key={index}>
//             <div id={index} onClick={removeImageHandler}>
//               X
//             </div>
//             <a href={i} target="_blank" rel="noreferrer noopener">
//               <img
//                 src={i}
//                 alt="customer"
//                 style={{ width: "200px", height: "200px" }}
//               />
//             </a>
//           </div>
//         ))}
//         {input.imageUrl.map((i, index) => (
//           <div key={index}>
//             <a href={i} target="_blank" rel="noreferrer noopener">
//               <img
//                 src={i}
//                 alt="customer"
//                 style={{ width: "200px", height: "200px" }}
//               />
//             </a>
//           </div>
//         ))}
//       </>
//     );
//   }
// }

function RenderDietaryRecord() {
  const [recordDate, setRecordDate] = useState();
  const [getRecord, setGetRecord] = useState(false); //false
  const [count, setCount] = useState(1);
  const [serviceDate, setServiceDate] = useState(null);
  const { dID } = useParams();
  const { cID } = useParams();
  const today = new Date(+new Date() + 8 * 3600 * 1000)
    .toISOString()
    .substr(0, 10);
  useEffect(() => {
    if (dID) {
      firebase
        .firestore()
        .collection("dietitians")
        .doc(dID)
        .collection("customers")
        .doc(cID)
        .get()
        .then((res) => {
          setServiceDate({
            startDate: res.data().startDate,
            endDate: res.data().endDate,
          });
        });
    }
  }, []);

  const getDietaryRecordDate = (e) => {
    if (e.target.value !== "") {
      setRecordDate(e.target.value);
      setCount(1);
      setGetRecord(true);
    }
  };
  // if (dID) {
  return (
    <div className={style["daily-diet"]}>
      <div className={style["date-selector"]}>
        <h5>選擇飲食記錄日期</h5>
        {dID ? (
          <input
            type="date"
            min={serviceDate ? serviceDate.startDate : ""}
            max={serviceDate ? serviceDate.endDate : ""}
            onChange={getDietaryRecordDate}
          ></input>
        ) : (
          <input type="date" max={today} onChange={getDietaryRecordDate} />
        )}
      </div>
      {dID ? (
        <Router>
          <Link to={`/dietitian/${dID}/customer/${cID}/dietary/`}></Link>
          {getRecord ? (
            <Switch>
              <Route exact path={`/dietitian/:dID/customer/:cID/dietary/`}>
                <DietitianRecord date={recordDate} />
              </Route>
            </Switch>
          ) : (
            ""
          )}
        </Router>
      ) : (
        <Router>
          <Link to={`/customer/${cID}/dietary/`}></Link>
          {getRecord ? (
            <Switch>
              <Route exact path="/customer/:cID/dietary/">
                <CustomerRecord
                  date={recordDate}
                  count={count}
                  setCount={setCount}
                />
              </Route>
            </Switch>
          ) : (
            ""
          )}
        </Router>
      )}
    </div>
  );
  // } else {
  //   return (
  //     <div className={style["daily-diet"]}>
  //       <div className={style["date-selector"]}>
  //         <input
  //           type="date"
  //           min="2021-05-14"
  //           max="2021-05-26"
  //           onChange={getDietaryRecordDate}
  //           required="required"
  //         ></input>
  //       </div>

  //     </div>
  //   );
  // }
}

export default RenderDietaryRecord;
