import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import React from "react";
import cover from "../../images/cover.png";
import about from "../../images/about.png";
import service from "../../images/service.png";
import plan from "../../images/plan.png";
import styled from "styled-components";
import logo from "../../images/lightlife-horizontal.svg";
import "../../style/home.scss";

// const Cover = styled.div`
//   background: url(${cover});
//   background-size: cover;
//   background-position: center;
//   height: 600px;
//   margin-top: 78px;
//   position: relative;
//   /* &::after {
//     content: "";
//     position: absolute;
//     background: rgba(255, 255, 255, 0.5);
//     height: 700px;
//   } */
// `;

function Home() {
  return (
    <>
      <header>
        <div>
          <a href="/">
            <img src={logo} alt="LightLifeLogo" id="logo" />
          </a>
          <nav className="header-nav">
            <a href="#about">關於本站</a>
            <a href="#contact">聯絡我們</a>
            <a href="/">登入</a>
          </nav>
        </div>
      </header>
      <main>
        <div id="cover">
          <div className="main-title">
            <h2>Bring you to light life</h2>
            <a href="/">
              <button>使用服務</button>
            </a>
          </div>
        </div>
        <div className="col">
          <div className="background"></div>
          <div className="content" id="about">
            <article className="about">
              <section>
                <div className="sectionText">
                  <h2>關於本站</h2>
                  <h3>您在尋找客戶嗎？</h3>
                  <p>
                    本站是一個營養師媒合平台，我們提供營養師一個接案管道，讓您能自由開拓自己的營養事業。
                  </p>
                  <p>本站設有客戶管理系統，讓您能方便管理您的每位客戶。</p>
                  <p>若您是有高考證照的營養師，即可註冊本站服務。</p>
                </div>
                <img className="firstImg" alt="lightlife-about" />
              </section>
              <section>
                <div className="sectionText">
                  <h3 className="subtitle">您想尋找營養師嗎？</h3>
                  <p>
                    本站配合來自各地的專業營養師，讓客戶能選擇自己的營養管家。
                  </p>
                  <p>
                    每次服務時間最長為兩週，可以續約，期間內營養師將為您分析每日飲食狀況，此外您可以向您的營養師詢問各類營養資訊。
                  </p>
                  <p>若您是需要營養師的民眾，即可註冊本站服務。</p>
                </div>
                <img className="secondImg" alt="service" />
              </section>
            </article>
          </div>
        </div>
        <div className="contact">
          <div className="contact-title">
            <h2 id="contact">聯絡我們</h2>
            <p>對本站有任何疑問或回饋請告訴我們！</p>
          </div>
          <section>
            <form>
              <label>
                您的大名
                <div>
                  <input type="text" name="name" id="name" required />
                </div>
              </label>
              <label>
                信箱
                <div>
                  <input type="email" name="email" id="email" required />
                </div>
              </label>
              <label>
                內容
                <div>
                  <textarea
                    name="text"
                    rows="6"
                    cols="40"
                    id="text"
                    required
                  ></textarea>
                </div>
              </label>
              <div id="submit">
                <button>提交</button>
              </div>
            </form>
          </section>
        </div>
        <section className="service">
          <p>We will bring you to light life!</p>
          <a href="/">
            <button>使用服務</button>
          </a>
        </section>
      </main>
      <aside>
        <a href="#top" id="toTop"></a>
      </aside>
      <footer>
        <div>
          <a href="https://github.com/NycteaChen" target="_blank">
            <i className="fa fa-github" aria-hidden="true"></i>
          </a>
          <p>jungturn01tw@gmail.com</p>
        </div>
        <p>&copy;2021 Light Life</p>
      </footer>
    </>
  );
}

export default Home;
