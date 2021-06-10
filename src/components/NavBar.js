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
            onClick={() => {
              setNavExpanded(false);
              window.scrollTo(0, 0);
            }}
            className="top-nav-link"
            to="/recipes/all/1/all"
          >
            myFridge
          </NavLink>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        {user && (
          <NavLink
            onClick={window.scrollTo(0, 0)}
            to="/profile_page"
            className="monogram-navbar"
          >
            {user.u_monogram}
          </NavLink>
        )}
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            <NavLink
              onClick={() => {
                setNavExpanded(false);
                window.scrollTo(0, 0);
              }}
              className="nav-link"
              to="/recipes/all/1/all"
            >
              <i className="fa fa-home" /> Home
            </NavLink>
            <NavLink
              onClick={() => {
                setNavExpanded(false);
                window.scrollTo(0, 0);
              }}
              className="nav-link"
              to="/recipe_categories"
            >
              <i className="fas fa-shopping-basket" /> Recipe Categories
            </NavLink>
            {user ? (
              <>
                <NavLink
                  onClick={() => {
                    setNavExpanded(false);
                    window.scrollTo(0, 0);
                  }}
                  className="nav-link"
                  to="/add_recipe"
                >
                  <i className="fas fa-plus" /> Add Recipe
                </NavLink>

                <NavLink
                  onClick={() => {
                    setNavExpanded(false);
                    window.scrollTo(0, 0);
                  }}
                  className="nav-link"
                  to="/my_fridge"
                >
                  <i className="fas fa-utensils" /> My Fridge
                </NavLink>

                <NavLink
                  onClick={() => {
                    setNavExpanded(false);
                    window.scrollTo(0, 0);
                  }}
                  className="nav-link"
                  to="/favorite_recipes"
                >
                  <i className="fas fa-heart" /> Favorite Recipes
                </NavLink>

                <NavLink
                  onClick={() => {
                    setNavExpanded(false);
                    window.scrollTo(0, 0);
                  }}
                  className="nav-link"
                  to="/weekly_menu"
                >
                  <i className="fas fa-calendar-week" /> Weekly Menu
                </NavLink>

                {user.u_is_admin ? (
                  <NavLink
                    onClick={() => {
                      setNavExpanded(false);
                      window.scrollTo(0, 0);
                    }}
                    className="nav-link"
                    to="/admin"
                    style={{ color: "#424ef5" }}
                  >
                    <i className="fas fa-user-cog" /> Admin
                  </NavLink>
                ) : null}

                <div onClick={() => setNavExpanded(false)}>
                  <Logout navbar={true} />
                </div>
              </>
            ) : (
              <>
                <NavLink
                  onClick={() => {
                    setNavExpanded(false);
                    window.scrollTo(0, 0);
                  }}
                  className="nav-link"
                  to="/login"
                >
                  <i className="fa fa-sign-in-alt" /> Login
                </NavLink>
                <NavLink
                  onClick={() => {
                    setNavExpanded(false);
                    window.scrollTo(0, 0);
                  }}
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
