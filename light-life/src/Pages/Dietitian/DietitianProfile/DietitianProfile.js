import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import style from "../../../style/dietitianProfile.module.scss";

function DietitianProfile({ profile, setProfile }) {
  const db = firebase.firestore();
  const storage = firebase.storage();
  const { name, image, id, gender, email, education, skills, other } = profile;
  const [trigger, setTrigger] = useState(true);
  const [edu, setEdu] = useState({
    school: education ? education.school : "",
    department: education ? education.department : "",
    degree: education ? education.degree : "",
  });
  const [skill, setSkill] = useState({
    threeHigh: skills ? skills.threeHigh : false,
    sportNT: skills ? skills.sportNT : false,
    weightControl: skills ? skills.weightControl : false,
    bloodSugar: skills ? skills.bloodSugar : false,
  });
  const [input, setInput] = useState({
    name: name,
    image: image,
    gender: gender ? gender : false,
    education: edu,
    skills: skill,
  });

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
    if (e.target.className === "education") {
      setEdu({ ...edu, [name]: e.target.value });
      setInput({ ...input, education: { ...edu, [name]: e.target.value } });
    } else if (name === "skills") {
      setSkill({ ...skill, [e.target.value]: !skill[e.target.value] });
      setInput({
        ...input,
        skills: { ...skill, [e.target.value]: !skill[e.target.value] },
      });
    } else if (name !== "image") {
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
    {
    }
  };
  useEffect(() => {
    console.log("test");
  }, [trigger]);

  const saveDietitianProfile = async () => {
    if (
      input.name &&
      input.gender &&
      edu.school &&
      edu.department &&
      edu.degree
    ) {
      if (input.imageFile) {
        const imageUrl = await getImg(input.imageFile);
        delete input.imageFile;
        delete input.previewImg;
        setInput({
          ...input,
          image: imageUrl,
        });
        db.collection("dietitians")
          .doc(id)
          .update({
            ...input,
            image: imageUrl,
          })
          .then(() => {
            setTrigger(!trigger);
            alert("儲存囉");
            setProfile({ ...profile, ...input, image: imageUrl });
          });
      } else {
        db.collection("dietitians")
          .doc(id)
          .update(input)
          .then(() => {
            setTrigger(!trigger);
            alert("儲存囉");
            setProfile({ ...profile, ...input });
          });
      }
    } else {
      alert("必填資料未填完整");
    }
  };
  return (
    <>
      <div className={style["edit-Dprofile"]}>
        <form className={style["basic-profile"]} action="javascript:void(0);">
          <div className={style.flexbox}>
            <div className={style.img}>
              <a
                href={
                  input.previewImg
                    ? input.previewImg
                    : input.image
                    ? input.image
                    : image
                }
                target="_blank"
              >
                <img
                  src={
                    input.previewImg
                      ? input.previewImg
                      : input.image
                      ? input.image
                      : image
                  }
                  alt="profile"
                />
              </a>

              <div>
                <label htmlFor="image" className={style.uploadImg}>
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    name="image"
                    id="image"
                    onChange={getInputHandler}
                  />
                  <i className="fa fa-picture-o" aria-hidden="true"></i>
                  上傳大頭照
                </label>
                <div>專業形象將為您加分</div>
              </div>
            </div>
            <div>
              <div className={style.determined}>
                <div className={style.title}>帳號</div>
                <div className="email">{email}</div>
              </div>
              <div className={style.basic}>
                <label className="name">姓名</label>
                <input
                  type="text"
                  name="name"
                  id={style.name}
                  required
                  value={
                    input.name || input.name === ""
                      ? input.name
                      : name
                      ? name
                      : ""
                  }
                  onChange={getInputHandler}
                />
                <label className="gender">生理性別</label>
                <div>
                  <input
                    type="radio"
                    name="gender"
                    value="男"
                    required
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
                    required
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
          </div>
          <div>
            <div className={style.education}>
              <label id={style.highestDegree}>最高學歷</label>
              <div className={style["edu-select"]}>
                <input
                  type="text"
                  className="education"
                  name="school"
                  value={edu.school ? edu.school : ""}
                  onChange={getInputHandler}
                  required
                />
                <input
                  type="text"
                  className="education"
                  name="department"
                  value={edu.department ? edu.department : ""}
                  onChange={getInputHandler}
                  required
                />
                <div>
                  <label>
                    <input
                      type="radio"
                      className="education"
                      name="degree"
                      value="學士"
                      onChange={getInputHandler}
                      required
                      checked={edu.degree === "學士" ? true : false}
                    />
                    學士
                  </label>
                  <label>
                    <input
                      type="radio"
                      className="education"
                      name="degree"
                      value="碩士"
                      onChange={getInputHandler}
                      required
                      checked={edu.degree === "碩士" ? true : false}
                    />
                    碩士
                  </label>
                  <label>
                    <input
                      type="radio"
                      className="education"
                      name="degree"
                      value="博士"
                      required
                      onChange={getInputHandler}
                      checked={edu.degree === "博士" ? true : false}
                    />
                    博士
                  </label>
                </div>
              </div>
            </div>
            <div className={style.skills}>
              <label className={style.skill}>專長</label>
              <div className={style["select-skill"]}>
                <label>
                  <input
                    type="checkbox"
                    name="skills"
                    value="weightControl"
                    onChange={getInputHandler}
                    checked={skill.weightControl}
                  />
                  體重管理
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="skills"
                    value="sportNT"
                    onChange={getInputHandler}
                    checked={skill.sportNT}
                  />
                  運動營養
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="skills"
                    value="bloodSugar"
                    onChange={getInputHandler}
                    checked={skill.bloodSugar}
                  />
                  血糖控制
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="skills"
                    value="threeHigh"
                    onChange={getInputHandler}
                    checked={skill.threeHigh}
                  />
                  三高控制
                </label>
              </div>
            </div>

            <div className={style.other}>
              <label>其他</label>
              <p>補充更多資訊讓客戶更了解你！（例：經歷、證照、其他專長）</p>
              <textarea
                cols="40"
                rows="6"
                name="other"
                value={
                  input.other || input.other === ""
                    ? input.otehr
                    : other
                    ? other
                    : ""
                }
                onChange={getInputHandler}
              ></textarea>
            </div>
          </div>
          <button onClick={saveDietitianProfile}>儲存</button>
        </form>
      </div>
    </>
  );
}
export default DietitianProfile;
