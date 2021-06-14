import axios from "axios";
import { CDBSidebarMenuItem } from "cdbreact";
import { useHistory, NavLink } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { Modal, Button, Alert, NavDropdown } from "react-bootstrap";
import UserContext from "../../user/UserContext.js";

export default function Logout({ navbar }) {
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  const { setUser } = useContext(UserContext);

  const redirect = useHistory();

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  });

  const logout = () => {
    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_API_HOST}/users/logout`)
      .then((response) => {
        if (response.data.err) {
          setError(response.data.err);
        }
        setUser("");
        localStorage.removeItem("token");
        redirect.push("/login");
      })
      .catch((err) => {
        console.log(err.message);
        setError(err.message);
        setLoading(false);
        setShowErrorModal(true);
      });
  };

  return (
    <>
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">{error}</Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {navbar ? (
        <>
          <NavDropdown.Divider />
          <NavLink
            className="nav-link"
            to=""
            onClick={() => {
              window.scrollTo(0, 0);
              logout();
            }}
          >
            {loading ? (
              <i className="fa fa-spinner fa-spin" />
            ) : (
              <>
                <i className="fa fa-address-card" /> Logout
              </>
            )}
          </NavLink>
        </>
      ) : (
        <CDBSidebarMenuItem
          icon="sign-out-alt"
          style={{ textAlign: "left" }}
          className="opacity"
          onClick={logout}
          disabled={loading}
        >
          {loading ? <i className="fa fa-spinner fa-spin" /> : "Logout"}
        </CDBSidebarMenuItem>
      )}
    </>
  );
}
