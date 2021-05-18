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

// function ShowImages({ mealDetails, input, removeImageHandler }) {
//   if (!input.images) {
//     return (
//       <>
//         {mealDetails.images.map((i, index) => (
//           <div key={index}>
//             <div id={index} onClick={removeImageHandler}>
//               X
//             </div>
//             <a href={i} target="_blank">
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
//             <a href={i} target="_blank">
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
//             <a href={i} target="_blank">
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
//             <a href={i} target="_blank">
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

function CustomerRecord({ date, isChecked, setIsChecked }) {
  const storage = firebase.storage();
  const [input, setInput] = useState("");
  const [meal, setMeal] = useState("");
  const [dID, setDID] = useState();
  const [mealDetails, setMealDetails] = useState("");
  const [value, setValue] = useState("");
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
    console.log("here");
  }, [date]);

  const getMealHandler = (e) => {
    setIsChecked(true);
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
  console.log(value);
  const getInputHandler = (e) => {
    console.log(e.target);
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

  console.log(input);
  console.log(mealDetails);
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
        <div className="breakfast">
          <div className="customerBreakfast" onClick={getMealHandler}>
            早餐
          </div>
          {meal === "customerBreakfast" && isChecked ? (
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
                          <a href={i} target="_blank">
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
                        <a href={i} target="_blank">
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
                        <a href={i} target="_blank">
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
                        <a href={i} target="_blank">
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
            </>
          ) : (
            ""
          )}
        </div>
        <div className="morning-snack">
          <div className="customerMorning-snack" onClick={getMealHandler}>
            早點
          </div>
          {meal === "customerMorning-snack" && isChecked ? (
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
                          <a href={i} target="_blank">
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
                        <a href={i} target="_blank">
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
                        <a href={i} target="_blank">
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
                        <a href={i} target="_blank">
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
            </>
          ) : (
            ""
          )}
        </div>
        <div className="lunch">
          <div className="customerLunch" onClick={getMealHandler}>
            午餐
          </div>
          {meal === "customerLunch" && isChecked ? (
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
                          <a href={i} target="_blank">
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
                        <a href={i} target="_blank">
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
                        <a href={i} target="_blank">
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
                        <a href={i} target="_blank">
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
            </>
          ) : (
            ""
          )}
        </div>
        <div className="afternoon-snack">
          <div className="customerAfternoon-snack" onClick={getMealHandler}>
            午點
          </div>
          {meal === "customerAfternoon-snack" && isChecked ? (
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
                          <a href={i} target="_blank">
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
                        <a href={i} target="_blank">
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
                        <a href={i} target="_blank">
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
                        <a href={i} target="_blank">
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
            </>
          ) : (
            ""
          )}
        </div>
        <div className="dinner">
          <div className="customerDinner" onClick={getMealHandler}>
            晚餐
          </div>
          {meal === "customerDinner" && isChecked ? (
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
                          <a href={i} target="_blank">
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
                        <a href={i} target="_blank">
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
                        <a href={i} target="_blank">
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
                        <a href={i} target="_blank">
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
            </>
          ) : (
            ""
          )}
        </div>
        <div className="night-snack">
          <div className="customerNight-snack" onClick={getMealHandler}>
            晚點
          </div>
          {meal === "customerNight-snack" && isChecked ? (
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
                          <a href={i} target="_blank">
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
                        <a href={i} target="_blank">
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
                        <a href={i} target="_blank">
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
                        <a href={i} target="_blank">
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
            </>
          ) : (
            ""
          )}
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

function RenderDietaryRecord() {
  const [recordDate, setRecordDate] = useState();
  const [getRecord, setGetRecord] = useState(false); //false
  const [isChecked, setIsChecked] = useState(false);
  const params = useParams();

  const getDietaryRecordDate = (e) => {
    if (e.target.value !== "") {
      setRecordDate(e.target.value);
      setIsChecked(false);
      setGetRecord(true);
    }
  };
  if (params.dID) {
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
            to={`/dietitian/${params.dID}/customer/${params.cID}/dietary/`}
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
          max="2021-05-31"
          onChange={getDietaryRecordDate}
        ></input>
        <Router>
          <Link to={`/customer/${params.cID}/dietary/`}></Link>
          {getRecord ? (
            <Switch>
              <Route exact path="/customer/:cID/dietary/">
                <CustomerRecord
                  date={recordDate}
                  isChecked={isChecked}
                  setIsChecked={setIsChecked}
                />
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
