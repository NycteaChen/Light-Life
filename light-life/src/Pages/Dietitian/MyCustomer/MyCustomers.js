import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import Profile from "../../Components/CustomerProfile/CusotmerProfile.js";
import DietrayRecord from "../../Components/DietaryRecord/DietaryRecord.js";
import DietitianTarget from "../Target/DietitianTarget.js";

function MyCustomers({ customers }) {
  const input = {};
  return (
    <Router>
      <ul>
        <div className="nav-title">客戶清單</div>
        <div className="customerList" style={{ display: "block" }}>
          {customers.map((c) => (
            <li key={c.id}>
              <Link to={`/dietitian/${c.dietitian}/customer/${c.id}`}>
                {c.name}
              </Link>
              <Switch>
                <Route path={`/dietitian/${c.dietitian}/customer/${c.id}`}>
                  <Router>
                    <Link
                      to={`/dietitian/${c.dietitian}/customer/${c.id}/profile`}
                    >
                      基本資料
                    </Link>
                    <Link
                      to={`/dietitian/${c.dietitian}/customer/${c.id}/dietary`}
                    >
                      飲食記錄
                    </Link>
                    <Link
                      to={`/dietitian/${c.dietitian}/customer/${c.id}/target`}
                    >
                      目標設定
                    </Link>
                    <Switch>
                      <Route
                        exact
                        path={`/dietitian/:dID/customer/:cID/profile`}
                      >
                        <Profile props={c} input={input} />
                      </Route>
                      <Route path={`/dietitian/:dID/customer/:cID/dietary`}>
                        <DietrayRecord />
                      </Route>
                      <Route
                        exact
                        path={`/dietitian/:dID/customer/:cID/target`}
                      >
                        <DietitianTarget />
                      </Route>
                    </Switch>
                  </Router>
                </Route>
              </Switch>
            </li>
          ))}
        </div>
      </ul>
    </Router>
  );
}

export default MyCustomers;
