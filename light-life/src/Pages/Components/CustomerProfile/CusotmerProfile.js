import React from "react";
import "firebase/firestore";
import "firebase/storage";
import noImage from "../../../images/noimage.png";

function CustomerProfile({ props, input }) {
  return (
    <div id="personal-profile">
      <div>個人資料</div>
      <div>
        <img
          id="profile-img"
          src={input.image ? input.image : props.image ? props.image : noImage}
          alt="customer"
          style={{ width: "200px", height: "200px", borderRadius: "50%" }}
        />
      </div>
      <div>
        姓名
        <span id="name">
          {input.name ? input.name : props ? props.name : ""}
        </span>
      </div>
      <div>
        <div>
          系統編號<span id="number">{props ? props.id : ""}</span>
        </div>
      </div>
      <div>
        <div>
          性別{" "}
          <span id="gender">
            {input.gender ? input.gender : props ? props.gender : ""}
          </span>
        </div>
      </div>
      <div>
        <div>
          年齡{" "}
          <span id="age">{input.age ? input.age : props ? props.age : ""}</span>
        </div>
        <div>
          身高{" "}
          <span id="height">
            {input.height ? input.height : props ? props.height : ""}
          </span>{" "}
          cm
        </div>
        <div>
          體重{" "}
          <span id="weight">
            {input.weight ? input.weight : props ? props.weight : ""}
          </span>{" "}
          kg{" "}
        </div>
      </div>
      <div>
        <div>
          教育程度{" "}
          <span id="education">
            {input.education ? input.education : props ? props.education : ""}
          </span>
        </div>
      </div>
      <div>
        <div>
          職業{" "}
          <span id="career">
            {input.career ? input.career : props ? props.career : ""}
          </span>
        </div>
      </div>
      <div>
        <div>運動習慣</div>
        <div id="sport">
          {input.sport ? input.sport : props ? props.sport : ""}
        </div>
      </div>
      <div>
        <div>其他（例：自身狀況、特別需求）</div>
        <div id="other">
          {input.other ? input.other : props ? props.other : ""}
        </div>
      </div>
    </div>
  );
}

export default CustomerProfile;
