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
import "../../../style/basic.scss";
import "../../../style/dietitianProfile.scss";

function DietitianProfile({ profile }) {
  return (
    <>
      <div className="edit-Dprofile">
        <div className="basic-profile">
          <div className="flexbox">
            <div className="img">
              <img src={profile.image} />
              <input type="file" accept="image/*" name="image" />
              <div>專業形象將為您加分</div>
            </div>
            <div>
              <div className="determined">
                <div className="title">帳號</div>
                <div className="email">jaoasfg@emgia.com</div>
                <div className="title number">會員編號</div>
                <div className="id">{profile.id}</div>
              </div>
              <div className="basic">
                <label className="name">姓名</label>
                <input type="text" name="name" id="name" value={profile.name} />
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
            <div className="education">
              <label id="highestDegree">最高學歷</label>
              <div className="edu-select">
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
            <div className="skills">
              <label id="skill">專長</label>
              <div className="select-skill">
                <label>
                  <input className="skill" type="checkbox" value="體重管理" />
                  體重管理
                </label>
                <label>
                  <input className="skill" type="checkbox" value="運動營養" />
                  運動營養
                </label>
                <label>
                  <input className="skill" type="checkbox" value="血糖控制" />
                  血糖控制
                </label>
                <label>
                  <input className="skill" type="checkbox" value="三高控制" />
                  三高控制
                </label>
              </div>
            </div>

            <div className="other">
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
