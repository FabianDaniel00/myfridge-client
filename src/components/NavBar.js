import { Nav, Navbar } from "react-bootstrap";
import "../style/NavBar.scss";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../user/UserContext.js";
import Logout from "./signedInComponents/Logout.js";

const NavBar = () => {
  const [navExpanded, setNavExpanded] = useState(false);

  const navbarRef = useRef(null);

  const { user } = useContext(UserContext);

  useEffect(() => {
    hideNavbar();
  }, []);

  const hideNavbar = () => {
    var lastScrollTop = 0;
    let upScroll = true;
    window.addEventListener(
      "scroll",
      () => {
        var st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > lastScrollTop) {
          if (upScroll) {
            navbarRef.current.className = "navbar navbar-container hide-navbar";
            upScroll = false;
          }
        } else {
          navbarRef.current.className = "navbar navbar-container";
          upScroll = true;
        }
        lastScrollTop = st <= 0 ? 0 : st;
      },
      false
    );
  };
  return (
    <div ref={navbarRef} className="navbar">
      <Navbar
        onToggle={setNavExpanded}
        expanded={navExpanded}
        bg="info"
        expand="true"
      >
        <Navbar.Brand>
          <NavLink
            onClick={() => setNavExpanded(false)}
            className="top-nav-link"
            to="/recipes/1"
          >
            myFridge
          </NavLink>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        {user && <div className="monogram-navbar">{user.u_monogram}</div>}
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <NavLink
              onClick={() => setNavExpanded(false)}
              className="nav-link"
              to="/recipes/1"
            >
              <i className="fa fa-home" /> Home
            </NavLink>
            {user ? (
              <>
                <NavLink
                  onClick={() => setNavExpanded(false)}
                  className="nav-link"
                  to="/add_recipe"
                >
                  <i className="fas fa-plus" /> Add Recipe
                </NavLink>
                <div onClick={() => setNavExpanded(false)}>
                  <Logout navbar={true} />
                </div>
              </>
            ) : (
              <>
                <NavLink
                  onClick={() => setNavExpanded(false)}
                  className="nav-link"
                  to="/login"
                >
                  <i className="fa fa-sign-in-alt" /> Login
                </NavLink>
                <NavLink
                  onClick={() => setNavExpanded(false)}
                  className="nav-link"
                  to="/register"
                >
                  <i className="fa fa-address-card" /> Register
                </NavLink>
              </>
            )}
            {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;