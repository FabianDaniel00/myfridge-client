import { Form, Button, Alert, Collapse, Toast } from "react-bootstrap";
import "../../style/Form.scss";
import { motion } from "framer-motion";
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import UserContext from "../../user/UserContext.js";

function Login({ pageTransitions }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser } = useContext(UserContext);

  const redirect = useHistory();

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  });

  const login = (event) => {
    event.preventDefault();
    setLoading(true);
    axios
      .post("http://localhost:8080/users/login", { email, password })
      .then((response) => {
        if (response.data.err) {
          setError(response.data.err);
          setLoading(false);
        } else {
          localStorage.setItem("token", response.data.token);
          if (redirect.location.state) {
            redirect.push(redirect.location.state.prevPath);
          } else {
            redirect.push("/");
          }
          setUser(response.data.user);
        }
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <motion.div
      style={{ flexDirection: "column", maxWidth: "400px" }}
      initial="out"
      animate="in"
      exit="out"
      variants={pageTransitions.pageVariants}
      transition={pageTransitions.pageTransition}
    >
      <h1 style={{ margin: "40px 0" }}>Login</h1>
      <Form onSubmit={(event) => login(event)}>
        <Form.Group controlId="formLoginEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formLoginPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </Form.Group>
        {/* <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group> */}
        <Button variant="outline-info" type="submit" block disabled={loading}>
          {loading ? <i className="fa fa-spinner fa-spin" /> : "Login"}
        </Button>

        <Collapse in={error}>
          <div>
            <Toast
              onClose={() => {
                setError("");
              }}
              show={error}
              delay={5000}
              className="toast"
              autohide
            >
              <Toast.Header>
                {/* <img
                      src="holder.js/20x20?text=%20"
                      className="rounded mr-2"
                      alt=""
                    /> */}
                <strong className="mr-auto">Error!</strong>
              </Toast.Header>
              <Toast.Body>
                <Alert variant="danger">{error}</Alert>
              </Toast.Body>
            </Toast>
          </div>
        </Collapse>

        <Link className="link" to="/register">
          <i className="fa fa-address-card" /> If you don't have an account,
          click here to create one
        </Link>
        <Link className="link" to="/reset_password">
          <i className="fa fa-unlock-alt" /> If you forgot your password click
          here!
        </Link>
      </Form>
    </motion.div>
  );
}

export default Login;
