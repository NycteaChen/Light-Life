import React, { useEffect, useState } from "react";
import { getCustomerData, getTargetData } from "../../../utils/Firebase.js";
import { useParams } from "react-router-dom";
import TargetHandler from "../../Components/TargetHandler/TargetHandler.js";
import style from "../../../style/target.module.scss";

function CustomerTarget() {
  const [target, setTarget] = useState(null);
  const { cID } = useParams();
  useEffect(() => {
    getCustomerData(cID)
      .then((doc) => {
        return doc.data().dietitian;
      })
      .then((res) => {
        getTargetData(res, cID).then((docs) => {
          const targetArray = [];
          docs.forEach((doc) => {
            targetArray.push(doc.data());
          });
          setTarget(targetArray);
        });
      });
  }, [cID]);

  return (
    <>
      <div className={style["target-setting"]} id="dietitian-target">
        <h5 className={style["customer-h5"]}>已設立目標</h5>
        <p>您的營養師為您設立的目標</p>
        <div className={style["c-targets"]}>
          <TargetHandler target={target} />
        </div>
      </div>
    </>
  );
}

export default CustomerTarget;
