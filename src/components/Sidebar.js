import { useContext, useEffect, useState } from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink, Link, useLocation } from "react-router-dom";
import "../style/Sidebar.scss";
import { Badge } from "react-bootstrap";
import UserContext from "../user/UserContext.js";
import Logout from "./signedInComponents/Logout.js";

const Sidebar = () => {
  const [location, setLocation] = useState("");

  const { user } = useContext(UserContext);

  const { pathname } = useLocation();

  useEffect(() => {
    setLocation(pathname.substring(1, 8));
  }, [pathname]);

  useEffect(() => {
    hideUser();

    setLocation(pathname.substring(1, 8));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    document.getElementById("year-sidebar").innerHTML =
      new Date().getFullYear();
  }, []);

  const hideUser = (click = false) => {
    if (user) {
      const isToggled = document.getElementsByClassName("toggled").length
        ? true
        : false;
      const userContainer = document.getElementById("user-info");
      const monogram = document.getElementById("monogram");
      const hr = document.getElementById("hr");

      if (click ? !isToggled : isToggled) {
        userContainer.style.height = "0";
        userContainer.style.overflow = "hidden";
        userContainer.style.padding = "0";
        monogram.style.fontSize = "16px";
        monogram.style.padding = "7px 8px";
        hr.style.margin = "0";
      } else {
        userContainer.style.height = "fit-content";
        userContainer.style.overflow = "visible";
        userContainer.style.padding = "0.25em 0.4em";
        monogram.style.fontSize = "13px";
        monogram.style.padding = "5px 6px";
        hr.style.marginTop = "10px";
      }
    }
  };

  if (user) {
    window.addEventListener("load", () => hideUser());
    window.addEventListener("resize", () => hideUser());
  }

  return (
    <div className="sidebar">
      <CDBSidebar textColor="#fff" backgroundColor="#17a2b8" id="sidebar">
        {user && (
          <Link
            onClick={window.scrollTo(0, 0)}
            to="/profile_page"
            className="profile-sidebar"
          >
            <div id="monogram" className="monogram-sidebar">
              <b>{user.u_monogram}</b>
            </div>
            <Badge className="user-info" id="user-info" variant="info">
              {user.u_f_name} {user.u_l_name}
            </Badge>
            <hr id="hr" style={{ margin: "0", transition: "0.5s" }} />
          </Link>
        )}
        <CDBSidebarHeader
          prefix={
            <i
              onClick={() => {
                hideUser(true);
              }}
              className="fa fa-bars fa-large bigger"
            ></i>
          }
        >
          <Link
            to="/recipes/all/1/all"
            style={{ transition: "0.3s" }}
            className="text-decoration-none"
            onClick={window.scrollTo(0, 0)}
          >
            myFridge
          </Link>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink
              onClick={window.scrollTo(0, 0)}
              exact
              to="/recipes/all/1/all"
            >
              <CDBSidebarMenuItem
                className={`opacity ${
                  location === "recipes" ? "active-sidebar" : ""
                }`}
                icon="home"
              >
                Home
              </CDBSidebarMenuItem>
            </NavLink>

            <NavLink
              exact
              to="/recipe_categories"
              activeClassName="activeClicked"
              onClick={window.scrollTo(0, 0)}
            >
              <CDBSidebarMenuItem
                className="opacity"
                icon="fas fa-shopping-basket"
              >
                Recipe Categories
              </CDBSidebarMenuItem>
            </NavLink>

            <hr style={{ border: "1px solid #fff", width: "80%" }} />

            {user ? (
              <>
                <NavLink
                  onClick={window.scrollTo(0, 0)}
                  exact
                  to="/add_recipe"
                  activeClassName="activeClicked"
                >
                  <CDBSidebarMenuItem className="opacity" icon="fas fa-plus">
                    Add Recipe
                  </CDBSidebarMenuItem>
                </NavLink>

                <NavLink
                  onClick={window.scrollTo(0, 0)}
                  exact
                  to="/my_fridge/1"
                  activeClassName="activeClicked"
                >
                  <CDBSidebarMenuItem
                    className="opacity"
                    icon="fas fa-utensils"
                  >
                    My Fridge
                  </CDBSidebarMenuItem>
                </NavLink>

                <NavLink
                  exact
                  to="/favorite_recipes"
                  activeClassName="activeClicked"
                  onClick={window.scrollTo(0, 0)}
                >
                  <CDBSidebarMenuItem className="opacity" icon="fas fa-heart">
                    Favorite Recipes
                  </CDBSidebarMenuItem>
                </NavLink>

                <NavLink
                  exact
                  to="/weekly_menu"
                  activeClassName="activeClicked"
                  onClick={window.scrollTo(0, 0)}
                >
                  <CDBSidebarMenuItem
                    className="opacity"
                    icon="fas fa-calendar-week"
                  >
                    Weekly Menu
                  </CDBSidebarMenuItem>
                </NavLink>

                <NavLink
                  exact
                  to="/groceries_chart"
                  activeClassName="activeClicked"
                  onClick={window.scrollTo(0, 0)}
                >
                  <CDBSidebarMenuItem
                    className="opacity"
                    icon="fas fa-chart-bar"
                  >
                    Groceries Chart
                  </CDBSidebarMenuItem>
                </NavLink>

                {user.u_is_admin ? (
                  <NavLink
                    exact
                    to="/admin"
                    activeClassName="activeClicked"
                    onClick={window.scrollTo(0, 0)}
                  >
                    <CDBSidebarMenuItem
                      className="opacity"
                      icon="fas fa-user-cog"
                      style={{ color: "#424ef5" }}
                    >
                      Admin Page
                    </CDBSidebarMenuItem>
                  </NavLink>
                ) : null}
              </>
            ) : (
              <>
                <NavLink
                  onClick={window.scrollTo(0, 0)}
                  exact
                  to="/login"
                  activeClassName="activeClicked"
                >
                  <CDBSidebarMenuItem className="opacity" icon="sign-in-alt">
                    Login
                  </CDBSidebarMenuItem>
                </NavLink>

                <NavLink
                  onClick={window.scrollTo(0, 0)}
                  exact
                  to="/register"
                  activeClassName="activeClicked"
                >
                  <CDBSidebarMenuItem className="opacity" icon="id-card">
                    Register
                  </CDBSidebarMenuItem>
                </NavLink>
              </>
            )}
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter className="sidebar-footer">
          {user && <Logout />}
          <div style={{ fontSize: "13px" }}>
            Copyright Ⓒ <span id="year-sidebar"></span> myFridge. All rights
            reserved
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
