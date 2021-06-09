import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import Swal from "sweetalert2";
import style from "../../style/target.module.scss";

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
      date.setDate(+e.target.value.split("-")[2] + 1);
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
    Swal.fire({
      text: "確定刪除嗎?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "取消",
      confirmButtonText: "確定",
      confirmButtonColor: "#1e4d4e",
    }).then((res) => {
      if (res.isConfirmed) {
        setTargetIndex(e.target.id);
        setTarget([...target.filter((t, index) => index !== +e.target.id)]);
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
            const getID = docsArray.find((d, index) => index === +e.target.id);
            return getID;
          })
          .then((res) => {
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
      }
    });
  };

  const bindSaveHandler = (e) => {
    console.log(e.target.id);
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
        const getID = docsArray.find((d, index) => index === +e.target.id);
        return getID;
      })
      .then((res) => {
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
            index === +targetIndex ? (
              <div key={index} className={style["customer-target"]}>
                <div className={style["target-header"]}>
                  <div className={style["alter-button"]}>
                    <button onClick={bindSaveHandler} id={index}>
                      <i
                        class="fa fa-floppy-o"
                        aria-hidden="true"
                        id={index}
                      ></i>
                    </button>
                    {/* <i className="fa fa-trash-o" aria-hidden="true"></i> */}
                    {/* <i className="fa fa-trash" aria-hidden="true"></i> */}
                  </div>
                  <div className={style.flexbox}>
                    <div className={style.title}>建立時間</div>
                    <div className={style["set-content"]}>{t.addDate}</div>
                  </div>
                </div>

                <div className={style.col}>
                  <div className={style.flexbox}>
                    <div className={style.title}>開始日期</div>
                    <input
                      type="date"
                      name="startDate"
                      min={date.startDate}
                      max={date.endDate}
                      value={input.startDate ? input.startDate : t.startDate}
                      onChange={getInputHandler}
                      className={style["set-content"]}
                    />
                  </div>
                  <div className={style.flexbox}>
                    <div className={style.title}>結束日期</div>
                    <input
                      type="date"
                      name="endDate"
                      min={input.endDate ? input.endDate : date.startDate}
                      max={date.endDate}
                      value={input.endDate ? input.endDate : t.endDate}
                      onChange={getInputHandler}
                      className={style["set-content"]}
                    />
                  </div>
                </div>

                <div className={style.col}>
                  <div className={style.flexbox}>
                    <div className={style.title}>目標體重</div>
                    <div>
                      <input
                        type="number"
                        name="weight"
                        value={
                          input.weight || input.weight === ""
                            ? input.weight
                            : t.weight
                        }
                        onChange={getInputHandler}
                        className={style["set-content"]}
                      />
                    </div>
                  </div>
                  <div className={style.flexbox}>
                    <div className={style.title}>目標水分</div>
                    <div>
                      <input
                        type="number"
                        name="water"
                        value={
                          input.water || input.water === ""
                            ? input.water
                            : t.water
                        }
                        onChange={getInputHandler}
                        className={style["set-content"]}
                      />
                    </div>
                  </div>
                </div>
                <div className={style.flexbox}>
                  <div className={style.title}>其他</div>
                  <textarea
                    name="other"
                    value={
                      input.other || input.other === "" ? input.other : t.other
                    }
                    onChange={getInputHandler}
                    className={style["set-content"]}
                  ></textarea>
                </div>
              </div>
            ) : (
              <div key={index} className={style["customer-target"]}>
                <div className={style["target-header"]}>
                  <div className={style["alter-button"]}>
                    <button onClick={bindEditHandler} id={index}>
                      <i
                        class="fa fa-pencil"
                        aria-hidden="true"
                        id={index}
                        onClick={bindEditHandler}
                      ></i>
                    </button>
                    <button onClick={bindRemoveTarget} id={index}>
                      <i
                        id={index}
                        className="fa fa-trash-o"
                        aria-hidden="true"
                        onClick={bindRemoveTarget}
                      ></i>
                    </button>
                  </div>
                  <div className={style.flexbox}>
                    <div className={style.title}>建立時間</div>
                    <div className={style["set-content"]}>{t.addDate}</div>
                  </div>
                </div>
                <div className={style.col}>
                  <div className={style.flexbox}>
                    <div className={style.title}>開始日期</div>
                    <div className={style["set-content"]}>{t.startDate}</div>
                  </div>
                  <div className={style.flexbox}>
                    <div className={style.title}>結束日期</div>
                    <div className={style["set-content"]}>{t.endDate}</div>
                  </div>
                </div>
                <div className={style.col}>
                  <div className={style.flexbox}>
                    <div className={style.title}>目標體重</div>
                    <div className={style["set-content"]}>{t.weight} kg</div>
                  </div>
                  <div className={style.flexbox}>
                    <div className={style.title}>目標水分</div>
                    <div className={style["set-content"]}>{t.water} cc</div>
                  </div>
                </div>
                <div className={style.flexbox}>
                  <div className={style.title}>其他</div>
                  <div className={style["set-content"]}>{t.other}</div>
                </div>
              </div>
            )
          )
        : target.map((t, index) =>
            index === +targetIndex ? (
              <>
                <div key={index} className={style["customer-target"]}>
                  <div className={style["target-header"]}>
                    {pathName.includes("dietitian") ? (
                      <div className={style["alter-button"]}>
                        <button onClick={bindEditHandler} id={index}>
                          <i
                            class="fa fa-pencil"
                            aria-hidden="true"
                            id={index}
                            onClick={bindEditHandler}
                          ></i>
                        </button>
                        <button onClick={bindRemoveTarget} id={index}>
                          <i
                            id={index}
                            className="fa fa-trash-o"
                            aria-hidden="true"
                            onClick={bindRemoveTarget}
                          ></i>
                        </button>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className={style.flexbox}>
                      <div className={style.title}>建立時間</div>
                      <div className={style["set-content"]}>{t.addDate}</div>
                    </div>
                  </div>
                  <div className={style.col}>
                    <div className={style.flexbox}>
                      <div className={style.title}>開始日期</div>
                      <div className={style["set-content"]}>
                        {input.startDate ? input.startDate : t.startDate}
                      </div>
                    </div>
                    <div className={style.flexbox}>
                      <div className={style.title}>結束日期</div>
                      <div className={style["set-content"]}>
                        {input.endDate ? input.endDate : t.endDate}
                      </div>
                    </div>
                  </div>
                  <div className={style.col}>
                    <div className={style.flexbox}>
                      <div className={style.title}>目標體重</div>
                      <div className={style["set-content"]}>
                        {input.weight ? input.weight : t.weight} kg
                      </div>
                    </div>
                    <div className={style.flexbox}>
                      <div className={style.title}>目標水分</div>
                      <div className={style["set-content"]}>
                        {input.water ? input.water : t.water} cc
                      </div>
                    </div>
                  </div>
                  <div className={style.flexbox}>
                    <div className={style.title}>其他</div>
                    <div className={style["set-content"]}>
                      {input.other ? input.other : t.other}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div key={index} className={style["customer-target"]}>
                <div className={style["target-header"]}>
                  {pathName.includes("dietitian") ? (
                    <div className={style["alter-button"]}>
                      <button onClick={bindEditHandler} id={index}>
                        <i
                          class="fa fa-pencil"
                          aria-hidden="true"
                          id={index}
                          onClick={bindEditHandler}
                        ></i>
                      </button>
                      <button onClick={bindRemoveTarget} id={index}>
                        <i
                          id={index}
                          className="fa fa-trash-o"
                          aria-hidden="true"
                          onClick={bindRemoveTarget}
                        ></i>
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                  <div className={style.flexbox}>
                    <div className={style.title}>建立時間</div>
                    <div className={style["set-content"]}>{t.addDate}</div>
                  </div>
                </div>
                <div className={style.col}>
                  <div className={style.flexbox}>
                    <div className={style.title}>開始日期</div>
                    <div className={style["set-content"]}>{t.startDate}</div>
                  </div>
                  <div className={style.flexbox}>
                    <div className={style.title}>結束日期</div>
                    <div className={style["set-content"]}>{t.endDate}</div>
                  </div>
                </div>
                <div className={style.col}>
                  <div className={style.flexbox}>
                    <div className={style.title}>目標體重</div>
                    <div className={style["set-content"]}>{t.weight} kg</div>
                  </div>
                  <div className={style.flexbox}>
                    <div className={style.title}>目標水分</div>
                    <div className={style["set-content"]}>{t.water} cc</div>
                  </div>
                </div>
                <div className={style.flexbox}>
                  <div className={style.title}>其他</div>
                  <div className={style["set-content"]}>{t.other}</div>
                </div>
              </div>
            )
          )}
    </>
  );
}

export default TargetHandler;
