import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import firebase from "firebase/app";
import "firebase/firestore";
import style from "../../../style/dietitianProfile.module.scss";

function DietitianProfile({ profile }) {
  return (
    <>
      <div className={style["edit-Dprofile"]}>
        <div className={style["basic-profile"]}>
          <div className={style.flexbox}>
            <div className={style.img}>
              <a href={profile.image} target="_blank">
                <img src={profile.image} alt="profile" />
              </a>
              <input type="file" accept="image/*" name="image" />
              <div>專業形象將為您加分</div>
            </div>
            <div>
              <div className={style.determined}>
                <div className={style.title}>帳號</div>
                <div className="email">jaoasfg@emgia.com</div>
              </div>
              <div className={style.basic}>
                <label className="name">姓名</label>
                <input
                  type="text"
                  name="name"
                  id={style.name}
                  value={profile.name}
                />
                <label className="gender">生理性別</label>
                <div>
                  <input
                    type="radio"
                    name="gender"
                    checked={profile.gender === "男" ? "checked" : null}
                  />
                  男
                  <input
                    type="radio"
                    name="gender"
                    checked={profile.gender === "女" ? "checked" : null}
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
                  name="school"
                  value={profile.education ? profile.education["school"] : ""}
                />
                <input
                  type="text"
                  name="department"
                  value={
                    profile.education ? profile.education["department"] : ""
                  }
                />
                <div>
                  <label>
                    <input
                      type="radio"
                      name="education"
                      value="學士"
                      checked={
                        profile.education
                          ? profile.education["degree"] === "學士"
                            ? "checked"
                            : null
                          : null
                      }
                    />
                    學士
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="education"
                      value="碩士"
                      checked={
                        profile.education
                          ? profile.education["degree"] === "碩士"
                            ? "checked"
                            : null
                          : null
                      }
                    />
                    碩士
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="education"
                      value="博士"
                      checked={
                        profile.education
                          ? profile.education["degree"] === "博士"
                            ? "checked"
                            : null
                          : null
                      }
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
                  <input type="checkbox" value="體重管理" />
                  體重管理
                </label>
                <label>
                  <input type="checkbox" value="運動營養" />
                  運動營養
                </label>
                <label>
                  <input type="checkbox" value="血糖控制" />
                  血糖控制
                </label>
                <label>
                  <input type="checkbox" value="三高控制" />
                  三高控制
                </label>
              </div>
            </div>

            <div className={style.other}>
              <label>其他</label>
              <p>補充更多資訊讓客戶更了解你！（例：經歷、證照、其他專長）</p>
              <textarea cols="40" rows="6">
                安安尼好
              </textarea>
            </div>
          </div>
          <button>儲存</button>
        </div>
      </div>
    </>
  );
}
export default DietitianProfile;
