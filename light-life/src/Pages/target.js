import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
  useParams,
} from "react-router-dom";

function GetAddedTarget({ target }) {
  return (
    <>
      {target.map((t, index) => (
        <div key={index}>
          <div>
            <div>
              <div>日期</div>
              <div>
                建立時間<span>{t.addDate}</span>
              </div>
            </div>
            <div>
              <span>{t.startDate}</span>
              <span>至 </span>
              <span>{t.endDate}</span>
            </div>
          </div>
          <div>
            <div>目標體重</div>
            <div>
              <span>{t.weight}</span>
              kg
            </div>
          </div>
          <div>
            <div>目標水分</div>
            <div>
              <span>{t.water}</span> cc
            </div>
          </div>
          <div>
            <div>其他 </div>
            <div>
              <span>{t.other}</span>
            </div>
          </div>
          <hr />
        </div>
      ))}
    </>
  );
}

function DietitianTarget() {
  const params = useParams();
  const [date, setDate] = useState({});
  const [target, setTarget] = useState([]);
  const [input, setInput] = useState({});
  const [leastEndDate, setLeastEndDate] = useState(false);
  const today = new Date(+new Date() + 8 * 3600 * 1000);
  const initStartDate = today.toISOString().substr(0, 10);
  const db = firebase.firestore();

  useEffect(() => {
    firebase
      .firestore()
      .collection("dietitians")
      .doc(params.dID)
      .collection("customers")
      .doc(params.cID)
      .get()
      .then((doc) => setDate(doc.data()));
  }, []);

  useEffect(() => {
    firebase
      .firestore()
      .collection("dietitians")
      .doc(params.dID)
      .collection("customers")
      .doc(params.cID)
      .collection("target")
      .get()
      .then((docs) => {
        const targetArray = [];
        docs.forEach((doc) => {
          targetArray.push(doc.data());
        });
        setTarget(targetArray);
      });
  }, []);

  const bindChangeDateRange = (e) => {
    const date = new Date(+new Date() + 8 * 3600 * 1000);
    date.setDate(parseInt(e.target.value.split("-")[2]) + 1);
    setLeastEndDate(date.toISOString().substr(0, 10));
  };

  const getInputHandler = (e) => {
    const { name } = e.target;
    setInput({ ...input, [name]: e.target.value, addDate: initStartDate });
  };

  const bindAddTarget = () => {
    db.collection("dietitians")
      .doc(params.dID)
      .collection("customers")
      .doc(params.cID)
      .collection("target")
      .doc(`${initStartDate}`)
      .set(input)
      .catch((error) => {
        console.error("Error:", error);
      });
    target.map((t, index) =>
      t.addDate === initStartDate
        ? setTarget([...target.slice(0, index), input])
        : false
    );
  };

  return (
    <div id="dietitian-target">
      <h2>目標設定</h2>
      <h3>已設立目標</h3>
      <div id="customer-target">
        <GetAddedTarget target={target} />
      </div>
      <h3>新增目標</h3>
      <label>
        時間範圍
        <input
          type="date"
          id="target-start"
          name="startDate"
          min={initStartDate}
          max={date.endDate ? `${date.endDate}` : ""}
          onChange={(e) => {
            bindChangeDateRange(e);
            getInputHandler(e);
          }}
        />
      </label>
      <label>
        至
        <input
          type="date"
          id="target-end"
          name="endDate"
          min={leastEndDate ? leastEndDate : initStartDate}
          max={date.endDate ? `${date.endDate}` : ""}
          onChange={getInputHandler}
        />
      </label>
      <div>
        <label>
          目標體重
          <input type="text" name="weight" onChange={getInputHandler} />
          kg
        </label>
      </div>
      <div>
        <label>
          目標水分
          <input type="text" name="water" onChange={getInputHandler} />
          cc
        </label>
      </div>
      <div>
        <label>
          其他
          <input type="textarea" name="other" onChange={getInputHandler} />
        </label>
      </div>
      <button onClick={bindAddTarget}>新增</button>
    </div>
  );
}

function CustomerTarget() {
  const [target, setTarget] = useState([]);
  const params = useParams();

  useEffect(() => {
    firebase
      .firestore()
      .collection("customers")
      .doc(params.cID)
      .get()
      .then((doc) => {
        return doc.data().dietitian;
      })
      .then((res) => {
        firebase
          .firestore()
          .collection("dietitians")
          .doc(res)
          .collection("customers")
          .doc(params.cID)
          .collection("target")
          .get()
          .then((docs) => {
            const targetArray = [];
            docs.forEach((doc) => {
              targetArray.push(doc.data());
            });
            setTarget(targetArray);
          });
      });
  }, []);

  return (
    <>
      <div id="dietitian-target">
        <h2>目標設定</h2>
        <h3>已設立目標</h3>
        <div id="customer-target">
          <GetAddedTarget target={target} />
        </div>
      </div>
    </>
  );
}

function RenderTarget() {
  const pathName = useLocation().pathname;
  if (pathName.includes("dietitian")) {
    return <DietitianTarget />;
  } else {
    return <CustomerTarget />;
  }
}

export default RenderTarget;
