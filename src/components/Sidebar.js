import { useContext, useRef, useEffect } from "react";
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
import UserContext from "../user/UserContext.js";
import Logout from "./signedInComponents/Logout.js";

const Sidebar = () => {
  const { user } = useContext(UserContext);

  const sidebarRef = useRef(null);

  const setSidebarHeight = () => {
    var body = document.body,
      html = document.documentElement;

    var height =
      Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      ) - 100;

    if (height <= window.innerHeight) {
      sidebarRef.current.className = "sidebar small-height";
    } else {
      sidebarRef.current.className = "sidebar";
    }
  };

  useEffect(() => {
    window.addEventListener("click", () => setTimeout(setSidebarHeight, 300));
    setSidebarHeight();
    return () => {
      window.removeEventListener("click", () =>
        setTimeout(setSidebarHeight, 500)
      );
    };
  }, []);

  return (
    <div ref={sidebarRef} className="sidebar">
      <CDBSidebar textColor="#fff" backgroundColor="#17a2b8">
        <CDBSidebarHeader
          prefix={<i className="fa fa-bars fa-large bigger"></i>}
        >
          <Link
            to="/"
            style={{ transition: "0.3s" }}
            className="text-decoration-none"
          >
            myFridge
          </Link>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/" activeClassName="activeClicked">
              <CDBSidebarMenuItem className="opacity" icon="home">
                Home
              </CDBSidebarMenuItem>
            </NavLink>
            {user ? (
              <></>
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
          <div>Sidebar Footer</div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;
