import { useState, useEffect } from "react";
import axios from "axios";
import "./style/App.scss";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar.js";
import NavBar from "./components/NavBar.js";
import Home from "./components/Home.js";
import NoMatch from "./components/NoMatch.js";
import Login from "./components/notSignedInComponents/Login.js";
import Register from "./components/notSignedInComponents/Register.js";
import RegisterVerification from "./components/notSignedInComponents/RegisterVerification.js";
import CarouselComponent from "./components/CarouselComponent.js";
import UserContext from "./user/UserContext.js";
import AgainRegisterVerification from "./components/notSignedInComponents/AgainRegisterVerification.js";
import PasswordReset from "./components/notSignedInComponents/PasswordReset.js";

function App() {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  axios.defaults.withCredentials = true;

  useEffect(() => {
    userIsLoggedIn();
  }, []);

  const userIsLoggedIn = () => {
    axios
      .get("http://localhost:8080/users/auth")
      .then((response) => {
        if (response.data.err) {
          setError(response.data.err);
        } else if (response.data.user) {
          setUser(response.data.user);
          localStorage.setItem("token", response.data.token);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const pageTransitions = {
    pageVariants: {
      in: {
        opacity: 1,
        y: 0,
        scale: 1,
      },
      out: {
        opacity: 0,
        y: "-100%",
        scale: 0.5,
      },
    },
    pageTransition: {
      type: "tween",
      duration: 0.3,
    },
  };

  const location = useLocation();

  return (
    <div className="App">
      <CarouselComponent />
      {loading ? (
        <h1 style={{ margin: "20px", textAlign: "center" }}>
          <i className="fa fa-spinner fa-spin" />
        </h1>
      ) : error ? (
        <h4 style={{ margin: "20px", textAlign: "center" }}>{error}</h4>
      ) : (
        <UserContext.Provider value={{ user, setUser }}>
          <div className="flex-horizontal">
            <NavBar />
            <Sidebar />

            <div className="content">
              <AnimatePresence exitBeforeEnter>
                <Switch location={location} key={location.pathname}>
                  <Route exact path="/">
                    <Home pageTransitions={pageTransitions} />
                  </Route>
                  <Route path="/login">
                    {user ? (
                      <Redirect exact to="/" />
                    ) : (
                      <Login pageTransitions={pageTransitions} />
                    )}
                  </Route>
                  <Route path="/register">
                    {user ? (
                      <Redirect exact to="/" />
                    ) : (
                      <Register pageTransitions={pageTransitions} />
                    )}
                  </Route>
                  <Route path="/register_verification">
                    {user ? (
                      <Redirect exact to="/" />
                    ) : (
                      <RegisterVerification pageTransitions={pageTransitions} />
                    )}
                  </Route>
                  <Route path="/send_code_again">
                    {user ? (
                      <Redirect exact to="/" />
                    ) : (
                      <AgainRegisterVerification
                        pageTransitions={pageTransitions}
                      />
                    )}
                  </Route>
                  <Route path="/reset_password">
                    {user ? (
                      <Redirect exact to="/" />
                    ) : (
                      <PasswordReset pageTransitions={pageTransitions} />
                    )}
                  </Route>
                  <Route path="*">
                    <NoMatch pageTransitions={pageTransitions} />
                  </Route>
                </Switch>
              </AnimatePresence>
            </div>
          </div>
        </UserContext.Provider>
      )}
    </div>
  );
}

export default App;
