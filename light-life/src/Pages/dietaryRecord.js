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

function DietitianRecord() {
  return (
    <>
      <div id="dietitian-daily-diet">
        <h2>今日飲食記錄</h2>
        <div className="breakfast">
          <div>
            <span>早餐</span>
            <button>儲存</button>
          </div>
          <div className="diet-record">
            <div>
              進食時間 <span id="eat-time"></span>
            </div>
            <div>
              <div>照片記錄</div>
              <img src="" style={{ width: "200px" }} alt="meal" />
            </div>
            <div>
              <div>飲食內容</div>
              <div>sample</div>
            </div>
          </div>
          <table className="dietitian-record">
            <thead>
              <tr>
                <th>品項</th>
                <th>單位:100g</th>
                <th>熱量</th>
                <th>蛋白質</th>
                <th>脂質</th>
                <th>碳水化合物</th>
                <th>膳食纖維</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>牛肉</th>
                <th>
                  <input type="number" min="0" defaultValue="0" />
                </th>
                <th>
                  <input type="number" min="0" defaultValue="0" />
                </th>
                <th>
                  <input type="number" min="0" defaultValue="0" />
                </th>
                <th>
                  <input type="number" min="0" defaultValue="0" />
                </th>
                <th>
                  <input type="number" min="0" defaultValue="0" />
                </th>
                <th>
                  <input type="number" min="0" defaultValue="0" />
                </th>
              </tr>
              <tr>
                <th>
                  <input type="text" placeholder="請輸入食材"></input>
                </th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>+</th>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="morning-snack">
          <div>
            <span>早點</span>
            <button>儲存</button>
          </div>
        </div>
        <div className="lunch">
          <div>
            <span>午餐</span>
            <button>儲存</button>
          </div>
        </div>
        <div className="afternoon-snack">
          <div>
            <span>午點</span>
            <button>儲存</button>
          </div>
        </div>
        <div className="dinner">
          <div>
            <span>晚餐</span>
            <button>儲存</button>
          </div>
        </div>
        <div className="night-snack">
          <div>
            <span>晚點</span>
            <button>儲存</button>
          </div>
        </div>
      </div>
    </>
  );
}

function CustomerRecord({ date }) {
  console.log(date);
  return (
    <>
      <div id="dietitian-daily-diet">
        <h2>{date}飲食記錄</h2>
        <div className="breakfast">
          <div>早餐</div>
          <div className="diet-record">
            <label>
              進食時間 <input type="textarea" placeholder="8:00~8:30" />
            </label>
            <div>
              <div>照片記錄</div>
              <input type="file" accept="image/*" id="image" />
              <input type="file" accept="image/*" id="image" />
            </div>
            <div>
              <div>請描述飲食內容，越完整越好</div>
              <input type="textarea" />
            </div>
            <button>儲存</button>
          </div>
          <table className="dietitian-record">
            <thead>
              <tr>
                <th>品項</th>
                <th>單位:100g</th>
                <th>熱量</th>
                <th>蛋白質</th>
                <th>脂質</th>
                <th>碳水化合物</th>
                <th>膳食纖維</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>牛肉</th>
                <th>0</th>
                <th>0</th>
                <th>0</th>
                <th>0</th>
                <th>0</th>
                <th>0</th>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="morning-snack">
          <div>早點</div>
        </div>
        <div className="lunch">
          <div>午餐</div>
        </div>
        <div className="afternoon-snack">
          <div>午點</div>
        </div>
        <div className="dinner">
          <div>晚餐</div>
        </div>
        <div className="night-snack">
          <div>晚點</div>
        </div>
      </div>
    </>
  );
}

function Analsis() {
  const pathName = useLocation().pathname;

  return (
    <>
      <div id="diet-analysis">
        <h2>今日飲食分析</h2>
        <table>
          <thead>
            <tr id="table-title">
              <th>　　</th>
              <th>熱量 (kcal)</th>
              <th>蛋白質 (g)</th>
              <th>脂質 (g)</th>
              <th>碳水化合物 (g)</th>
              <th>膳食纖維 (g)</th>
            </tr>
          </thead>
          <tbody>
            <tr id="breakfast">
              <th>早餐</th>
              <th className="calories"></th>
              <th className="protein"></th>
              <th className="fat"></th>
              <th className="carbohydrate"></th>
              <th className="dietary-fiber"></th>
            </tr>
            <tr id="morning-snack">
              <th>早點</th>
              <th className="calories"></th>
              <th className="protein"></th>
              <th className="fat"></th>
              <th className="carbohydrate"></th>
              <th className="dietary-fiber"></th>
            </tr>
            <tr id="lunch">
              <th>午餐</th>
              <th className="calories"></th>
              <th className="protein"></th>
              <th className="fat"></th>
              <th className="carbohydrate"></th>
              <th className="dietary-fiber"></th>
            </tr>
            <tr id="afternoon-snack">
              <th>午點</th>
              <th className="calories"></th>
              <th className="protein"></th>
              <th className="fat"></th>
              <th className="carbohydrate"></th>
              <th className="dietary-fiber"></th>
            </tr>
            <tr id="dinner">
              <th>晚餐</th>
              <th className="calories"></th>
              <th className="protein"></th>
              <th className="fat"></th>
              <th className="carbohydrate"></th>
              <th className="dietary-fiber"></th>
            </tr>
            <tr id="night-snack">
              <th>晚點</th>
              <th className="calories"></th>
              <th className="protein"></th>
              <th className="fat"></th>
              <th className="carbohydrate"></th>
              <th className="dietary-fiber"></th>
            </tr>
            <tr id="table-total">
              <th>總和</th>
              <th className="total-calories"></th>
              <th className="total-protein"></th>
              <th className="total-fat"></th>
              <th className="total-carbohydrate"></th>
            </tr>
            <tr id="target">
              <th>目標</th>
              <th className="target-calories"></th>
              <th className="target-protein"></th>
              <th className="target-fat"></th>
              <th className="target-carbohydrate"></th>
            </tr>
            <tr id="resr">
              <th>剩餘</th>
              <th className="rest-calories"></th>
              <th className="rest-protein"></th>
              <th className="rest-fat"></th>
              <th className="rest-carbohydrate"></th>
            </tr>
          </tbody>
        </table>
        {pathName.includes("dietitian") ? (
          <div>
            <label>
              給予建議
              <input type="textarea" />
            </label>
          </div>
        ) : (
          <div>
            <div>營養師建議</div>
            <div id="advice"></div>
          </div>
        )}
      </div>
    </>
  );
}

function RenderDietaryRecord({ props }) {
  const [recordDate, setRecordDate] = useState();
  const [getRecord, setGetRecord] = useState(false);
  const pathName = useLocation().pathname;
  const params = useParams();
  // useEffect(() => {
  //   if (params.dID) {
  //     firebase
  //       .firestore()
  //       .collection("dietitians")
  //       .doc(dID)
  //       .get()
  //       .then((doc) => console.log(doc));
  //   } else if (params.cID) {
  //     firebase
  //       .firestore()
  //       .collection("customers")
  //       .doc(params.cID)
  //       .get()
  //       .then((doc) => console.log(doc));
  //   }
  // });
  console.log(params);
  const getDietaryRecordDate = (e) => {
    console.log(e.target.value);
    if (e.target.value !== "") {
      setRecordDate(e.target.value);
      setGetRecord(true);
    }
  };

  if (pathName.includes("dietitian")) {
    return (
      <>
        <input
          type="date"
          min="2021-05-14"
          max="2021-05-26"
          onChange={getDietaryRecordDate}
          required="required"
        ></input>
        <Router>
          <Link
            to={`/dietitian/${props.dietitian}/customer/${props.id}/dietary/`}
          ></Link>
          <Switch>
            <Route exact path={`/dietitian/:dID/customer/:cID/dietary/`}>
              <DietitianRecord />
              <hr />
              <Analsis />
              <hr />
              <button>儲存</button>
            </Route>
          </Switch>
        </Router>
      </>
    );
  } else {
    return (
      <>
        <input
          type="date"
          min="2021-05-14"
          max="2021-05-26"
          onChange={getDietaryRecordDate}
          required="required"
        ></input>
        <Router>
          <Link to={`/customer/${props.id}/dietary/`}></Link>
          {getRecord ? (
            <Switch>
              <Route exact path="/customer/:cID/dietary/">
                <CustomerRecord date={recordDate} />
                <hr />
                <Analsis />
                <hr />
              </Route>
            </Switch>
          ) : (
            ""
          )}
        </Router>
      </>
    );
  }
}

export default RenderDietaryRecord;
