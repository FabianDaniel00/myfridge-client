import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { motion } from "framer-motion";
import { useHistory, Link } from "react-router-dom";
import axios from "axios";
import "../../style/Form.scss";

export default function RegisterVerification({ pageTransitions }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  const redirect = useHistory();

  const registerVerification = (event) => {
    event.preventDefault();

    setLoading(true);
    axios
      .post("http://localhost:8080/users/register_verification", {
        email,
        code,
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
            onChange={(event) => setCode(event.target.value)}
            required
          />
        </Form.Group>

        <Button variant="outline-info" type="submit" block disabled={loading}>
          {loading ? <i className="fa fa-spinner fa-spin" /> : "Verify"}
        </Button>

        {error && (
          <motion.div
            initial="out"
            animate="in"
            exit="out"
            variants={pageTransitions.pageVariants}
            transition={pageTransitions.pageTransition}
          >
            <Alert style={{ marginTop: "20px" }} variant="danger">
              {error}
            </Alert>
          </motion.div>
        )}

        <Link className="link" to="/send_code_again">
          If you don't get a verification code click here!
        </Link>
      </Form>
    </motion.div>
  );
}
