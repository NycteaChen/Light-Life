import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import noImage from "../images/noimage.png";
import { parseWithOptions } from "date-fns/fp";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

function CustomerProfile({ props }) {
  const [input, setInput] = useState({});
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

  const inputChangeHandler = (e) => {
    const { name } = e.target;
    if (name !== "image") {
      setInput({ ...input, [name]: e.target.value });
    } else {
      setInput({ ...input, [name]: e.target.files[0].name });
    }
  };

  const bindSaveHandler = () => {
    console.log(input);
  };

  return (
    <>
      <div id="customer-profile">
        <div>客戶資料</div>
        <div>
          <img
            src={props ? image : noImage}
            alt="customer"
            style={{ width: "200px", height: "200px", borderRadius: "50%" }}
          />
          <div>
            <label>上傳大頭照</label>
            <input
              type="file"
              accept="image/*"
              id="image"
              name="image"
              onChange={inputChangeHandler}
            />
          </div>
        </div>
        <div>
          姓名
          <input
            placeholder="姓名"
            name="name"
            type="text"
            id="name"
            value={input.name ? input.name : name}
            onChange={inputChangeHandler}
          />
        </div>
        <div>
          <div>
            系統編號<span id="number">{id}</span>
          </div>
        </div>
        <div>
          <label>性別 </label>
          <label>
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
              onChange={inputChangeHandler}
            />
            男
          </label>
          <label>
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
              onChange={inputChangeHandler}
            />
            女
          </label>
        </div>
        <div>
          <label>
            年齡{" "}
            <input
              type="number"
              name="age"
              value={input.age ? input.age : age}
              onChange={inputChangeHandler}
            />
            歲
          </label>
        </div>
        <div>
          <label>
            身高{" "}
            <input
              type="number"
              name="height"
              value={input.height ? input.height : height}
              onChange={inputChangeHandler}
            />
            cm
          </label>
        </div>
        <div>
          <label>
            體重{" "}
            <input
              type="number"
              name="weight"
              value={input.weight ? input.weight : weight}
              onChange={inputChangeHandler}
            />
            kg
          </label>
        </div>
        <div>
          <label>教育程度</label>
          <label>
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
              onChange={inputChangeHandler}
            />
            國小
          </label>
          <label>
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
              onChange={inputChangeHandler}
            />
            國中
          </label>
          <label>
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
              onChange={inputChangeHandler}
            />
            高中職
          </label>
          <label>
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
              onChange={inputChangeHandler}
            />
            大專院校
          </label>
          <label>
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
              onChange={inputChangeHandler}
            />
            研究所
          </label>
        </div>
        <label>
          職業
          <select
            name="career"
            value={input.career ? input.career : career}
            onChange={inputChangeHandler}
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
        </label>
        <div>
          <label>
            運動習慣（請大致描述您的運動習慣）{" "}
            <div>
              <input
                type="textarea"
                name="sport"
                value={input.sport ? input.sport : sport ? sport : ""}
                onChange={inputChangeHandler}
              />
            </div>
          </label>
        </div>
        <div>
          <label>
            其他（例：自身狀況、特別需求）{" "}
            <div>
              <input
                type="textarea"
                name="other"
                value={input.other ? input.other : other ? other : ""}
                onChange={inputChangeHandler}
              />
            </div>
          </label>
        </div>
        <button onClick={bindSaveHandler}>儲存</button>
      </div>
    </>
  );
}

function DietitianCustomerProfilte({ props }) {
  return (
    <div id="personal-profile">
      <div>個人資料</div>
      <div>
        <img
          id="profile-img"
          src={props ? props.image : noImage}
          alt="customer"
          style={{ width: "200px", height: "200px", borderRadius: "50%" }}
        />
      </div>
      <div>
        姓名<span id="name">{props ? props.name : ""}</span>
      </div>
      <div>
        <div>
          系統編號<span id="number">{props ? props.id : ""}</span>
        </div>
      </div>
      <div>
        <div>
          性別 <span id="gender">{props ? props.gender : ""}</span>
        </div>
      </div>
      <div>
        <div>
          年齡 <span id="age">{props ? props.age : ""}</span>
        </div>
        <div>
          身高 <span id="height">{props ? props.height : ""}</span> cm
        </div>
        <div>
          體重 <span id="weight">{props ? props.weight : ""}</span> kg{" "}
        </div>
      </div>
      <div>
        <div>
          教育程度 <span id="education">{props ? props.education : ""}</span>
        </div>
      </div>
      <div>
        <div>
          職業 <span id="career">{props ? props.career : ""}</span>
        </div>
      </div>
      <div>
        <div>運動習慣</div>
        <div id="sport">{props ? props.sport : ""}</div>
      </div>
      <div>
        <div>其他（例：自身狀況、特別需求）</div>
        <div id="other">{props ? props.other : ""}</div>
      </div>
    </div>
  );
}

function RenderCustomerProfile({ profileData }) {
  const pathName = useLocation().pathname;

  if (pathName.includes("dietitian")) {
    return <DietitianCustomerProfilte props={profileData} />;
  } else {
    return <CustomerProfile props={profileData} />;
  }
}

export default RenderCustomerProfile;
