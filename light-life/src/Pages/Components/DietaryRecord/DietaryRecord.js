import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import { getMyCustomerData, getCustomerData } from "../../../utils/Firebase.js";
import DietitianRecord from "../../Dietitian/DietitianRecord/DietitianRecord.js";
import CustomerRecord from "../../Customer/CustomerRecord/CustomerRecord.js";
import style from "../../../style/dietary.module.scss";

function DietaryRecord() {
  const [recordDate, setRecordDate] = useState();
  const [getRecord, setGetRecord] = useState(false);
  const [count, setCount] = useState(1);
  const [serviceDate, setServiceDate] = useState({});
  const { dID } = useParams();
  const { cID } = useParams();
  useEffect(() => {
    getCustomerData(cID)
      .then((res) => {
        return res.data().dietitian;
      })
      .then((res) => {
        getMyCustomerData(res, cID).then((res) => {
          setServiceDate({
            startDate: res.data().startDate,
            endDate: res.data().endDate,
          });
        });
      });
  }, [cID, dID]);

  const getDietaryRecordDate = (e) => {
    if (e.target.value !== "") {
      setRecordDate(e.target.value);
      setCount(1);
      setGetRecord(true);
    }
  };
  return (
    <div className={style["daily-diet"]}>
      <div className={style["date-selector"]}>
        <h5>選擇飲食記錄日期</h5>
        <input
          type="date"
          min={serviceDate.startDate || ""}
          max={serviceDate.endDate || ""}
          onChange={getDietaryRecordDate}
        ></input>
      </div>
      {dID ? (
        <Router>
          <Link to={`/dietitian/${dID}/customer/${cID}/dietary/`}></Link>
          {getRecord ? (
            <Switch>
              <Route exact path={`/dietitian/:dID/customer/:cID/dietary/`}>
                <DietitianRecord
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
}

export default DietaryRecord;
