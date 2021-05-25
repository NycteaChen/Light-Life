import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import React from "react";
import logo from "../../images/lightlife-horizontal.png";
import style from "../../style/home.module.scss";
import $ from "jquery";
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
      <header className={style["home-header"]}>
        <div>
          <a href="/">
            <img src={logo} alt="LightLifeLogo" id="logo" id={style.logo} />
          </a>
          <nav className={style["header-nav"]}>
            <a href="#about">關於本站</a>
            <a href="#contact">聯絡我們</a>
            <a href="/">登入</a>
          </nav>
        </div>
      </header>
      <main className={style["home-main"]}>
        <div className={style.cover}>
          <div className={style["main-title"]}>
            <h2>Bring you to light life</h2>
            <a href="/">
              <button>使用服務</button>
            </a>
          </div>
        </div>
        <div className={style.col}>
          <div className={style.background}></div>
          <div className={style.content} id="about">
            <article className={style.about}>
              <section>
                <div className={style.sectionText}>
                  <h2>關於本站</h2>
                  <h3>您在尋找客戶嗎？</h3>
                  <p>
                    本站是一個營養師媒合平台，我們提供營養師一個接案管道，讓您能自由開拓自己的營養事業。
                  </p>
                  <p>本站設有客戶管理系統，讓您能方便管理您的每位客戶。</p>
                  <p>若您是有高考證照的營養師，即可註冊本站服務。</p>
                </div>
                <img className={style.firstImg} alt="lightlife-about" />
              </section>
              <section>
                <div className={style.sectionText}>
                  <h3 className={style.subtitle}>您想尋找營養師嗎？</h3>
                  <p>本站有來自各地的專業營養師，讓您能選擇自己的營養管家。</p>
                  <p>
                    每次服務時間最長為兩週，可以續約，期間內營養師將為您分析每日飲食狀況，此外您可以向您的營養師詢問各類營養資訊。
                  </p>
                  <p>若您是需要營養師的民眾，即可註冊本站服務。</p>
                </div>
                <img className={style.secondImg} alt="service" />
              </section>
            </article>
          </div>
        </div>
        <div className={style.contact} id="contact">
          <div className={style["contact-title"]}>
            <h2>聯絡我們</h2>
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
        <section className={style.service}>
          <p>We will bring you to light life!</p>
          <a href="/">
            <button>使用服務</button>
          </a>
        </section>
      </main>
      <aside>
        <a href="#top" id={style.toTop}></a>
      </aside>
      <footer>
        <div>
          <a
            href="https://github.com/NycteaChen"
            target="_blank"
            rel="noreferrer"
          >
            <i
              className={`fa fa-github ${style.gitIcon}`}
              aria-hidden="true"
            ></i>
          </a>
          <p>jungturn01tw@gmail.com</p>
        </div>
        <p>&copy;2021 Light Life</p>
      </footer>
    </>
  );
}

export default Home;
