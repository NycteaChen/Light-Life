import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import noImage from "../../../images/noimage.png";
import CustomerProfile from "./CusotmerProfile.js";
import style from "../../../style/customerProfile.module.scss";
import { param } from "jquery";

function EditCustomerProfile({ props }) {
  const db = firebase.firestore();
  const storage = firebase.storage();
  const [input, setInput] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const {
    name,
    image,
    id,
    gender,
    age,
    height,
    weight,
    education,
    career,
    sport,
    other,
  } = props;

  async function postImg(image) {
    if (image) {
      const storageRef = storage.ref(`${id}/` + image.name);
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
        .child(`${id}/` + imageName)
        .getDownloadURL();
      return pathRef;
    } else {
      return "";
    }
  }

  const getInputHandler = (e) => {
    const { name } = e.target;
    console.log(e.target);
    if (name !== "customerImage") {
      setInput({ ...input, [name]: e.target.value });
    } else if (e.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(e.target.files[0]);
      fileReader.addEventListener("load", (a) => {
        setInput({
          ...input,
          imageFile: e.target.files[0],
          previewImg: a.target.result,
        });
      });
    } else {
      delete input.previewImg;
      delete input.imageFile;
      setInput({ ...input, image: input.image || image });
    }
  };

  const bindSaveHandler = async () => {
    if (input.imageFile) {
      const imageUrl = await getImg(input.imageFile);
      delete input.imageFile;
      delete input.previewImg;
      setInput({
        ...input,
        image: imageUrl,
      });
      db.collection("customers")
        .doc(id)
        .update({
          ...input,
          image: imageUrl,
        });
    } else {
      db.collection("customers").doc(id).update(input);
    }
    setIsEditing(false);
  };
  const bindEditHandler = () => {
    setIsEditing(true);
  };
  const bindCancelHandler = () => {
    setIsEditing(false);
  };

  return (
    <div id="customer-profile" className={style["customer-profile"]}>
      {isEditing ? (
        <div className={style["edit-mode"]}>
          <div className={style.buttons}>
            <button onClick={bindSaveHandler} className={style.save}>
              儲存
            </button>
            <button onClick={bindCancelHandler} className={style.cancel}>
              取消
            </button>
          </div>
          <div className={style.flexbox}>
            <div>
              <img
                src={
                  input.previewImg
                    ? input.previewImg
                    : input.image
                    ? input.image
                    : image
                    ? image
                    : noImage
                }
                alt="customer"
              />
              <div>
                <label htmlFor="image" className={style.uploadImg}>
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    name="customerImage"
                    id="image"
                    onChange={getInputHandler}
                  />
                  <i className="fa fa-picture-o" aria-hidden="true"></i>
                  上傳大頭照
                </label>
              </div>
            </div>
            <div>
              <div className={style["data-item"]}>
                <div className={style.title}>
                  <label htmlFor="customerName">姓名</label>
                </div>
                <div>
                  <input
                    placeholder="姓名"
                    name="name"
                    type="text"
                    id="customerName"
                    value={
                      input.name || input.name === ""
                        ? input.name
                        : name
                        ? name
                        : ""
                    }
                    onChange={getInputHandler}
                  />
                </div>
              </div>
              <div className={style["data-item"]}>
                <div className={style.title}>
                  <label>性別</label>
                </div>
                <div className={style["edit-gender"]}>
                  <div>
                    <input
                      type="radio"
                      name="gender"
                      value="男"
                      checked={
                        input.gender
                          ? input.gender === "男"
                            ? true
                            : false
                          : gender === "男"
                          ? true
                          : false
                      }
                      onChange={getInputHandler}
                    />
                    男
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="gender"
                      value="女"
                      checked={
                        input.gender
                          ? input.gender === "女"
                            ? true
                            : false
                          : gender === "女"
                          ? true
                          : false
                      }
                      onChange={getInputHandler}
                    />
                    女
                  </div>
                </div>
              </div>

              <div className={style["data-item"]}>
                <div className={style.title}>
                  <label htmlFor="customerAge">年齡</label>
                </div>
                <div>
                  <input
                    type="number"
                    name="age"
                    id="customerAge"
                    value={
                      input.age || input.age === "" ? input.age : age ? age : ""
                    }
                    onChange={getInputHandler}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={style.flexbox}>
            <div className={style["data-item"]}>
              <div className={style.title}>
                <label htmlFor="customerHeight">身高 </label>
              </div>
              <div>
                <input
                  type="number"
                  name="height"
                  id="customerHeight"
                  value={
                    input.height || input.height === ""
                      ? input.height
                      : height
                      ? height
                      : ""
                  }
                  onChange={getInputHandler}
                />
              </div>
            </div>

            <div className={style["data-item"]}>
              <div className={style.title}>
                <label htmlFor="customerWeight">體重 </label>
              </div>
              <div>
                <input
                  type="number"
                  name="weight"
                  id="customerWeight"
                  value={
                    input.weight || input.weight === ""
                      ? input.weight
                      : weight
                      ? weight
                      : ""
                  }
                  onChange={getInputHandler}
                />
              </div>
            </div>
          </div>

          <div className={style.flexbox}>
            <div className={style["data-item"]}>
              <div className={style.title}>
                <label>教育程度</label>
              </div>
              <div className={style["edit-education"]}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    width: "0px",
                  }}
                >
                  <input
                    type="radio"
                    name="education"
                    value="國小"
                    checked={
                      input.education
                        ? input.education === "國小"
                          ? true
                          : false
                        : education === "國小"
                        ? true
                        : false
                    }
                    onChange={getInputHandler}
                  />
                  國小
                </div>

                <div
                  style={{
                    display: "flex",
                    whiteSpace: "nowrap",
                    alignItems: "center",
                    width: "0px",
                  }}
                >
                  <input
                    type="radio"
                    name="education"
                    value="國中"
                    checked={
                      input.education
                        ? input.education === "國中"
                          ? true
                          : false
                        : education === "國中"
                        ? true
                        : false
                    }
                    onChange={getInputHandler}
                  />
                  國中
                </div>

                <div
                  style={{
                    display: "flex",
                    whiteSpace: "nowrap",
                    alignItems: "center",
                    width: "0px",
                  }}
                >
                  <input
                    type="radio"
                    name="education"
                    value="高中職"
                    checked={
                      input.education
                        ? input.education === "高中職"
                          ? true
                          : false
                        : education === "高中職"
                        ? true
                        : false
                    }
                    onChange={getInputHandler}
                  />
                  高中職
                </div>
                <div
                  style={{
                    display: "flex",
                    whiteSpace: "nowrap",
                    alignItems: "center",
                    width: "0px",
                  }}
                >
                  <input
                    type="radio"
                    name="education"
                    value="大專院校"
                    checked={
                      input.education
                        ? input.education === "大專院校"
                          ? true
                          : false
                        : education === "大專院校"
                        ? true
                        : false
                    }
                    onChange={getInputHandler}
                  />
                  大專院校
                </div>
                <div
                  style={{
                    display: "flex",
                    whiteSpace: "nowrap",
                    alignItems: "center",
                    width: "0px",
                  }}
                >
                  <input
                    type="radio"
                    name="education"
                    value="研究所"
                    checked={
                      input.education
                        ? input.education === "研究所"
                          ? true
                          : false
                        : education === "研究所"
                        ? true
                        : false
                    }
                    onChange={getInputHandler}
                  />
                  研究所
                </div>
              </div>
            </div>

            <div className={style["data-item"]}>
              <div className={style.title}>
                <label htmlFor="customerCareer">職業</label>
              </div>
              <div>
                <select
                  id="customerCareer"
                  name="career"
                  value={input.career ? input.career : career ? career : ""}
                  onChange={getInputHandler}
                >
                  <option>軍公教</option>
                  <option>工</option>
                  <option>農</option>
                  <option>商</option>
                  <option>服務業</option>
                  <option>自由業</option>
                  <option>家管</option>
                  <option>其他</option>
                </select>
              </div>
            </div>
          </div>

          <div className={`${style.flexcol} `}>
            <div className={style.col}>
              <div className={style.title}>
                <label htmlFor="customerSport">運動習慣</label>
              </div>
              <div>
                <textarea
                  id="customerSport"
                  name="sport"
                  value={
                    input.sport || input.sport === ""
                      ? input.sport
                      : sport
                      ? sport
                      : ""
                  }
                  onChange={getInputHandler}
                ></textarea>
              </div>
            </div>
            <div className={style.col}>
              <div className={style.title}>
                <label htmlFor="customerOther">
                  <div>其他</div>
                  <span>（例：自身狀況、特別需求）</span>
                </label>
              </div>
              <div>
                <textarea
                  name="other"
                  id="customerOther"
                  value={
                    input.other || input.other === ""
                      ? input.other
                      : other
                      ? other
                      : ""
                  }
                  onChange={getInputHandler}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={style["profile-data"]}>
          <div className={style.edit}>
            <button onClick={bindEditHandler}>編輯</button>
          </div>
          <CustomerProfile props={props} input={input} />
        </div>
      )}
    </div>
  );
}

export default EditCustomerProfile;
