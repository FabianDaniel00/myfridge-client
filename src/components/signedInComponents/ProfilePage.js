import { useState, useContext } from "react";
import UserContext from "../../user/UserContext.js";
import { motion } from "framer-motion";
import "../../style/ProfilePage.scss";
import moment from "moment";
import { Modal, Button, Form, Collapse, Toast, Alert } from "react-bootstrap";
import axios from "axios";

export default function ProfilePage({ pageTransitions }) {
  const { user, setUser } = useContext(UserContext);

  const [showFName, setShowFName] = useState(false);
  const [fName, setFName] = useState("");
  const [fNameLoading, setFNameLoading] = useState(false);
  const [fNameError, setFNameError] = useState("");
  const [fNameMessage, setFNameMessage] = useState("");
  const [showLName, setShowLName] = useState(false);
  const [lName, setLName] = useState("");
  const [lNameLoading, setLNameLoading] = useState(false);
  const [lNameError, setLNameError] = useState("");
  const [lNameMessage, setLNameMessage] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [showTel, setShowTel] = useState(false);
  const [tel, setTel] = useState("");
  const [telLoading, setTelLoading] = useState(false);
  const [telError, setTelError] = useState("");
  const [telMessage, setTelMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const changeFName = () => {
    setFNameLoading(true);
    axios
      .post(
        "http://localhost:8080/users/edit_f_name",
        {
          fName,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.data.err) {
          setFNameError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setFNameMessage(response.data.message);
          setUser((user) => {
            const user_ = { ...user };
            user_.u_f_name = fName;
            user_.u_monogram = fName[0] + user_.u_monogram[1];
            return user_;
          });
          setFName("");
        }
        setFNameLoading(false);
      })
      .catch((error) => {
        setFNameError(error.message);
        setFNameLoading(false);
      });
  };

  const changeLName = () => {
    setLNameLoading(true);
    axios
      .post(
        "http://localhost:8080/users/edit_l_name",
        {
          lName,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.data.err) {
          setLNameError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setLNameMessage(response.data.message);
          setUser((user) => {
            const user_ = { ...user };
            user_.u_l_name = lName;
            user_.u_monogram = user_.u_monogram[0] + lName[0];
            return user_;
          });
          setLName("");
        }
        setLNameLoading(false);
      })
      .catch((error) => {
        setLNameError(error.message);
        setLNameLoading(false);
      });
  };

  const changeEmail = () => {
    setEmailLoading(true);
    axios
      .post(
        "http://localhost:8080/users/edit_email",
        {
          email,
          emailPassword,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.data.err) {
          setEmailError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setEmailMessage(response.data.message);
          setUser((user) => {
            const user_ = { ...user };
            user_.u_email = email;
            return user_;
          });
          setEmail("");
          setEmailPassword("");
        }
        setEmailLoading(false);
      })
      .catch((error) => {
        setEmailError(error.message);
        setEmailLoading(false);
      });
  };

  const changeTel = () => {
    setTelLoading(true);
    axios
      .post(
        "http://localhost:8080/users/edit_tel",
        {
          tel,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.data.err) {
          setTelError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setTelMessage(response.data.message);
          setUser((user) => {
            const user_ = { ...user };
            user_.u_tel = tel;
            return user_;
          });
          setTel("");
        }
        setTelLoading(false);
      })
      .catch((error) => {
        setTelError(error.message);
        setTelLoading(false);
      });
  };

  const changePassword = () => {
    setPasswordLoading(true);

    if (newPassword !== confirmNewPassword) {
      setPasswordError("Passwords do not match!");
    } else {
      axios
        .post(
          "http://localhost:8080/users/edit_password",
          {
            password,
            newPassword,
          },
          {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          if (response.data.err) {
            setPasswordError(response.data.err);
          } else {
            if (response.data.newToken) {
              localStorage.setItem("token", response.data.newToken);
            }
            setPasswordMessage(response.data.message);
            setUser((user) => {
              const user_ = { ...user };
              user_.u_password = response.data.newPasswordHash;
              return user_;
            });
            setPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
          }
          setPasswordLoading(false);
        })
        .catch((error) => {
          setPasswordError(error.message);
          setPasswordLoading(false);
        });
    }
  };

  return (
    <motion.div
      initial="out"
      animate="in"
      exit="out"
      variants={pageTransitions.pageVariants}
      transition={pageTransitions.pageTransition}
    >
      <Modal show={showFName} onHide={() => setShowFName(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit First Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formFName">
            <Form.Label>First Name:</Form.Label>
            <Form.Control
              onChange={(event) => setFName(event.target.value)}
              type="text"
              value={fName}
              placeholder="First Name"
            />
          </Form.Group>

          <Collapse in={fNameError || fNameMessage}>
            <div>
              <Toast
                onClose={() => {
                  setFNameError("");
                  setFNameMessage("");
                }}
                show={fNameError || fNameMessage}
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
                    {fNameError ? "error!" : fNameMessage ? "Success" : null}
                  </strong>
                </Toast.Header>
                <Toast.Body>
                  {fNameError ? (
                    <Alert variant="danger">{fNameError}</Alert>
                  ) : fNameMessage ? (
                    <Alert variant="success">
                      {fNameMessage}
                      <br />
                    </Alert>
                  ) : null}
                </Toast.Body>
              </Toast>
            </div>
          </Collapse>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFName(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={changeFName}
            disabled={fNameLoading}
          >
            {fNameLoading ? (
              <i className="fa fa-spinner fa-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showLName} onHide={() => setShowLName(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Last Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formLName">
            <Form.Label>Last Name:</Form.Label>
            <Form.Control
              onChange={(event) => setLName(event.target.value)}
              type="text"
              value={lName}
              placeholder="Last Name"
            />
          </Form.Group>

          <Collapse in={lNameError || lNameMessage}>
            <div>
              <Toast
                onClose={() => {
                  setLNameError("");
                  setLNameMessage("");
                }}
                show={lNameError || lNameMessage}
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
                    {lNameError ? "error!" : lNameMessage ? "Success" : null}
                  </strong>
                </Toast.Header>
                <Toast.Body>
                  {lNameError ? (
                    <Alert variant="danger">{lNameError}</Alert>
                  ) : lNameMessage ? (
                    <Alert variant="success">
                      {lNameMessage}
                      <br />
                    </Alert>
                  ) : null}
                </Toast.Body>
              </Toast>
            </div>
          </Collapse>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLName(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={changeLName}
            disabled={lNameLoading}
          >
            {lNameLoading ? (
              <i className="fa fa-spinner fa-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEmail} onHide={() => setShowEmail(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formEmail">
            <Form.Label>New Email:</Form.Label>
            <Form.Control
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              value={email}
              placeholder="example@gmail.com"
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Your password:</Form.Label>
            <Form.Control
              onChange={(event) => setEmailPassword(event.target.value)}
              type="password"
              value={emailPassword}
              placeholder="Your password"
            />
          </Form.Group>

          <Collapse in={emailError || emailMessage}>
            <div>
              <Toast
                onClose={() => {
                  setEmailError("");
                  setEmailMessage("");
                }}
                show={emailError || emailMessage}
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
                    {emailError ? "error!" : emailMessage ? "Success" : null}
                  </strong>
                </Toast.Header>
                <Toast.Body>
                  {emailError ? (
                    <Alert variant="danger">{emailError}</Alert>
                  ) : emailMessage ? (
                    <Alert variant="success">
                      {emailMessage}
                      <br />
                    </Alert>
                  ) : null}
                </Toast.Body>
              </Toast>
            </div>
          </Collapse>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEmail(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={changeEmail}
            disabled={emailLoading}
          >
            {emailLoading ? (
              <i className="fa fa-spinner fa-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showTel} onHide={() => setShowTel(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Phone number</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formTel">
            <Form.Label>Phone number:</Form.Label>
            <Form.Control
              onChange={(event) => setTel(event.target.value)}
              type="text"
              value={tel}
              placeholder="01234..."
            />
          </Form.Group>

          <Collapse in={telError || telMessage}>
            <div>
              <Toast
                onClose={() => {
                  setTelError("");
                  setTelMessage("");
                }}
                show={telError || telMessage}
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
                    {telError ? "error!" : telMessage ? "Success" : null}
                  </strong>
                </Toast.Header>
                <Toast.Body>
                  {telError ? (
                    <Alert variant="danger">{telError}</Alert>
                  ) : telMessage ? (
                    <Alert variant="success">
                      {telMessage}
                      <br />
                    </Alert>
                  ) : null}
                </Toast.Body>
              </Toast>
            </div>
          </Collapse>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTel(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={changeTel} disabled={telLoading}>
            {telLoading ? (
              <i className="fa fa-spinner fa-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPassword} onHide={() => setShowPassword(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formPassword">
            <Form.Label>Old Password:</Form.Label>
            <Form.Control
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
              placeholder="Old Password"
            />
          </Form.Group>

          <br />

          <Form.Group controlId="formNewPassword">
            <Form.Label>New Password:</Form.Label>
            <Form.Control
              onChange={(event) => setNewPassword(event.target.value)}
              type="password"
              value={newPassword}
              placeholder="New Password"
            />
          </Form.Group>

          <Form.Group controlId="formPasswordConfirm">
            <Form.Label>Confirm New Password:</Form.Label>
            <Form.Control
              onChange={(event) => setConfirmNewPassword(event.target.value)}
              type="password"
              value={confirmNewPassword}
              placeholder="Confirm New Password"
            />
          </Form.Group>

          <Collapse in={passwordError || passwordMessage}>
            <div>
              <Toast
                onClose={() => {
                  setPasswordError("");
                  setPasswordMessage("");
                }}
                show={passwordError || passwordMessage}
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
                    {passwordError
                      ? "error!"
                      : passwordMessage
                      ? "Success"
                      : null}
                  </strong>
                </Toast.Header>
                <Toast.Body>
                  {passwordError ? (
                    <Alert variant="danger">{passwordError}</Alert>
                  ) : passwordMessage ? (
                    <Alert variant="success">
                      {passwordMessage}
                      <br />
                    </Alert>
                  ) : null}
                </Toast.Body>
              </Toast>
            </div>
          </Collapse>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPassword(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={changePassword}
            disabled={passwordLoading}
          >
            {passwordLoading ? (
              <i className="fa fa-spinner fa-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <h1 style={{ marginBottom: "40px" }}>Profile Page</h1>
      <div className="user-page">
        <div className="monogram">{user.u_monogram}</div>

        <div className="user-i">
          <div>
            <div className="created-at">
              Created at:{" "}
              {moment(user.u_created_at).format("YYYY-MM-DD HH:mm:ss")}
            </div>

            <div style={{ position: "relative", marginBottom: "10px" }}>
              First Name:{" "}
              <span style={{ color: "#17a2b8" }}>{user.u_f_name}</span>
              <i onClick={() => setShowFName(true)} className="edit">
                Edit
              </i>
            </div>

            <div style={{ position: "relative", margin: "10px 0" }}>
              Last Name:{" "}
              <span style={{ color: "#17a2b8" }}>{user.u_l_name}</span>
              <i onClick={() => setShowLName(true)} className="edit">
                Edit
              </i>
            </div>

            <div style={{ position: "relative", margin: "10px 0" }}>
              Email: <span style={{ color: "#17a2b8" }}>{user.u_email}</span>
              <i onClick={() => setShowEmail(true)} className="edit">
                Edit
              </i>
            </div>

            <div style={{ position: "relative", margin: "10px 0" }}>
              Phone number:{" "}
              <span style={{ color: "#17a2b8" }}>{user.u_tel}</span>
              <i onClick={() => setShowTel(true)} className="edit">
                Edit
              </i>
            </div>

            <div style={{ position: "relative", margin: "10px 0" }}>
              Password{" "}
              <i
                onClick={() => setShowPassword(true)}
                className="edit password"
              >
                Edit
              </i>
            </div>

            {user.u_is_admin ? (
              <div style={{ position: "relative", margin: "20px 0 10px 0" }}>
                <span className="admin">
                  If you didn't know, you are admin! 🙂
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
