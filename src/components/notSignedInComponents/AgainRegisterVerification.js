import { useState } from "react";
import { Form, Button, Toast, Alert, Collapse } from "react-bootstrap";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../style/Form.scss";

export default function AgainRegisterVerification({ pageTransitions }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const againRegisterVerification = (event) => {
    event.preventDefault();

    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_API_HOST}/users/send_code_again`, { email, password })
      .then((response) => {
        if (response.data.err) {
          setMessage("");
          setError(response.data.err);
        } else {
          setError("");
          setMessage(response.data.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        setMessage("");
        setError(err.message);
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
      <h1 style={{ margin: "40px 0" }}>Send Verification Code</h1>
      <Form onSubmit={(event) => againRegisterVerification(event)}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </Form.Group>

        <Button variant="outline-info" type="submit" block disabled={loading}>
          {loading ? <i className="fa fa-spinner fa-spin" /> : "Send"}
        </Button>

        <Collapse in={error || message}>
          <div>
            <Toast
              onClose={() => {
                setError("");
                setMessage("");
              }}
              show={error || message}
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
                <strong className="mr-auto">
                  {error ? "Error!" : message ? "Success" : null}
                </strong>
              </Toast.Header>
              <Toast.Body>
                {error ? (
                  <Alert variant="danger">{error}</Alert>
                ) : message ? (
                  <Alert variant="success">
                    {message}
                    <br />
                    <Link to="/register_verification">
                      Click here to verificate.
                    </Link>
                  </Alert>
                ) : null}
              </Toast.Body>
            </Toast>
          </div>
        </Collapse>
      </Form>
    </motion.div>
  );
}
