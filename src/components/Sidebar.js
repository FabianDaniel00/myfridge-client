import { useContext, useEffect } from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink, Link } from "react-router-dom";
import "../style/Sidebar.scss";
import { Badge } from "react-bootstrap";
import UserContext from "../user/UserContext.js";
import Logout from "./signedInComponents/Logout.js";

const Sidebar = () => {
  const { user } = useContext(UserContext);

  useEffect(() => {
    hideUser();
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
          <div style={{ textAlign: "center" }}>
            <div id="monogram" className="monogram-sidebar">
              <b>{user.u_monogram}</b>
            </div>
            <Badge className="user-info" id="user-info" variant="info">
              {user.u_f_name} {user.u_l_name}
            </Badge>
            <hr id="hr" style={{ margin: "0", transition: "0.5s" }} />
          </div>
        )}
        <CDBSidebarHeader
          prefix={
            <i
              onClick={() => hideUser(true)}
              className="fa fa-bars fa-large bigger"
            ></i>
          }
        >
          <Link
            to="/recipes/1"
            style={{ transition: "0.3s" }}
            className="text-decoration-none"
          >
            myFridge
          </Link>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/recipes/1" activeClassName="activeClicked">
              <CDBSidebarMenuItem className="opacity" icon="home">
                Home
              </CDBSidebarMenuItem>
            </NavLink>
            {user ? (
              <>
                <NavLink exact to="/add_recipe" activeClassName="activeClicked">
                  <CDBSidebarMenuItem className="opacity" icon="fas fa-plus">
                    Add Recipe
                  </CDBSidebarMenuItem>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink exact to="/login" activeClassName="activeClicked">
                  <CDBSidebarMenuItem className="opacity" icon="sign-in-alt">
                    Login
                  </CDBSidebarMenuItem>
                </NavLink>
                <NavLink exact to="/register" activeClassName="activeClicked">
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
