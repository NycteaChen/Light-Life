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
import "../../style/target.scss";

function TargetHandler({ target, setTarget }) {
  const db = firebase.firestore();
  const [isEditing, setIsEditing] = useState(false);
  const [targetIndex, setTargetIndex] = useState(null);
  const [input, setInput] = useState({});
  const [date, setDate] = useState({});
  const pathName = useLocation().pathname;
  const params = useParams();

  const getInputHandler = (e) => {
    const { name } = e.target;
    if (name === "startDate") {
      const date = new Date();
      date.setDate(parseInt(e.target.value.split("-")[2]) + 1);
      setInput({
        ...input,
        [name]: e.target.value,
        endDate: date.toISOString().substr(0, 10),
      });
    } else {
      setInput({ ...input, [name]: e.target.value });
    }
  };
  // true會變?
  const bindEditHandler = (e) => {
    setIsEditing(true);
    setTargetIndex(e.target.id);
    console.log(targetIndex);
    console.log(e.target.id);
    // setInput(target[e.target.id]);
    setInput({});
    if (targetIndex !== e.target.id) {
      db.collection("dietitians")
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
          console.log("here");
        });
    } else {
      setInput({ ...input });
    }
    db.collection("dietitians")
      .doc(params.dID)
      .collection("customers")
      .doc(params.cID)
      .get()
      .then((doc) => setDate(doc.data()));
  };

  const bindRemoveTarget = (e) => {
    setTarget([
      ...target.filter((t, index) => index !== parseInt(e.target.id)),
    ]);
    db.collection("dietitians")
      .doc(params.dID)
      .collection("customers")
      .doc(params.cID)
      .collection("target")
      .get()
      .then((docs) => {
        const docsArray = [];
        docs.forEach((doc) => {
          docsArray.push(doc.id);
        });
        const getID = docsArray.find(
          (d, index) => index === parseInt(e.target.id)
        );
        return getID;
      })
      .then((res) => {
        console.log(input);
        db.collection("dietitians")
          .doc(params.dID)
          .collection("customers")
          .doc(params.cID)
          .collection("target")
          .doc(`${res}`)
          .delete()
          .then(() => {
            console.log("delete");
          })
          .catch((error) => {
            console.log("Error:", error);
          });
      });
  };

  const bindSaveHandler = (e) => {
    db.collection("dietitians")
      .doc(params.dID)
      .collection("customers")
      .doc(params.cID)
      .collection("target")
      .get()
      .then((docs) => {
        const docsArray = [];
        docs.forEach((doc) => {
          docsArray.push(doc.id);
        });
        const getID = docsArray.find((d, index) => index == e.target.id);
        return getID;
      })
      .then((res) => {
        console.log(input);
        db.collection("dietitians")
          .doc(params.dID)
          .collection("customers")
          .doc(params.cID)
          .collection("target")
          .doc(`${res}`)
          .update(input);
      })
      .then(() => {
        db.collection("dietitians")
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
      })
      .then(() => {
        setIsEditing(false);
      });
  };
  return (
    <>
      {isEditing
        ? target.map((t, index) =>
            index == targetIndex ? (
              <div key={index} class="customer-target">
                <div class="target-header">
                  <div class="alter-button">
                    <button onClick={bindSaveHandler} id={index}>
                      儲存
                    </button>
                    {/* <i class="fa fa-trash-o" aria-hidden="true"></i> */}
                    {/* <i class="fa fa-trash" aria-hidden="true"></i> */}
                  </div>
                  <div class="flexbox">
                    <div class="title">建立時間</div>
                    <div class="set-content">{t.addDate}</div>
                  </div>
                </div>

                <div class="col">
                  <div class="flexbox">
                    <div class="title">開始日期</div>
                    <input
                      type="date"
                      name="startDate"
                      min={date.startDate}
                      max={date.endDate}
                      value={input.startDate ? input.startDate : t.startDate}
                      onChange={getInputHandler}
                      class="set-content"
                    />
                  </div>
                  <div class="flexbox">
                    <div class="title">結束日期</div>
                    <input
                      type="date"
                      name="endDate"
                      min={input.endDate ? input.endDate : date.startDate}
                      max={date.endDate}
                      value={input.endDate ? input.endDate : t.endDate}
                      onChange={getInputHandler}
                      class="set-content"
                    />
                  </div>
                </div>

                <div class="col">
                  <div class="flexbox">
                    <div class="title">目標體重</div>
                    <div>
                      <input
                        type="text"
                        name="weight"
                        value={
                          input.weight || input.weight === ""
                            ? input.weight
                            : t.weight
                        }
                        onChange={getInputHandler}
                        class="set-content"
                      />
                    </div>
                  </div>
                  <div class="flexbox">
                    <div class="title">目標水分</div>
                    <div>
                      <input
                        type="text"
                        name="water"
                        value={
                          input.water || input.water === ""
                            ? input.water
                            : t.water
                        }
                        onChange={getInputHandler}
                        class="set-content"
                      />
                    </div>
                  </div>
                </div>
                <div class="flexbox">
                  <div class="title">其他</div>
                  <textarea
                    name="other"
                    value={
                      input.other || input.other === "" ? input.other : t.other
                    }
                    onChange={getInputHandler}
                    class="set-content"
                  ></textarea>
                </div>
              </div>
            ) : (
              <div key={index} className="customer-target">
                <div className="target-header">
                  <div className="alter-button">
                    <button onClick={bindEditHandler} id={index}>
                      編輯
                    </button>
                    <i
                      id={index}
                      className="fa fa-trash-o"
                      aria-hidden="true"
                      onClick={bindRemoveTarget}
                    ></i>
                  </div>
                  <div className="flexbox">
                    <div className="title">建立時間</div>
                    <div className="set-content">{t.addDate}</div>
                  </div>
                </div>
                <div className="col">
                  <div className="flexbox">
                    <div className="title">開始日期</div>
                    <div className="set-content">
                      {input.startDate ? input.startDate : t.startDate}
                    </div>
                  </div>
                  <div className="flexbox">
                    <div className="title">結束日期</div>
                    <div className="set-content">
                      {input.endDate ? input.endDate : t.endDate}
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="flexbox">
                    <div className="title">目標體重</div>
                    <div className="set-content">
                      {input.weight ? input.weight : t.weight} kg
                    </div>
                  </div>
                  <div className="flexbox">
                    <div className="title">目標水分</div>
                    <div className="set-content">
                      {input.water ? input.water : t.water} cc
                    </div>
                  </div>
                </div>
                <div className="flexbox">
                  <div className="title">其他</div>
                  <div className="set-content">
                    {input.other ? input.other : t.other}
                  </div>
                </div>
              </div>
            )
          )
        : target.map((t, index) =>
            index == targetIndex ? (
              <>
                <div key={index} className="customer-target">
                  <div className="target-header">
                    {pathName.includes("dietitian") ? (
                      <div className="alter-button">
                        <button onClick={bindEditHandler} id={index}>
                          編輯
                        </button>
                        <i
                          id={index}
                          className="fa fa-trash-o"
                          aria-hidden="true"
                          onClick={bindRemoveTarget}
                        ></i>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="flexbox">
                      <div className="title">建立時間</div>
                      <div className="set-content">{t.addDate}</div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="flexbox">
                      <div className="title">開始日期</div>
                      <div className="set-content">
                        {input.startDate ? input.startDate : t.startDate}
                      </div>
                    </div>
                    <div className="flexbox">
                      <div className="title">結束日期</div>
                      <div className="set-content">
                        {input.endDate ? input.endDate : t.endDate}
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="flexbox">
                      <div className="title">目標體重</div>
                      <div className="set-content">
                        {input.weight ? input.weight : t.weight} kg
                      </div>
                    </div>
                    <div className="flexbox">
                      <div className="title">目標水分</div>
                      <div className="set-content">
                        {input.water ? input.water : t.water} cc
                      </div>
                    </div>
                  </div>
                  <div className="flexbox">
                    <div className="title">其他</div>
                    <div className="set-content">
                      {input.other ? input.other : t.other}
                    </div>
                  </div>
                </div>
                {/* <div key={index}>
                {pathName.includes("dietitian") ? (
                  <>
                    <button onClick={bindEditHandler} id={index}>
                      編輯
                    </button>
                    <div onClick={bindRemoveTarget} id={index}>
                      X
                    </div>
                  </>
                ) : (
                  ""
                )}
                <div>
                  <div>
                    <div>
                      建立時間<span>{t.addDate}</span>
                    </div>
                  </div>
                  <div>
                    <div>日期</div>
                    <span>
                      {input.startDate ? input.startDate : t.startDate}
                    </span>
                    <span>至 </span>
                    <span>{input.endDate ? input.endDate : t.endDate}</span>
                  </div>
                </div>
                <div>
                  <div>目標體重</div>
                  <div>
                    <span>{input.weight ? input.weight : t.weight}</span>
                    kg
                  </div>
                </div>
                <div>
                  <div>目標水分</div>
                  <div>
                    <span>{input.water ? input.water : t.water}</span> cc
                  </div>
                </div>
                <div>
                  <div>其他 </div>
                  <div>
                    <span>{input.other ? input.other : t.other}</span>
                  </div>
                </div>
                <hr />
              </div> */}
              </>
            ) : (
              <div key={index} className="customer-target">
                <div className="target-header">
                  {pathName.includes("dietitian") ? (
                    <div className="alter-button">
                      <button onClick={bindEditHandler} id={index}>
                        編輯
                      </button>
                      <i
                        id={index}
                        className="fa fa-trash-o"
                        aria-hidden="true"
                        onClick={bindRemoveTarget}
                      ></i>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className="flexbox">
                    <div className="title">建立時間</div>
                    <div className="set-content">{t.addDate}</div>
                  </div>
                </div>
                <div className="col">
                  <div className="flexbox">
                    <div className="title">開始日期</div>
                    <div className="set-content">{t.startDate}</div>
                  </div>
                  <div className="flexbox">
                    <div className="title">結束日期</div>
                    <div className="set-content">{t.endDate}</div>
                  </div>
                </div>
                <div className="col">
                  <div className="flexbox">
                    <div className="title">目標體重</div>
                    <div className="set-content">{t.weight} kg</div>
                  </div>
                  <div className="flexbox">
                    <div className="title">目標水分</div>
                    <div className="set-content">{t.water} cc</div>
                  </div>
                </div>
                <div className="flexbox">
                  <div className="title">其他</div>
                  <div className="set-content">{t.other}</div>
                </div>
              </div>
            )
          )}
    </>
  );
}

export default TargetHandler;
