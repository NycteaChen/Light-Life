import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCustomerPublish,
  updatePublication,
  getCustomerData,
  deletePublication,
  addPublication,
} from "../../../utils/Firebase.js";
import {
  newEndDateRangeHandler,
  dateToISOString,
  transDateToTime,
  getToday,
  setDateHandler,
} from "../../../utils/DatePicker.js";
import Swal from "sweetalert2";
import style from "../../../style/publish.module.scss";
import image from "../../../style/image.module.scss";
import Invited from "./Invited.js";
import spinner from "../../../images/loading.gif";
import nothing from "../../../images/nothing.svg";

function Publish({ reserve, pending, setPending }) {
  const { cID } = useParams();
  const [display, setDisplay] = useState("none");
  const [profile, setProfile] = useState({});
  const [publishData, setPublishData] = useState(null);
  const [oldPublish, setOldPublish] = useState(null);
  const [idx, setIdx] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [input, setInput] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [occupationTime, setOccupationTime] = useState([]);
  const [spinnerDisplay, setSpinnerDisplay] = useState("inline-block");
  const initStartDate = setDateHandler(1);
  const endLessDate = setDateHandler(7);
  const endMostDate = setDateHandler(14);
  const startMostDate = setDateHandler(21);

  useEffect(() => {
    getCustomerPublish(cID).then((docs) => {
      const occupation = reserve
        .filter((r) => r.status === "0" || r.status === "1")
        .map((u) => [
          transDateToTime(u.reserveStartDate),
          transDateToTime(u.reserveEndDate),
        ]);
      if (!docs.empty) {
        let publishObject = {};
        const oldPublishArray = [];
        docs.forEach((doc) => {
          if (doc.data().status === "1" || doc.data().status === "0") {
            occupation.push([
              transDateToTime(doc.data().startDate),
              transDateToTime(doc.data().endDate),
            ]);
          }
          const startDate = transDateToTime(doc.data().startDate);
          if (startDate > getToday() && doc.data().status === "0") {
            publishObject = doc.data();
          } else if (startDate <= getToday() && doc.data().status === "0") {
            const oldPublishData = doc.data();
            oldPublishData.status = "3";
            oldPublishArray.push(oldPublishData);
            updatePublication(doc.data().publishID, oldPublishData);
          } else {
            oldPublishArray.push(doc.data());
          }
        });
        setOccupationTime(occupation);
        setOldPublish(oldPublishArray);
        setPublishData(publishObject);
      } else {
        setOccupationTime(occupation);
        setPublishData([]);
        setOldPublish([]);
      }
    });
    getCustomerData(cID).then((res) => setProfile(res.data()));
    setStartDate({
      min: dateToISOString(initStartDate),
      max: dateToISOString(startMostDate),
    });
    setEndDate({
      min: dateToISOString(endLessDate),
      max: dateToISOString(endMostDate),
    });
  }, [reserve]); //eslint-disable-line

  useEffect(() => {
    if (publishData && oldPublish) {
      setSpinnerDisplay("none");
    }
  }, []); //eslint-disable-line

  const publishModalHandler = (e) => {
    switch (e.target.title) {
      case "add":
        if (!publishData.status) {
          setDisplay("block");
        } else {
          Swal.fire({
            text: "目前已經有刊登囉",
            confirmButtonText: "確定",
            confirmButtonColor: "#1e4d4e",
          });
        }
        break;
      case "remove":
        if (publishData.status) {
          Swal.fire({
            text: "確定移除刊登嗎?",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "取消",
            confirmButtonText: "確定",
            confirmButtonColor: "#1e4d4e",
          }).then((res) => {
            if (res.isConfirmed) {
              deletePublication(publishData.publishID).then(() => {
                setPublishData([]);
              });
            }
          });
        } else {
          Swal.fire({
            text: "沒有刊登可以移除",
            confirmButtonText: "確定",
            confirmButtonColor: "#1e4d4e",
          });
        }
        break;
      case "cancel":
        setInput({});
        setDisplay("none");
        break;
      default:
        break;
    }
  };

  const checkDietitianDetails = (e) => {
    setIdx(e.target.id);
    setIsChecked(true);
  };

  const getInputHandler = (e) => {
    const { name } = e.target;
    const selectedDate = transDateToTime(e.target.value);
    const newEndDate =
      name === "startDate"
        ? newEndDateRangeHandler(
            name,
            "startDate",
            e.target.value,
            setEndDate,
            dateToISOString
          )
        : "";

    const newEndTime = transDateToTime(newEndDate);
    if (name === "startDate" || name === "endDate") {
      if (
        occupationTime.find(
          (r) => selectedDate >= r[0] && selectedDate <= r[1]
        ) ||
        (name === "startDate" &&
          occupationTime.find(
            (r) =>
              (selectedDate < r[0] &&
                (transDateToTime(input.endDate) > r[1] || newEndTime > r[1])) ||
              (transDateToTime(input.endDate) >= r[0] &&
                transDateToTime(input.endDate) <= r[1]) ||
              (newEndTime >= r[0] && newEndTime <= r[1])
          )) ||
        (name === "endDate" &&
          occupationTime.find(
            (r) =>
              transDateToTime(input.startDate) < r[0] && selectedDate > r[1]
          ))
      ) {
        Swal.fire({
          text: "您所選的區間已有安排",
          icon: "warning",
          confirmButtonText: "確定",
          confirmButtonColor: "#1e4d4e",
        });
      } else {
        setInput({
          ...input,
          [name]: e.target.value,
          publishDate: dateToISOString(getToday()),
          endDate: name === "startDate" ? newEndDate : e.target.value,
          name: profile.name,
          gender: profile.gender,
          id: cID,
          status: "0",
        });
      }
    } else {
      setInput({
        ...input,
        [name]: e.target.value,
        publishDate: dateToISOString(getToday()),
        name: profile.name,
        gender: profile.gender,
        id: cID,
        status: "0",
      });
    }
  };

  const newPublishHandler = (e) => {
    if (
      !profile.gender ||
      !profile.name ||
      !profile.weight ||
      !profile.height ||
      !profile.career ||
      !profile.education ||
      !profile.age ||
      !profile.sport
    ) {
      Swal.fire({
        text: "個人資料填寫完整才能發佈刊登喔",
        icon: "warning",
        confirmButtonText: "確定",
        confirmButtonColor: "#1e4d4e",
      });
    } else {
      if (input.endDate && input.startDate && input.subject && input.content) {
        Swal.fire({
          text: "確定發佈刊登嗎?",
          icon: "warning",
          showCancelButton: true,
          cancelButtonText: "取消",
          confirmButtonText: "確定",
          confirmButtonColor: "#1e4d4e",
        }).then((res) => {
          if (res.isConfirmed) {
            const dateTime = Date.now();
            const timestamp = Math.floor(dateTime);
            addPublication(input, timestamp).then(() => {
              Swal.fire({
                text: "發佈成功",
                icon: "success",
                confirmButtonText: "確定",
                confirmButtonColor: "#1e4d4e",
              });
              setPublishData({ ...input, publishID: `${timestamp}` });
              setDisplay("none");
              setInput({});
            });
          }
        });
      } else {
        Swal.fire({
          text: "刊登資料要填寫完整喔",
          icon: "warning",
          confirmButtonText: "確定",
          confirmButtonColor: "#1e4d4e",
        });
      }
    }
  };

  return (
    <div className={style.publish}>
      <div className={style.waiting}>
        <div className={style.header}>
          <h4>刊登需求</h4>
          <div className={style.buttons}>
            <button
              className={style.add}
              title="add"
              onClick={publishModalHandler}
            >
              <i
                className="fa fa-pencil-square-o"
                aria-hidden="true"
                title="add"
              ></i>
            </button>
            <button
              className={style.remove}
              title="remove"
              onClick={publishModalHandler}
            >
              <i
                className="fa fa-trash-o"
                aria-hidden="true"
                title="remove"
              ></i>
            </button>
          </div>
        </div>
        <p>一次僅能發佈一個刊登</p>
        {publishData ? (
          publishData.status && publishData.status === "0" ? (
            <>
              <h5>您目前的刊登</h5>
              <div className={style.publication}>
                <div className={style.col}>
                  <div className={style.para}>
                    <span className={style.title}>刊登時間</span>：
                    {publishData.publishDate}
                  </div>
                  <div className={style.para}>
                    <div>
                      <span className={style.title}>預約時間：</span>
                      <span>
                        {publishData.startDate}~{publishData.endDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={style.para}>
                  <span className={style.title}>主旨：</span>
                  {publishData.subject}
                </div>
                <div className={`${style.message} ${style.para}`}>
                  <div className={style.title}>內容：</div>
                  <div>{publishData.content}</div>
                </div>
              </div>
            </>
          ) : (
            <div className={image.nothing}>
              <img src={nothing} alt="nothing" />
            </div>
          )
        ) : (
          <div className={image.spinner}>
            <img
              src={spinner}
              style={{ display: spinnerDisplay }}
              alt="spinner"
            />
          </div>
        )}
      </div>
      <div className={style.invited}>
        <h4>誰來應徵</h4>
        <div className={style.inviters}>
          {publishData ? (
            publishData.whoInvite &&
            publishData.status &&
            publishData.status === "0" &&
            publishData.whoInvite.find((i) => i.status === "0") ? (
              publishData.whoInvite.map((i, index) => (
                <>
                  {i.status === "0" ? (
                    <div className={style.inviter} key={i.name}>
                      <div>{i.name} 營養師對您的刊登有興趣</div>
                      <button id={index} onClick={checkDietitianDetails}>
                        查看詳情
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </>
              ))
            ) : (
              <div className={image.nothing}>
                <img src={nothing} alt="nothing" />
              </div>
            )
          ) : (
            <div className={image.spinner}>
              <img
                src={spinner}
                style={{ display: spinnerDisplay }}
                alt="spinner"
              />
            </div>
          )}
          {publishData && publishData.status && isChecked ? (
            <Invited
              publishData={publishData}
              idx={idx}
              setPublishData={setPublishData}
              setIsChecked={setIsChecked}
              setOldPublish={setOldPublish}
              oldPublish={oldPublish}
              pending={pending}
              setPending={setPending}
            />
          ) : (
            ""
          )}
        </div>
      </div>
      <div className={style.published}>
        <h4>過去刊登</h4>
        <div className={style.list}>
          {oldPublish ? (
            oldPublish.length > 0 ? (
              oldPublish.map((o) => (
                <div className={style["published-col"]} key={o.startDate}>
                  <div>
                    <div className={style.startDate}>
                      預約開始時間：{o.startDate}
                    </div>
                    <div className={style.subject}>{o.subject}</div>
                  </div>
                  {o.status === "1" ? (
                    <>
                      <span className={style.success}>成功</span>
                    </>
                  ) : o.status === "3" ? (
                    <span className={style.expired}>逾期</span>
                  ) : (
                    ""
                  )}
                </div>
              ))
            ) : (
              <div className={image.nothing}>
                <img src={nothing} alt="nothing" />
              </div>
            )
          ) : (
            <div className={image.spinner}>
              <img
                src={spinner}
                style={{ display: spinnerDisplay }}
                alt="spinner"
              />
            </div>
          )}
        </div>
      </div>

      <div
        className={`${style.form} animated animate__fadeIn`}
        style={{ display: display }}
      >
        <h4>刊登</h4>
        <div>
          <label>
            <div className={style.title}>開始</div>
            <input
              type="date"
              name="startDate"
              min={startDate ? startDate.min : ""}
              max={startDate ? startDate.max : ""}
              value={input.startDate || ""}
              onChange={getInputHandler}
            ></input>
          </label>
          <label>
            <div className={style.title}>結束</div>
            <input
              type="date"
              name="endDate"
              min={endDate ? endDate.min : ""}
              max={endDate ? endDate.max : ""}
              value={input.endDate || ""}
              onChange={getInputHandler}
            ></input>
          </label>
        </div>
        <div className={style.subject}>
          <label>
            <div className={style.title}>主旨</div>
            <input
              type="text"
              name="subject"
              value={input.subject || ""}
              onChange={getInputHandler}
            ></input>
          </label>
        </div>
        <div className={style.content}>
          <label>
            <div className={style.title}>內容</div>
            <textarea
              name="content"
              value={input.content || ""}
              onChange={getInputHandler}
            />
          </label>
        </div>
        <div className={style.buttons}>
          <button className={style.send} onClick={newPublishHandler}>
            刊登
          </button>
          <button
            className={style.cancel}
            title="cancel"
            onClick={publishModalHandler}
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}

export default Publish;
