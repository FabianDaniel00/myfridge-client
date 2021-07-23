import { useState, useEffect } from "react";
import { Form, Button, Alert, Toast, Collapse } from "react-bootstrap";
import { motion } from "framer-motion";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import "../../style/Form.scss";

export default function RegisterVerification({ pageTransitions }) {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const redirect = useHistory();

  const registerVerification = (event) => {
    event.preventDefault();

    setLoading(true);
    axios
      .post(`${process.env.REACT_APP_API_HOST}/users/register_verification`, {
        email,
        verificationCode,
      })
      .then((response) => {
        if (response.data.err) {
          setError(response.data.err);
          setLoading(false);
        } else {
          redirect.push("/login");
        }
      })
      .catch((err) => {
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
      <h1 style={{ margin: "40px 0" }}>Register Verification</h1>
      <Form onSubmit={(event) => registerVerification(event)}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formCode">
          <Form.Label>Verification Code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Verification Code"
            onChange={(event) => setVerificationCode(event.target.value)}
            required
          />
        </Form.Group>

        <Button variant="outline-info" type="submit" block disabled={loading}>
          {loading ? <i className="fa fa-spinner fa-spin" /> : "Verify"}
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

        <Link className="link" to="/send_code_again">
          If you don't get a verification code click here!
        </Link>
      </Form>
    </motion.div>
  );
}
