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
import Analysis from "./Analysis.js";

function CustomerRecord({ date, count, setCount }) {
  const storage = firebase.storage();
  const [input, setInput] = useState("");
  const [meal, setMeal] = useState("");
  const [dID, setDID] = useState();
  const [mealDetails, setMealDetails] = useState("");
  const [value, setValue] = useState("");
  const [dataAnalysis, setDataAnalysis] = useState(false);

  // const [images, setImages] = useState([]);
  const cID = useParams().cID;

  useEffect(() => {
    firebase
      .firestore()
      .collection("customers")
      .doc(cID)
      .get()
      .then((doc) => {
        setDID(doc.data().dietitian);
      });
  }, [date]);

  const getMealHandler = (e) => {
    if (meal !== e.target.className) {
      setCount(2);
    } else {
      setCount(count + 1);
    }
    setMeal(e.target.className);
    setInput("");
    // if (mealDetails.images) {
    //   setMealDetails({ images: mealDetails.images });
    // }
    // else {
    //   setMealDetails("");
    // }
    setMealDetails("");
    firebase
      .firestore()
      .collection("dietitians")
      .doc(dID)
      .collection("customers")
      .doc(cID)
      .collection("diet")
      .doc(date)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data()[e.target.className]) {
          setMealDetails(doc.data()[e.target.className]);
        } else {
          setMealDetails("");
        }
        if (doc.exists && doc.data()[e.target.id]) {
          setDataAnalysis(doc.data()[e.target.id]);
        } else {
          setDataAnalysis(false);
        }
      });
  };
  async function postImg(image) {
    if (image) {
      const storageRef = storage.ref(`${cID}/${date}/${meal}/` + image.name);
      await storageRef.put(image);
      return image.name;
    } else {
      return false;
    }
  }
  async function getImg(image) {
    const imageName = await postImg(image);
    if (imageName) {
      const storageRef = storage.ref();
      const pathRef = await storageRef
        .child(`${cID}/${date}/${meal}/` + imageName)
        .getDownloadURL();
      return await pathRef;
    } else {
      return "";
    }
  }
  const getInputHandler = (e) => {
    const { name } = e.target;
    if (name !== "image") {
      setInput({ ...input, [name]: e.target.value });
    } else if (e.target.files[0]) {
      // const imageUrlArray = [];
      const imagesArray = [];
      for (let i = 0; i < e.target.files.length; i++) {
        // const imageUrl = window.URL.createObjectURL(e.target.files[i]);
        // imageUrlArray.push(imageUrl);
        imagesArray.push(e.target.files[i]);
      }
      setValue(e.target.value);
      // if (mealDetails.images) {
      //   mealDetails.images.forEach((m) => {
      //     imageUrlArray.push(m);
      //   });
      // }

      setInput({
        ...input,
        // imageUrl: imageUrlArray,
        imageFile: imagesArray,
      });
    } else {
      // delete input.image;
      // setInput({ ...input });
      setValue("");
    }
  };
  const removeImageHandler = (e) => {
    setMealDetails({
      ...mealDetails,
      images: [...mealDetails.images.filter((i, idx) => idx != e.target.id)],
    });
    firebase
      .firestore()
      .collection("dietitians")
      .doc(dID)
      .collection("customers")
      .doc(cID)
      .collection("diet")
      .doc(date)
      .set(
        {
          [meal]: {
            images: [
              ...mealDetails.images.filter((i, idx) => idx != e.target.id),
            ],
          },
        },
        { merge: true }
      );
    // .update({
    //   [meal]: {
    //     ...mealDetails,
    //     images: [
    //       ...mealDetails.images.filter((i, idx) => idx != e.target.id),
    //     ],
    //   },
    // });
  };
  const bindSaveHandler = async (e) => {
    if (meal === e.target.className) {
      if (input.imageFile) {
        let valid = 0;
        input.imageFile.forEach((i, index) => {
          if (i.size >= 2097152) {
            if (input.imageFile.length > 1) {
              alert(`您想上傳的第${index + 1}張圖片超過2MB囉!`);
            } else {
              alert(`圖片超過2MB囉!`);
            }
            valid++;
          }
        });
        if (valid === 0) {
          const imageUrlsArray = [];
          if (mealDetails.images && mealDetails.images.length > 0) {
            mealDetails.images.forEach((m) => {
              imageUrlsArray.push(m);
            });
            setMealDetails({ ...mealDetails, images: imageUrlsArray });
          }
          input.imageFile.forEach(async (i) => {
            const imageUrl = await getImg(i);
            imageUrlsArray.push(imageUrl);
            setInput({
              ...input,
              images: imageUrlsArray,
            });
            delete input.imageFile;
            // delete input.imageUrl;
            // delete mealDetails.images;
            firebase
              .firestore()
              .collection("dietitians")
              .doc(dID)
              .collection("customers")
              .doc(cID)
              .collection("diet")
              .doc(date)
              .set(
                { [meal]: { ...input, images: imageUrlsArray } },
                { merge: true }
              );
            setMealDetails({ ...mealDetails, images: imageUrlsArray });
            setValue("");
          });
          alert("儲存囉!");
        }
      } else {
        delete input.imageFile;
        // delete input.imageUrl;
        firebase
          .firestore()
          .collection("dietitians")
          .doc(dID)
          .collection("customers")
          .doc(cID)
          .collection("diet")
          .doc(date)
          .set({ [meal]: input }, { merge: true });
        alert("儲存囉!");
      }
    }
  };

  return (
    <>
      <div id="dietitian-daily-diet">
        <h2>{date}飲食記錄</h2>
        <div className="meal">
          <div
            className="customerBreakfast"
            id="breakfast"
            onClick={getMealHandler}
          >
            早餐
          </div>
          {meal === "customerBreakfast" && count % 2 === 0 ? (
            <>
              <div className="diet-record">
                <label>
                  進食時間{" "}
                  <input
                    type="time"
                    name="eatTime"
                    value={
                      input.eatTime || input.eatTime === ""
                        ? input.eatTime
                        : mealDetails && mealDetails.eatTime
                        ? mealDetails.eatTime
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </label>
                <div>
                  <div>照片記錄</div>
                  {mealDetails &&
                  mealDetails.images &&
                  mealDetails.images.length > 0
                    ? mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    : ""}
                  {/* {mealDetails && mealDetails.images && input.imageUrl ? (
                      <ShowImages
                        mealDetails={mealDetails}
                        input={input}
                        removeImageHandler={removeImageHandler}
                      />
                    ) : mealDetails && mealDetails.images && !input.imageUrl ? (
                      mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    ) : input.imageUrl ? (
                      input.imageUrl.map((i, index) => (
                        <div key={index}>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    ) : input.images ? (
                      input.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    ) : (
                      ""
                    )} */}
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    value={value}
                    id="0"
                    multiple="multiple"
                    onChange={getInputHandler}
                  />
                </div>
                <div>
                  <div>請描述飲食內容，越完整越好</div>
                  <input
                    type="textarea"
                    name="description"
                    value={
                      input.description || input.description === ""
                        ? input.description
                        : mealDetails && mealDetails.description
                        ? mealDetails.description
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </div>
                <button className="customerBreakfast" onClick={bindSaveHandler}>
                  儲存
                </button>
              </div>
              {dataAnalysis ? (
                <table className="dietitian-record">
                  <thead>
                    <tr>
                      <th>品項</th>
                      <th>單位:100g</th>
                      <th>熱量(kcal)</th>
                      <th>蛋白質(g)</th>
                      <th>脂質(g)</th>
                      <th>碳水化合物(g)</th>
                      <th>膳食纖維(g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataAnalysis.map((a, index) => (
                      <tr key={index} id={index}>
                        <th>{a.item}</th>
                        <th>{a.per}</th>
                        <th>{a.kcal}</th>
                        <th>{a.protein}</th>
                        <th>{a.lipid}</th>
                        <th>{a.carbohydrate}</th>
                        <th>{a.fiber}</th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </div>
        <div className="meal">
          <div
            className="customerMorning-snack"
            id="morning-snack"
            onClick={getMealHandler}
          >
            早點
          </div>
          {meal === "customerMorning-snack" && count % 2 === 0 ? (
            <>
              {" "}
              <div className="diet-record">
                <label>
                  進食時間{" "}
                  <input
                    type="time"
                    name="eatTime"
                    value={
                      input.eatTime || input.eatTime === ""
                        ? input.eatTime
                        : mealDetails && mealDetails.eatTime
                        ? mealDetails.eatTime
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </label>
                <div>
                  <div>照片記錄</div>
                  {mealDetails &&
                  mealDetails.images &&
                  mealDetails.images.length > 0
                    ? mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    : ""}
                  {/* {mealDetails && mealDetails.images && input.imageUrl ? (
                      <ShowImages
                        mealDetails={mealDetails}
                        input={input}
                        removeImageHandler={removeImageHandler}
                      />
                    ) : mealDetails && mealDetails.images && !input.imageUrl ? (
                      mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    ) : input.imageUrl ? (
                      input.imageUrl.map((i, index) => (
                        <div key={index}>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    ) : input.images ? (
                      input.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    ) : (
                      ""
                    )} */}
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    id="0"
                    multiple="multiple"
                    onChange={getInputHandler}
                  />
                </div>
                <div>
                  <div>請描述飲食內容，越完整越好</div>
                  <input
                    type="textarea"
                    name="description"
                    value={
                      input.description || input.description === ""
                        ? input.description
                        : mealDetails && mealDetails.description
                        ? mealDetails.description
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </div>
                <button
                  className="customerMorning-snack"
                  onClick={bindSaveHandler}
                >
                  儲存
                </button>
              </div>
              {dataAnalysis ? (
                <table className="dietitian-record">
                  <thead>
                    <tr>
                      <th>品項</th>
                      <th>單位:100g</th>
                      <th>熱量(kcal)</th>
                      <th>蛋白質(g)</th>
                      <th>脂質(g)</th>
                      <th>碳水化合物(g)</th>
                      <th>膳食纖維(g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataAnalysis.map((a, index) => (
                      <tr key={index} id={index}>
                        <th>{a.item}</th>
                        <th>{a.per}</th>
                        <th>{a.kcal}</th>
                        <th>{a.protein}</th>
                        <th>{a.lipid}</th>
                        <th>{a.carbohydrate}</th>
                        <th>{a.fiber}</th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </div>
        <div className="meal">
          <div className="customerLunch" id="lunch" onClick={getMealHandler}>
            午餐
          </div>
          {meal === "customerLunch" && count % 2 === 0 ? (
            <>
              {" "}
              <div className="diet-record">
                <label>
                  進食時間{" "}
                  <input
                    type="time"
                    name="eatTime"
                    value={
                      input.eatTime || input.eatTime === ""
                        ? input.eatTime
                        : mealDetails && mealDetails.eatTime
                        ? mealDetails.eatTime
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </label>
                <div>
                  <div>照片記錄</div>
                  {mealDetails &&
                  mealDetails.images &&
                  mealDetails.images.length > 0
                    ? mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    : ""}
                  {/* {mealDetails && mealDetails.images && input.imageUrl ? (
                      <ShowImages
                        mealDetails={mealDetails}
                        input={input}
                        removeImageHandler={removeImageHandler}
                      />
                    ) : mealDetails && mealDetails.images && !input.imageUrl ? (
                      mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    ) : input.imageUrl ? (
                      input.imageUrl.map((i, index) => (
                        <div key={index}>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    ) : input.images ? (
                      input.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    ) : (
                      ""
                    )} */}
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    id="0"
                    multiple="multiple"
                    onChange={getInputHandler}
                  />
                </div>
                <div>
                  <div>請描述飲食內容，越完整越好</div>
                  <input
                    type="textarea"
                    name="description"
                    value={
                      input.description || input.description === ""
                        ? input.description
                        : mealDetails && mealDetails.description
                        ? mealDetails.description
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </div>
                <button className="customerLunch" onClick={bindSaveHandler}>
                  儲存
                </button>
              </div>
              {dataAnalysis ? (
                <table className="dietitian-record">
                  <thead>
                    <tr>
                      <th>品項</th>
                      <th>單位:100g</th>
                      <th>熱量(kcal)</th>
                      <th>蛋白質(g)</th>
                      <th>脂質(g)</th>
                      <th>碳水化合物(g)</th>
                      <th>膳食纖維(g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataAnalysis.map((a, index) => (
                      <tr key={index} id={index}>
                        <th>{a.item}</th>
                        <th>{a.per}</th>
                        <th>{a.kcal}</th>
                        <th>{a.protein}</th>
                        <th>{a.lipid}</th>
                        <th>{a.carbohydrate}</th>
                        <th>{a.fiber}</th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </div>
        <div className="meal">
          <div
            className="customerAfternoon-snack"
            id="afternoon-snack"
            onClick={getMealHandler}
          >
            午點
          </div>
          {meal === "customerAfternoon-snack" && count % 2 === 0 ? (
            <>
              <div className="diet-record">
                <label>
                  進食時間{" "}
                  <input
                    type="time"
                    name="eatTime"
                    value={
                      input.eatTime || input.eatTime === ""
                        ? input.eatTime
                        : mealDetails && mealDetails.eatTime
                        ? mealDetails.eatTime
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </label>
                <div>
                  <div>照片記錄</div>
                  {mealDetails &&
                  mealDetails.images &&
                  mealDetails.images.length > 0
                    ? mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    : ""}
                  {/* {mealDetails && mealDetails.images && input.imageUrl ? (
                      <ShowImages
                        mealDetails={mealDetails}
                        input={input}
                        removeImageHandler={removeImageHandler}
                      />
                    ) : mealDetails && mealDetails.images && !input.imageUrl ? (
                      mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    ) : input.images && input.imageUrl ? (
                      <ShowImages
                        mealDetails={mealDetails}
                        input={input}
                        removeImageHandler={removeImageHandler}
                      />
                    ) : input.images && !input.imageUrl ? (
                      input.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    ) : input.imageUrl ? (
                      input.imageUrl.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    ) : (
                      ""
                    )} */}
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    id="0"
                    multiple="multiple"
                    onChange={getInputHandler}
                  />
                </div>
                <div>
                  <div>請描述飲食內容，越完整越好</div>
                  <input
                    type="textarea"
                    name="description"
                    value={
                      input.description || input.description === ""
                        ? input.description
                        : mealDetails && mealDetails.description
                        ? mealDetails.description
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </div>
                <button
                  className="customerAfternoon-snack"
                  onClick={bindSaveHandler}
                >
                  儲存
                </button>
              </div>
              {dataAnalysis ? (
                <table className="dietitian-record">
                  <thead>
                    <tr>
                      <th>品項</th>
                      <th>單位:100g</th>
                      <th>熱量(kcal)</th>
                      <th>蛋白質(g)</th>
                      <th>脂質(g)</th>
                      <th>碳水化合物(g)</th>
                      <th>膳食纖維(g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataAnalysis.map((a, index) => (
                      <tr key={index} id={index}>
                        <th>{a.item}</th>
                        <th>{a.per}</th>
                        <th>{a.kcal}</th>
                        <th>{a.protein}</th>
                        <th>{a.lipid}</th>
                        <th>{a.carbohydrate}</th>
                        <th>{a.fiber}</th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </div>
        <div className="meal">
          <div className="customerDinner" id="dinner" onClick={getMealHandler}>
            晚餐
          </div>
          {meal === "customerDinner" && count % 2 === 0 ? (
            <>
              <div className="diet-record">
                <label>
                  進食時間{" "}
                  <input
                    type="time"
                    name="eatTime"
                    value={
                      input.eatTime || input.eatTime === ""
                        ? input.eatTime
                        : mealDetails && mealDetails.eatTime
                        ? mealDetails.eatTime
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </label>
                <div>
                  <div>照片記錄</div>
                  {mealDetails &&
                  mealDetails.images &&
                  mealDetails.images.length > 0
                    ? mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    : ""}
                  {/* {mealDetails && mealDetails.images && input.imageUrl ? (
                      <ShowImages
                        mealDetails={mealDetails}
                        input={input}
                        removeImageHandler={removeImageHandler}
                      />
                    ) : mealDetails && mealDetails.images && !input.imageUrl ? (
                      mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    ) : input.imageUrl ? (
                      input.imageUrl.map((i, index) => (
                        <div key={index}>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    ) : input.images ? (
                      input.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    ) : (
                      ""
                    )} */}
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    id="0"
                    multiple="multiple"
                    onChange={getInputHandler}
                  />
                </div>
                <div>
                  <div>請描述飲食內容，越完整越好</div>
                  <input
                    type="textarea"
                    name="description"
                    value={
                      input.description || input.description === ""
                        ? input.description
                        : mealDetails && mealDetails.description
                        ? mealDetails.description
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </div>
                <button className="customerDinner" onClick={bindSaveHandler}>
                  儲存
                </button>
              </div>
              {dataAnalysis ? (
                <table className="dietitian-record">
                  <thead>
                    <tr>
                      <th>品項</th>
                      <th>單位:100g</th>
                      <th>熱量(kcal)</th>
                      <th>蛋白質(g)</th>
                      <th>脂質(g)</th>
                      <th>碳水化合物(g)</th>
                      <th>膳食纖維(g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataAnalysis.map((a, index) => (
                      <tr key={index} id={index}>
                        <th>{a.item}</th>
                        <th>{a.per}</th>
                        <th>{a.kcal}</th>
                        <th>{a.protein}</th>
                        <th>{a.lipid}</th>
                        <th>{a.carbohydrate}</th>
                        <th>{a.fiber}</th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </div>
        <div className="meal">
          <div
            className="customerNight-snack"
            id="night-snack"
            onClick={getMealHandler}
          >
            晚點
          </div>
          {meal === "customerNight-snack" && count % 2 === 0 ? (
            <>
              <div className="diet-record">
                <label>
                  進食時間{" "}
                  <input
                    type="time"
                    name="eatTime"
                    value={
                      input.eatTime || input.eatTime === ""
                        ? input.eatTime
                        : mealDetails && mealDetails.eatTime
                        ? mealDetails.eatTime
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </label>
                <div>
                  <div>照片記錄</div>
                  {mealDetails &&
                  mealDetails.images &&
                  mealDetails.images.length > 0
                    ? mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    : ""}
                  {/* {mealDetails && mealDetails.images && input.imageUrl ? (
                      <ShowImages
                        mealDetails={mealDetails}
                        input={input}
                        removeImageHandler={removeImageHandler}
                      />
                    ) : mealDetails && mealDetails.images && !input.imageUrl ? (
                      mealDetails.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    ) : input.imageUrl ? (
                      input.imageUrl.map((i, index) => (
                        <div key={index}>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    ) : input.images ? (
                      input.images.map((i, index) => (
                        <div key={index}>
                          <div id={index} onClick={removeImageHandler}>
                            X
                          </div>
                          <a href={i} target="_blank" rel="noreferrer noopener">
                            <img
                              src={i}
                              alt="customer"
                              style={{ width: "200px", height: "200px" }}
                            />
                          </a>
                        </div>
                      ))
                    ) : (
                      ""
                    )} */}
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    id="0"
                    multiple="multiple"
                    onChange={getInputHandler}
                  />
                </div>
                <div>
                  <div>請描述飲食內容，越完整越好</div>
                  <input
                    type="textarea"
                    name="description"
                    value={
                      input.description || input.description === ""
                        ? input.description
                        : mealDetails && mealDetails.description
                        ? mealDetails.description
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </div>
                <button
                  className="customerNight-snack"
                  onClick={bindSaveHandler}
                >
                  儲存
                </button>
              </div>
              {dataAnalysis ? (
                <table className="dietitian-record">
                  <thead>
                    <tr>
                      <th>品項</th>
                      <th>單位:100g</th>
                      <th>熱量(kcal)</th>
                      <th>蛋白質(g)</th>
                      <th>脂質(g)</th>
                      <th>碳水化合物(g)</th>
                      <th>膳食纖維(g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataAnalysis.map((a, index) => (
                      <tr key={index} id={index}>
                        <th>{a.item}</th>
                        <th>{a.per}</th>
                        <th>{a.kcal}</th>
                        <th>{a.protein}</th>
                        <th>{a.lipid}</th>
                        <th>{a.carbohydrate}</th>
                        <th>{a.fiber}</th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </div>

        <hr />
        <Analysis date={date} cID={cID} data={dataAnalysis} />
        <hr />
      </div>
    </>
  );
}

export default CustomerRecord;
