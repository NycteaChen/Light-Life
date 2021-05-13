import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
function RenderCustomerProfile() {
  const [profile, setProfile] = useState();
  useEffect(() => {
    firebase
      .firestore()
      .collection("customers")
      .get()
      .then((snapshot) => {
        const users = [];
        snapshot.forEach((doc) => {
          users.push(doc.data());
        });
        return users[0];
      })
      .then((res) => {
        setProfile(res);
      });
  }, []);
  console.log(profile);

  return (
    <div id="personal-profile">
      <div>個人資料</div>
      <div>
        <div>
          姓名<span id="name">{profile ? profile.name : ""}</span>
        </div>
      </div>
      <div>
        <div>
          系統編號<span id="number">{profile ? profile.id : ""}</span>
        </div>
      </div>
      <div>
        <div>
          性別 <span id="gender">{profile ? profile.gender : ""}</span>
        </div>
      </div>
      <div>
        <div>
          年齡 <span id="age">{profile ? profile.age : ""}</span>
        </div>
        <div>
          身高 <span id="height">{profile ? profile.height : ""}</span> cm
        </div>
        <div>
          體重 <span id="weight">{profile ? profile.weight : ""}</span> kg{" "}
        </div>
      </div>
      <div>
        <div>
          教育程度{" "}
          <span id="education">{profile ? profile.education : ""}</span>
        </div>
      </div>
      <div>
        <div>
          職業 <span id="career">{profile ? profile.career : ""}</span>
        </div>
      </div>
      <div>
        <div>運動習慣</div>
        <div id="sport">{profile ? profile.sport : ""}</div>
      </div>
      <div>
        <div>其他（例：自身狀況、特別需求）</div>
        <div id="other">{profile ? profile.other : ""}</div>
      </div>
    </div>
  );
}

export default RenderCustomerProfile;
