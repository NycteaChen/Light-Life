import React, { useEffect, useState } from "react";
import DietitianData from "./DietitianData.js";
import style from "../../../style/findDietitian.module.scss";

function GetDietitiansData({ props, setReserve, profile, reserve }) {
  const [isChecked, setIsChecked] = useState(false); //false
  const [checkIndex, setCheckIndex] = useState("");
  const bindCheckHandler = (e) => {
    setCheckIndex(e.target.id);
    setIsChecked(true);
  };

  return (
    <div className={style.dietitianList}>
      {props ? (
        props.length > 0 ? (
          props.map((d, index) => (
            <div key={index} className={style.dietitian}>
              <img src={props ? d.image : ""} alt="dietitian"></img>
              <div>
                <div className={style.col}>
                  <div className={style.name}>{d.name}營養師</div>
                  <button onClick={bindCheckHandler} id={index}>
                    查看詳情
                  </button>
                  {isChecked && index === +checkIndex ? (
                    <DietitianData
                      setReserve={setReserve}
                      props={d}
                      setIsChecked={setIsChecked}
                      profile={profile}
                      reserve={reserve}
                    />
                  ) : (
                    ""
                  )}
                </div>
                <div className={style.info} style={{ textAlign: "left" }}>
                  <div>
                    學歷： {d.education["school"]} {d.education["degree"]}
                  </div>
                  <>
                    {d.skills.weightControl ||
                    d.skills.sportNT ||
                    d.skills.threeHigh ||
                    d.skills.bloodSugar ? (
                      <div>
                        專長：
                        <div>
                          {d.skills.weightControl ? "體重管理　" : ""}
                          {d.skills.sportNT ? "運動營養　" : ""}
                          {d.skills.threeHigh ? "三高控制　" : ""}
                          {d.skills.bloodSugar ? "血糖控制" : ""}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>暫無</div>
        )
      ) : (
        <div>loading</div>
      )}
    </div>
  );
}

export default GetDietitiansData;
