import { useState, useRef, useEffect } from "react";
import "../../style/Form.scss";
import axios from "axios";
import { Form, Button, Alert, Toast, Collapse } from "react-bootstrap";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";

function Register({ pageTransitions }) {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const reRef = useRef();

  const register = async (event) => {
    event.preventDefault();

    setLoading(true);

    const reToken = await reRef.current.executeAsync();
    reRef.current.reset();

    if (password !== confirmPassword) {
      setMessage("");
      setError("Passwords do not match!");
      setLoading(false);
    } else {
      axios
        .post(`${process.env.REACT_APP_API_HOST}/users/register`, {
          fName,
          lName,
          email,
          phone,
          password,
          reToken,
        })
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
          setLoading(false);
        });
    }
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
      <h1 style={{ margin: "20px 0", textAlign: "center" }}>Register</h1>
      <Form onSubmit={(event) => register(event)}>
        <Form.Group controlId="formFNamePassword">
          <Form.Label>
            First Name <i style={{ color: "#f00" }}>*</i>
          </Form.Label>
          <Form.Control
            onChange={(event) => setFName(event.target.value)}
            type="text"
            placeholder="First Name"
            required
          />
        </Form.Group>

        <Form.Group controlId="formLNamePassword">
          <Form.Label>
            Last Name <i style={{ color: "#f00" }}>*</i>
          </Form.Label>
          <Form.Control
            onChange={(event) => setLName(event.target.value)}
            type="text"
            placeholder="Last Name"
            required
          />
        </Form.Group>

        <Form.Group controlId="formRegisterEmail">
          <Form.Label>
            Email address <i style={{ color: "#f00" }}>*</i>
          </Form.Label>
          <Form.Control
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            placeholder="Enter email"
            required
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formTelPassword">
          <Form.Label>
            Phone{" "}
            <sup>
              <i className="text-muted">(optional)</i>
            </sup>
          </Form.Label>
          <Form.Control
            onChange={(event) => setPhone(event.target.value)}
            type="text"
            placeholder="Phone number"
          />
        </Form.Group>

        <Form.Group controlId="formRegisterPassword">
          <Form.Label>
            Password <i style={{ color: "#f00" }}>*</i>
          </Form.Label>
          <Form.Control
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Password"
            required
          />
        </Form.Group>

        <Form.Group controlId="formRegisterConfirmPassword">
          <Form.Label>
            Confirm password <i style={{ color: "#f00" }}>*</i>
          </Form.Label>
          <Form.Control
            onChange={(event) => setConfirmPassword(event.target.value)}
            type="password"
            placeholder="confirm password"
            required
          />
        </Form.Group>
        {/* <Form.Group controlId="formBasicCheckbox">
      <Form.Check type="checkbox" label="Check me out" />
    </Form.Group> */}

        <ReCAPTCHA
          sitekey="6LeVazQbAAAAAHtNjBk99AqPBUhCwC1T5tmwVJe3"
          size="invisible"
          ref={reRef}
          badge="inline"
          style={{ margin: "30px 0" }}
        />

        <Button variant="outline-info" type="submit" block disabled={loading}>
          {loading ? <i className="fa fa-spinner fa-spin" /> : "Register"}
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
                  {error ? "error!" : message ? "Success" : null}
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

        <Link className="link" to="/login">
          <i className="fa fa-sign-in-alt" /> If you have an account login here!
        </Link>
      </Form>
    </motion.div>
  );
}

export default Register;
