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

function DietitianRecord({ date, isChecked, setIsChecked }) {
  const params = useParams();
  const dID = params.dID;
  const cID = params.cID;
  const getMealHandler = (e) => {
    console.log(e.target.className);
    console.log(e.target.id);
  };
  return (
    <>
      <div id="dietitian-daily-diet">
        <h2>{date}飲食記錄</h2>
        <div>
          <div
            className="customerBreakfast"
            id="breakfast"
            onClick={getMealHandler}
          >
            早餐
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
          <div>
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
                  <th>0</th>
                  <th>0</th>
                  <th>0</th>
                  <th>0</th>
                  <th>0</th>
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
            <button>儲存</button>
          </div>
        </div>
        <div className="meal">
          <div
            className="customerMorning-snack"
            id="morning-snack"
            onClick={getMealHandler}
          >
            早點
          </div>
        </div>
        <div className="meal">
          <div className="customerLunch" id="lunch" onClick={getMealHandler}>
            午餐
          </div>
        </div>
        <div className="meal">
          <div
            className="customerAfternoon-snack "
            id="afternoon-snack"
            onClick={getMealHandler}
          >
            午點
          </div>
        </div>
        <div className="meal">
          <div className="customerDinner" id="dinner" onClick={getMealHandler}>
            晚餐
          </div>
        </div>
        <div className="meal">
          <div
            className="customerNight-snack "
            id="night-snack"
            onClick={getMealHandler}
          >
            晚點
          </div>
        </div>
        <hr />
        <Analsis date={date} dID={dID} cID={cID} />
        <button>儲存</button>
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

function CustomerRecord({ date, isChecked, setIsChecked }) {
  const storage = firebase.storage();
  const [input, setInput] = useState("");
  const [meal, setMeal] = useState("");
  const [dID, setDID] = useState();
  const [mealDetails, setMealDetails] = useState("");
  const [value, setValue] = useState("");
  const [dateAnalysis, setDateAnalysis] = useState(false);
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
  }, []);

  const getMealHandler = (e) => {
    setIsChecked(true);
    setMeal(e.target.className);
    console.log(e.target.id);
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
          console.log(doc.data()[e.target.id]);
          setDateAnalysis(doc.data()[e.target.id]);
        } else {
          console.log("no");
          setDateAnalysis(false);
        }
      });
  };
  console.log(dateAnalysis);
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
              {dateAnalysis ? (
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
                    {dateAnalysis.map((a, index) => (
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
              {dateAnalysis ? (
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
            </>
          ) : (
            ""
          )}
        </div>
        <div className="meal">
          <div className="customerDinner" id="dinner" onClick={getMealHandler}>
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
            </>
          ) : (
            ""
          )}
        </div>

        <hr />
        <Analsis date={date} dID={dID} cID={cID} />
        <hr />
      </div>
    </>
  );
}

function Analsis({ date, dID, cID }) {
  const pathName = useLocation().pathname;
  const [breakFast, setBreakFast] = useState("");
  const [advice, setAdvice] = useState("");
  useEffect(() => {
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
        if (doc.exists && doc.data().advice) {
          setAdvice(doc.data().advice);
        } else {
          setAdvice("");
        }
        if (doc.exists && doc.data()["breakfast"]) {
          console.log(doc.data()["breakfast"]);
        } else {
          console.log("not added yet");
        }
      });
  });
  const tess = (e) => {
    console.log(e.target);
  };

  return (
    <>
      <div id="diet-analysis">
        <h2>{date}飲食分析</h2>
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
              <th>e</th>
              <th>e</th>
              <th>e</th>
              <th>e</th>
              <th>e</th>
            </tr>
            <tr id="morning-snack">
              <th>早點</th>
            </tr>
            <tr id="lunch">
              <th>午餐</th>
            </tr>
            <tr id="afternoon-snack">
              <th>午點</th>
            </tr>
            <tr id="dinner">
              <th>晚餐</th>
            </tr>
            <tr id="night-snack">
              <th>晚點</th>
            </tr>
            <tr id="table-total">
              <th>總和</th>
            </tr>
            <tr id="target">
              <th>目標</th>
            </tr>
            <tr id="resr">
              <th>剩餘</th>
            </tr>
          </tbody>
        </table>
        {pathName.includes("dietitian") ? (
          <div>
            <label>
              給予建議
              <input type="textarea" value={advice} />
            </label>
          </div>
        ) : (
          <div>
            <div>營養師建議</div>
            <div id="advice">{advice}</div>
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
          {getRecord ? (
            <Switch>
              <Route exact path={`/dietitian/:dID/customer/:cID/dietary/`}>
                <DietitianRecord
                  date={recordDate}
                  isChecked={isChecked}
                  setIsChecked={setIsChecked}
                />
              </Route>
            </Switch>
          ) : (
            ""
          )}
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
