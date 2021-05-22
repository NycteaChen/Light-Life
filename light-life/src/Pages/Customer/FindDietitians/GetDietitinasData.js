import React, { useEffect, useState } from "react";
import DietitianData from "./DietitianData.js";

function GetDietitiansData({ props, setReserve, profile }) {
  const [isCheck, setIsCheck] = useState(false); //false
  const [checkIndex, setCheckIndex] = useState("");
  const bindCheckHandler = (e) => {
    setCheckIndex(e.target.id);
    setIsCheck(true);
  };

  return (
    <>
      {props.map((d, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "20px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <img
              src={props ? d.image : ""}
              alt="dietitian"
              style={{ width: "200px", height: "200px", borderRadius: "50%" }}
            ></img>
            <div>
              <div>
                <span>{d.name}</span>營養師
              </div>
              <button onClick={bindCheckHandler} id={index}>
                查看詳情
              </button>
            </div>
          </div>
          {isCheck && index === parseInt(checkIndex) ? (
            <>
              <DietitianData
                setReserve={setReserve}
                props={d}
                setIsCheck={setIsCheck}
                style={{ marginLeft: "20px" }}
                profile={profile}
              />
            </>
          ) : (
            ""
          )}
        </div>
      ))}
    </>
  );
}

export default GetDietitiansData;
