import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

function DietitianTarget() {
  return (
    <div id="dietitian-target">
      <h2>目標設定</h2>
      <h3>已設立目標</h3>
      <div id="customer-target">
        <div>
          時間範圍
          <span>5-12</span>
          <span>至 </span>
          <span>5-21</span>
        </div>
        <div>
          <div>
            目標體重
            <span>1</span>
            kg
          </div>
        </div>
        <div>
          <div>
            目標水分
            <span>123</span> cc
          </div>
        </div>
        <div>
          <div>
            其他 <span>test</span>
          </div>
        </div>
      </div>
      <h3>新增目標</h3>
      <label>
        時間範圍
        <input
          type="date"
          id="target-start"
          min="2021-05-14"
          max="2021-05-31"
        />
      </label>
      <label>
        至
        <input type="date" id="target-end" min="2021-05-14" max="2021-05-21" />
      </label>
      <div>
        <label>
          目標體重
          <input type="text" />
          kg
        </label>
      </div>
      <div>
        <label>
          目標水分
          <input type="text" />
          cc
        </label>
      </div>
      <div>
        <label>
          其他
          <input type="textarea" />
        </label>
      </div>
      <button>新增</button>
    </div>
  );
}

function CustomerTarget() {
  return (
    <>
      <div id="dietitian-target">
        <h2>目標設定</h2>
        <h3>已設立目標</h3>
        <div id="customer-target">
          <div>
            時間範圍
            <span>5-12</span>
            <span>至 </span>
            <span>5-21</span>
          </div>
          <div>
            <div>
              目標體重
              <span>1</span>
              kg
            </div>
          </div>
          <div>
            <div>
              目標水分
              <span>123</span> cc
            </div>
          </div>
          <div>
            <div>
              其他 <span>test</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function RenderTarget() {
  const pathName = useLocation().pathname;
  if (pathName.includes("dietitian")) {
    return (
      <>
        <DietitianTarget />
      </>
    );
  } else {
    return (
      <>
        <CustomerTarget />
      </>
    );
  }
}

export default RenderTarget;
