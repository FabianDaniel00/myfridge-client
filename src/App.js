import { useState, useEffect } from "react";
import axios from "axios";
import "./style/App.scss";
import { Route, Switch, Redirect, useLocation, Link } from "react-router-dom";
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
import RecipePage from "./components/RecipePage.js";
import AddRecipe from "./components/signedInComponents/AddRecipe.js";
import RecipeCategories from "./components/RecipeCategories.js";
import MyFridge from "./components/signedInComponents/MyFridge.js";
import ProfilePage from "./components/signedInComponents/ProfilePage.js";
import FavoriteRecipes from "./components/signedInComponents/FavoriteRecipes.js";
import Menu from "./components/signedInComponents/Menu.js";
import Admin from "./components/admin/Admin.js";
import DataChart from "./components/signedInComponents/DataChart.js";

function App() {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  axios.defaults.withCredentials = true;

  useEffect(() => {
    userIsLoggedIn();
    document.getElementById("year").innerHTML = new Date().getFullYear();
  }, []);

  const userIsLoggedIn = () => {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/users/auth`)
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
                    <Redirect exact to="/recipes/all/1/all" />
                  </Route>

                  <Route exact path="/recipes">
                    <Redirect exact to="/recipes/all/1/all" />
                  </Route>

                  <Route exact path="/recipes/:category/:page/:search">
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

                  <Route path="/recipe_categories">
                    <RecipeCategories pageTransitions={pageTransitions} />
                  </Route>

                  <Route path="/recipe/:r_id">
                    <RecipePage pageTransitions={pageTransitions} />
                  </Route>

                  <Route path="/add_recipe">
                    {user ? (
                      <AddRecipe pageTransitions={pageTransitions} />
                    ) : (
                      <Redirect to="/login" />
                    )}
                  </Route>

                  <Route path="/my_fridge/:page">
                    {user ? (
                      <MyFridge pageTransitions={pageTransitions} />
                    ) : (
                      <Redirect to="/login" />
                    )}
                  </Route>

                  <Route path="/profile_page">
                    {user ? (
                      <ProfilePage pageTransitions={pageTransitions} />
                    ) : (
                      <Redirect to="/login" />
                    )}
                  </Route>

                  <Route path="/favorite_recipes">
                    {user ? (
                      <FavoriteRecipes pageTransitions={pageTransitions} />
                    ) : (
                      <Redirect to="/login" />
                    )}
                  </Route>

                  <Route path="/weekly_menu">
                    {user ? (
                      <Menu pageTransitions={pageTransitions} />
                    ) : (
                      <Redirect to="/login" />
                    )}
                  </Route>

                  <Route path="/groceries_chart">
                    {user ? (
                      <DataChart pageTransitions={pageTransitions} />
                    ) : (
                      <Redirect to="/login" />
                    )}
                  </Route>

                  <Route path="/admin">
                    {user && user.u_is_admin ? (
                      <Admin pageTransitions={pageTransitions} />
                    ) : (
                      <Redirect to="/login" />
                    )}
                  </Route>

                  <Route exact path="/recipes/*">
                    <Redirect exact to="/recipes/all/1/all" />
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

      <div className="footer-basic">
        <footer>
          <div className="social">
            <a href="https://www.instagram.com/fabian_daniel00/" target="blank">
              <i className="fab fa-instagram instagram" />
            </a>
            <abbr title="fabian_daniel09" className="snapchat-div">
              <i className="fab fa-snapchat-ghost snapchat" />
            </abbr>
            <a
              href="https://www.facebook.com/daniel.fabian.334/"
              target="blank"
            >
              <i className="fab fa-facebook facebook" />
            </a>
          </div>
          <ul className="list-inline">
            <li className="list-inline-item">
              <Link to="/recipes/1">Home</Link>
            </li>
            <li className="list-inline-item">
              <Link to="/services">Services</Link>
            </li>
            <li className="list-inline-item">
              <Link to="/about">About</Link>
            </li>
          </ul>
          <p className="copyright">
            Copyright Ⓒ <span id="year"></span> myFridge. All rights reserved
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
