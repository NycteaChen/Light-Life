import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getCustomerData,
  getDietData,
  setCustomerDiet,
  getImg,
} from "../../../utils/Firebase.js";
import Analysis from "../../Components/DietaryRecord/Analysis.js";
import style from "../../../style/dietary.module.scss";

function CustomerRecord({ date, count, setCount }) {
  const [input, setInput] = useState("");
  const [meal, setMeal] = useState("");
  const [dID, setDID] = useState();
  const [mealDetails, setMealDetails] = useState("");
  const [dataAnalysis, setDataAnalysis] = useState(false);
  const { cID } = useParams();
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
    setAcitve(
      meal !== mealClass || count % 2 === 1 ? { [id]: style["li-active"] } : ""
    );
    setCount(meal !== mealClass ? 2 : count + 1);
    setMeal(mealClass);
    setInput("");
    setMealDetails("");
    getDietData(dID, cID, date).then((doc) => {
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
      text: "????????????????????????????",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "??????",
      confirmButtonText: "??????",
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
            Swal.fire({
              text:
                input.imageFile.length > 1
                  ? `??????????????????${index + 1}???????????????2MB???!`
                  : "????????????2MB???!",
              icon: "warning",
              confirmButtonText: "??????",
              confirmButtonColor: "#1e4d4e",
            });
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
          const imageRef = `${cID}/${date}/${meal}`;
          input.imageFile.forEach(async (i) => {
            const imageUrl = await getImg(i, imageRef);
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
            text: "????????????",
            icon: "success",
            confirmButtonText: "??????",
            confirmButtonColor: "#1e4d4e",
          });
          delete input.imageFile;
        }
      } else {
        delete input.imageFile;
        setCustomerDiet(dID, cID, date, { [meal]: input });
        Swal.fire({
          text: "????????????",
          icon: "success",
          confirmButtonText: "??????",
          confirmButtonColor: "#1e4d4e",
        });
      }
    }
  };

  const mealKeywords = [
    ["??????", "customerBreakfast", "breakfast"],
    ["??????", "customerMorning-snack", "morning-snack"],
    ["??????", "customerLunch", "lunch"],
    ["??????", "customerAfternoon-snack", "afternoon-snack"],
    ["??????", "customerDinner", "dinner"],
    ["??????", "customerNight-snack", "night-snack"],
  ];

  return (
    <>
      <ul>
        {mealKeywords.map((m) => (
          <li
            key={m[0]}
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
        <h5>{date} ????????????</h5>
        {mealKeywords.map((m) => (
          <div className={style.meal} key={m[1]}>
            {meal === m[1] && count % 2 === 0 ? (
              <>
                <div className={`${style["diet-record"]} ${style.col}`}>
                  <label className={style["eat-time"]}>
                    <div className={style.title}>????????????</div>
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
                      ????????????
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
                        <div>??????????????????</div>
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
                      <i className="fa fa-picture-o" aria-hidden="true"></i>
                      {input.imageFile
                        ? `??????${input.imageFile.length}???`
                        : "????????????"}
                    </label>
                  </div>

                  <div className={`${style.col} ${style["meal-content"]}`}>
                    <div className={style.title}>????????????</div>
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
                        ??????
                      </button>
                    ) : (
                      <button
                        className={m[1]}
                        style={{ opacity: 0.7, cursor: "default" }}
                      >
                        ??????
                      </button>
                    )}
                  </div>
                </div>

                {dataAnalysis.length > 0 ? (
                  <div className={style["customer-table"]}>
                    <table>
                      <thead>
                        <tr className={style["item-title"]}>
                          <th>??????</th>
                          <th>??????:100g</th>
                          <th>??????(kcal)</th>
                          <th>?????????(g)</th>
                          <th>??????(g)</th>
                          <th>???????????????(g)</th>
                          <th>????????????(g)</th>
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
