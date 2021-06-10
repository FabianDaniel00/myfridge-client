import { useState } from "react";
import { Form, Button, Alert, Collapse, Toast } from "react-bootstrap";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../style/Form.scss";

export default function PasswordReset({ pageTransitions }) {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [sendLoading, setSendLoading] = useState("");
  const [sendError, setSendError] = useState("");
  const [sendMessage, setSendMessage] = useState("");
  const [confirmLoading, setConfirmLoading] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");

  const sendCode = (event) => {
    event.preventDefault();

    setSendLoading(true);
    axios
      .post("http://localhost:8080/users/reset_password_send", { email })
      .then((response) => {
        if (response.data.err) {
          setSendMessage("");
          setSendError(response.data.err);
        } else {
          setSendError("");
          setSendMessage(response.data.message);
        }
        setSendLoading(false);
      })
      .catch((err) => {
        setSendMessage("");
        setSendError(err.message);
        setSendLoading(false);
      });
  };

  const confirmNewPassword = (event) => {
    event.preventDefault();

    setConfirmLoading(true);

    if (newPassword === newPasswordConfirm) {
      axios
        .post("http://localhost:8080/users/reset_password_confirm", {
          verificationCode,
          email,
          newPassword,
        })
        .then((response) => {
          if (response.data.err) {
            setConfirmMessage("");
            setConfirmError(response.data.err);
          } else {
            setConfirmError("");
            setConfirmMessage(response.data.message);
          }
          setConfirmLoading(false);
        })
        .catch((err) => {
          setConfirmMessage("");
          setConfirmError(err.message);
          setConfirmLoading(false);
        });
    } else {
      setConfirmMessage("");
      setConfirmError("Passwords do not match!");
      setConfirmLoading(false);
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
      <h1 style={{ margin: "40px 0" }}>Send verification code</h1>
      <Form onSubmit={(event) => sendCode(event)}>
        <Form.Group controlId="formSendEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </Form.Group>

        <Button
          variant="outline-info"
          type="submit"
          block
          disabled={sendLoading}
        >
          {sendLoading ? <i className="fa fa-spinner fa-spin" /> : "Send"}
        </Button>

        <Collapse in={sendError || sendMessage}>
          <div>
            <Toast
              onClose={() => {
                setSendError("");
                setSendMessage("");
              }}
              show={sendError || sendMessage}
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
                  {sendError ? "sendError!" : sendMessage ? "Success" : null}
                </strong>
              </Toast.Header>
              <Toast.Body>
                {sendError ? (
                  <Alert variant="danger">{sendError}</Alert>
                ) : sendMessage ? (
                  <Alert variant="success">{sendMessage}</Alert>
                ) : null}
              </Toast.Body>
            </Toast>
          </div>
        </Collapse>
      </Form>

      <hr style={{ borderTop: "5px dashed #17a2b8" }} />

      <h1 style={{ margin: "40px 0" }}>Confirm new password</h1>
      <Form onSubmit={(event) => confirmNewPassword(event)}>
        <Form.Group controlId="formConfirmEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(event) => setEmail(event.target.value)}
            required
            value={email}
          />
        </Form.Group>

        <Form.Group controlId="formConfirmCode">
          <Form.Label>Verification code</Form.Label>
          <Form.Control
            type="text"
            placeholder="verification code"
            onChange={(event) => setVerificationCode(event.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formConfirmNewPassword">
          <Form.Label>New password</Form.Label>
          <Form.Control
            type="password"
            placeholder="New password"
            onChange={(event) => setNewPassword(event.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formConfirmNewConfirmPassword">
          <Form.Label>Confirm password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            onChange={(event) => setNewPasswordConfirm(event.target.value)}
            required
          />
        </Form.Group>

        <Button
          variant="outline-info"
          type="submit"
          block
          disabled={confirmLoading}
        >
          {confirmLoading ? <i className="fa fa-spinner fa-spin" /> : "Confirm"}
        </Button>

        <Collapse in={confirmError || confirmMessage}>
          <div>
            <Toast
              onClose={() => {
                setConfirmError("");
                setConfirmMessage("");
              }}
              show={confirmError || confirmMessage}
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
                  {confirmError ? "Error!" : confirmMessage ? "Success" : null}
                </strong>
              </Toast.Header>
              <Toast.Body>
                {confirmError ? (
                  <Alert variant="danger">{confirmError}</Alert>
                ) : confirmMessage ? (
                  <Alert variant="success">
                    {confirmMessage}
                    <br />
                    <Link className="link" to="/login">
                      <i className="fa fa-sign-in-alt" /> Click here login.
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
