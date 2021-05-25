import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import noImage from "../../../images/noimage.png";
import CustomerProfile from "./CusotmerProfile.js";

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
    if (name !== "image") {
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
      setInput({ ...input, image: image });
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
        .doc("9iYZMkuFdZRK9vxgt1zc")
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

  return (
    <div id="customer-profile">
      {isEditing ? (
        <>
          <div>
            <div>個人資料</div>
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
              style={{ width: "200px", height: "200px", borderRadius: "50%" }}
            />
            <div>
              <label for="customerImage">上傳大頭照</label>
              <input
                type="file"
                accept="image/*"
                id="image"
                name="customerImage"
                onChange={getInputHandler}
              />
            </div>
          </div>
          <div>
            <label for="customerName">姓名</label>
            <input
              placeholder="姓名"
              name="name"
              type="text"
              id="customerName"
              value={
                input.name || input.name === "" ? input.name : name ? name : ""
              }
              onChange={getInputHandler}
            />
          </div>
          <div>
            <label>性別 </label>
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
          <div>
            <label for="customerAge">年齡 </label>
            <input
              type="number"
              name="age"
              id="customerAge"
              value={input.age || input.age === "" ? input.age : age ? age : ""}
              onChange={getInputHandler}
            />
            歲
          </div>
          <div>
            <label for="customerHeight">身高 </label>
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
            cm
          </div>
          <div>
            <label for="customerWeight">體重 </label>
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
            kg
          </div>
          <div>
            <label>教育程度</label>
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
          <div>
            <label for="customerCareer">職業</label>
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
          <div>
            <label for="customerSport">
              運動習慣（請大致描述您的運動習慣）{" "}
            </label>
            <div>
              <input
                id="customerSport"
                type="textarea"
                name="sport"
                value={
                  input.sport || input.sport === ""
                    ? input.sport
                    : sport
                    ? sport
                    : ""
                }
                onChange={getInputHandler}
              />
            </div>
          </div>
          <div>
            <label for="customerOther">其他（例：自身狀況、特別需求） </label>
            <div>
              <input
                type="textarea"
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
              />
            </div>
          </div>
          <button onClick={bindSaveHandler}>儲存</button>
        </>
      ) : (
        <>
          <button onClick={bindEditHandler}>編輯</button>
          <CustomerProfile props={props} input={input} />
        </>
      )}
    </div>
  );
}

export default EditCustomerProfile;
