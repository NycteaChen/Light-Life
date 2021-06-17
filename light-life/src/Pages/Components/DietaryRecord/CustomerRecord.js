import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import { useParams } from "react-router-dom";
import "firebase/firestore";
import Swal from "sweetalert2";
import {
  getCustomerData,
  getDietData,
  setCustomerDiet,
} from "../../../utils/Firebase.js";
import Analysis from "./Analysis.js";
import style from "../../../style/dietary.module.scss";
import styled from "styled-components";

const Save = styled.button`
  cursor: default;
  opacity: 0.7;
`;

function CustomerRecord({ date, count, setCount }) {
  const storage = firebase.storage();
  const [input, setInput] = useState("");
  const [meal, setMeal] = useState("");
  const [dID, setDID] = useState();
  const [mealDetails, setMealDetails] = useState("");
  const [dataAnalysis, setDataAnalysis] = useState(false);

  const cID = useParams().cID;
  const [active, setAcitve] = useState("");
  useEffect(() => {
    getCustomerData(cID).then((doc) => {
      setDID(doc.data().dietitian);
    });
    setInput({});
    setMeal([]);
    setAcitve("");
  }, [date, cID]);

  const getMealHandler = (e) => {
    const mealClass = e.target.className.split(" ")[1];
    const { id } = e.target;
    setAcitve({ [id]: style["li-active"] });
    if (meal !== mealClass) {
      setCount(2);
    } else {
      setCount(count + 1);
    }
    setMeal(mealClass);
    setInput("");

    setMealDetails("");
    getDietData(dID, cID, date).then((doc) => {
      console.log(mealClass);
      console.log(e.target.id);
      if (doc.exists && doc.data()[mealClass]) {
        setMealDetails(doc.data()[mealClass]);
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
      const imagesArray = [];
      for (let i = 0; i < e.target.files.length; i++) {
        imagesArray.push(e.target.files[i]);
      }

      setInput({
        ...input,
        imageFile: imagesArray,
      });
    }
  };
  const removeImageHandler = (e) => {
    Swal.fire({
      text: "確定刪除飲食照片嗎?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "取消",
      confirmButtonText: "確定",
      confirmButtonColor: "#1e4d4e",
    }).then((res) => {
      if (res.isConfirmed) {
        setMealDetails({
          ...mealDetails,
          images: [
            ...mealDetails.images.filter((i, idx) => idx !== +e.target.id),
          ],
        });
        setCustomerDiet(dID, cID, date, {
          [meal]: {
            images: [
              ...mealDetails.images.filter((i, idx) => idx !== +e.target.id),
            ],
          },
        });
      }
    });
  };
  const bindSaveHandler = async (e) => {
    if (meal === e.target.className) {
      if (input.imageFile) {
        let valid = 0;
        input.imageFile.forEach((i, index) => {
          if (i.size >= 2097152) {
            if (input.imageFile.length > 1) {
              Swal.fire({
                text: `您想上傳的第${index + 1}張圖片超過2MB囉!`,
                icon: "warning",
                confirmButtonText: "確定",
                confirmButtonColor: "#1e4d4e",
              });
            } else {
              Swal.fire({
                text: "圖片超過2MB囉!",
                icon: "warning",
                confirmButtonText: "確定",
                confirmButtonColor: "#1e4d4e",
              });
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

            setCustomerDiet(dID, cID, date, {
              [meal]: { ...input, images: imageUrlsArray },
            });
            setMealDetails({ ...mealDetails, images: imageUrlsArray });
          });
          Swal.fire({
            text: "儲存成功",
            icon: "success",
            confirmButtonText: "確定",
            confirmButtonColor: "#1e4d4e",
          });
          delete input.imageFile;
        }
      } else {
        delete input.imageFile;
        setCustomerDiet(dID, cID, date, { [meal]: input });
        Swal.fire({
          text: "儲存成功",
          icon: "success",
          confirmButtonText: "確定",
          confirmButtonColor: "#1e4d4e",
        });
      }
    }
  };

  const mealKeywords = [
    ["早餐", "customerBreakfast", "breakfast"],
    ["早點", "customerMorning-snack", "morning-snack"],
    ["午餐", "customerLunch", "lunch"],
    ["午點", "customerAfternoon-snack", "afternoon-snack"],
    ["晚餐", "customerDinner", "dinner"],
    ["晚點", "customerNight-snack", "night-snack"],
  ];

  return (
    <>
      <ul>
        {mealKeywords.map((m) => (
          <li
            className={`${style["meal-title"]} ${m[1]} ${active[m[2]] || ""}`}
            id={`${m[2]}`}
            role="presentation"
            onClick={getMealHandler}
          >
            {m[0]}
          </li>
        ))}
      </ul>
      <div className={style.mealCol}>
        <h5>{date} 飲食記錄</h5>
        {mealKeywords.map((m) => (
          <div className={style.meal}>
            {meal === m[1] && count % 2 === 0 ? (
              <>
                <div className={`${style["diet-record"]} ${style.col}`}>
                  <label className={style["eat-time"]}>
                    <div className={style.title}>進食時間</div>
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

                  <div className={style.col}>
                    <div className={`${style["image-record"]} ${style.title}`}>
                      照片記錄
                    </div>
                    <div className={style["food-images"]}>
                      {mealDetails &&
                      mealDetails.images &&
                      mealDetails.images.length > 0 ? (
                        mealDetails.images.map((i, index) => (
                          <div className={style["food-image"]} key={index}>
                            <a
                              href={i}
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              <img src={i} alt="customer" />
                            </a>
                            <div>
                              <i
                                className="fa fa-trash"
                                aria-hidden="true"
                                id={index}
                                onClick={removeImageHandler}
                              ></i>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div>尚未上傳照片</div>
                      )}
                    </div>
                    <label className={style.uploadImg}>
                      <input
                        type="file"
                        accept="image/*"
                        name="image"
                        id="0"
                        multiple="multiple"
                        onChange={getInputHandler}
                      />
                      <i class="fa fa-picture-o" aria-hidden="true"></i>
                      {input.imageFile
                        ? `選取${input.imageFile.length}張`
                        : "上傳照片"}
                    </label>
                  </div>

                  <div className={`${style.col} ${style["meal-content"]}`}>
                    <div className={style.title}>飲食內容</div>
                    <textarea
                      className={style["customer-text"]}
                      name="description"
                      value={
                        input.description || input.description === ""
                          ? input.description
                          : mealDetails && mealDetails.description
                          ? mealDetails.description
                          : ""
                      }
                      onChange={getInputHandler}
                    ></textarea>
                  </div>
                  <div className={style.button}>
                    {input ? (
                      <button className={m[1]} onClick={bindSaveHandler}>
                        儲存
                      </button>
                    ) : (
                      <Save className={m[1]}>儲存</Save>
                    )}
                  </div>
                </div>

                {dataAnalysis.length > 0 ? (
                  <div className={style["customer-table"]}>
                    <table>
                      <thead>
                        <tr className={style["item-title"]}>
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
                  </div>
                ) : (
                  ""
                )}
              </>
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
      <Analysis date={date} cID={cID} data={dataAnalysis} />
    </>
  );
}

export default CustomerRecord;
