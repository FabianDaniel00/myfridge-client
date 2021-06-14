import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Table, Button, Modal, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../style/Admin.scss";

export default function Admin({ pageTransitions }) {
  const [recipesToAccept, setRecipesToAccept] = useState([]);
  const [recipesToAcceptLoading, setRecipesToAcceptLoading] = useState(true);
  const [recipesToAcceptError, setRecipesToAcceptError] = useState("");
  const [commentsToAccept, setCommentsToAccept] = useState([]);
  const [commentsToAcceptLoading, setCommentsToAcceptLoading] = useState(true);
  const [commentsToAcceptError, setCommentsToAcceptError] = useState("");
  const [showCommentDeclineModal, setShowCommentDeclineModal] = useState(false);
  const [commentDeclineLoading, setCommentDeclineLoading] = useState(false);
  const [commentDeclineError, setCommentDeclineError] = useState("");
  const [commentDeclineMessage, setCommentDeclineMessage] = useState("");
  const [showCommentAcceptModal, setShowCommentAcceptModal] = useState(false);
  const [commentAcceptLoading, setCommentAcceptLoading] = useState(false);
  const [commentAcceptError, setCommentAcceptError] = useState("");
  const [commentAcceptMessage, setCommentAcceptMessage] = useState("");
  const [commentSelectedIndex, setCommentSelectedIndex] = useState(-1);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);
  const [blockError, setBlockError] = useState("");
  const [blockMessage, setBlockMessage] = useState("");
  const [showUnBlockModal, setShowUnBlockModal] = useState(false);
  const [unBlockLoading, setUnBlockLoading] = useState(false);
  const [unBlockError, setUnBlockError] = useState("");
  const [unBlockMessage, setUnBlockMessage] = useState("");
  const [userSelectedIndex, setUserSelectedIndex] = useState(-1);
  const [showUserDeleteModal, setShowUserDeleteModal] = useState(false);
  const [userDeleteLoading, setUserDeleteLoading] = useState(false);
  const [userDeleteError, setUserDeleteError] = useState("");
  const [userDeleteMessage, setUserDeleteMessage] = useState("");

  useEffect(() => {
    getRecipesToAccept();
    getCommentsToAccept();
    getUsers();
  }, []);

  const getRecipesToAccept = () => {
    setRecipesToAcceptLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_HOST}/admin/get_recipes_to_accept`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.data.err) {
          setRecipesToAcceptError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setRecipesToAccept(response.data.recipes);
        }
        setRecipesToAcceptLoading(false);
      })
      .catch((error) => {
        setRecipesToAcceptError(error.message);
        setRecipesToAcceptLoading(false);
      });
  };

  const getCommentsToAccept = () => {
    setCommentsToAcceptLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_HOST}/admin/get_comments_to_accept`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.data.err) {
          setCommentsToAcceptError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setCommentsToAccept(response.data.recipes);
        }
        setCommentsToAcceptLoading(false);
      })
      .catch((error) => {
        setCommentsToAcceptError(error.message);
        setCommentsToAcceptLoading(false);
      });
  };

  const getUsers = () => {
    setCommentsToAcceptLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_HOST}/admin/get_users`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.data.err) {
          setUsersError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setUsers(response.data.users);
        }
        setUsersLoading(false);
      })
      .catch((error) => {
        setUsersError(error.message);
        setUsersLoading(false);
      });
  };

  const declineComment = () => {
    setCommentDeclineLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API_HOST}/admin/decline_comment`,
        {
          r_comment_id: commentsToAccept[commentSelectedIndex].r_comment_id,
          fName: commentsToAccept[commentSelectedIndex].u_f_name,
          lName: commentsToAccept[commentSelectedIndex].u_l_name,
          r_name: commentsToAccept[commentSelectedIndex].r_name,
          r_comment: commentsToAccept[commentSelectedIndex].r_comment,
          email: commentsToAccept[commentSelectedIndex].u_email,
          r_id: commentsToAccept[commentSelectedIndex].r_id,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.data.err) {
          setCommentDeclineMessage("");
          setCommentDeclineError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setCommentDeclineError("");
          setCommentDeclineMessage(response.data.message);
          setCommentsToAccept(
            commentsToAccept.filter(
              (comment) =>
                comment.r_comment_id !==
                commentsToAccept[commentSelectedIndex].r_comment_id
            )
          );
          setCommentSelectedIndex(-1);
        }
        setCommentDeclineLoading(false);
      })
      .catch((error) => {
        setCommentDeclineMessage("");
        setCommentDeclineError(error.message);
        setCommentDeclineLoading(false);
      });
  };

  const acceptComment = () => {
    setCommentAcceptLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API_HOST}/admin/accept_comment`,
        {
          r_comment_id: commentsToAccept[commentSelectedIndex].r_comment_id,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.data.err) {
          setCommentAcceptMessage("");
          setCommentAcceptError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setCommentAcceptError("");
          setCommentAcceptMessage(response.data.message);
          setCommentsToAccept(
            commentsToAccept.filter(
              (comment) =>
                comment.r_comment_id !==
                commentsToAccept[commentSelectedIndex].r_comment_id
            )
          );
          setCommentSelectedIndex(-1);
        }
        setCommentAcceptLoading(false);
      })
      .catch((error) => {
        setCommentAcceptMessage("");
        setCommentAcceptError(error.message);
        setCommentAcceptLoading(false);
      });
  };

  const blockUser = () => {
    setBlockLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API_HOST}/admin/block_user`,
        {
          u_id: users[userSelectedIndex].u_id,
          u_email: users[userSelectedIndex].u_email,
          u_f_name: users[userSelectedIndex].u_f_name,
          u_l_name: users[userSelectedIndex].u_l_name,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.data.err) {
          setBlockMessage("");
          setBlockError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setBlockError("");
          setBlockMessage(response.data.message);
          setUsers(() => {
            const users_ = [...users];
            users_[userSelectedIndex].u_is_blocked = 1;
            return users_;
          });
          setUserSelectedIndex(-1);
        }
        setBlockLoading(false);
      })
      .catch((error) => {
        setBlockMessage("");
        setBlockError(error.message);
        setBlockLoading(false);
      });
  };

  const unBlockUser = () => {
    setUnBlockLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API_HOST}/admin/unblock_user`,
        {
          u_id: users[userSelectedIndex].u_id,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.data.err) {
          setUnBlockMessage("");
          setUnBlockError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setUnBlockError("");
          setUnBlockMessage(response.data.message);
          setUsers(() => {
            const users_ = [...users];
            users_[userSelectedIndex].u_is_blocked = 0;
            return users_;
          });
          setUserSelectedIndex(-1);
        }
        setUnBlockLoading(false);
      })
      .catch((error) => {
        setUnBlockMessage("");
        setUnBlockError(error.message);
        setUnBlockLoading(false);
      });
  };

  const deleteUser = () => {
    setUserDeleteLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API_HOST}/admin/delete_user`,
        {
          u_id: users[userSelectedIndex].u_id,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.data.err) {
          setUserDeleteMessage("");
          setUserDeleteError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setUserDeleteError("");
          setUserDeleteMessage(response.data.message);
        }
        setUserDeleteLoading(false);
      })
      .catch((error) => {
        setUserDeleteMessage("");
        setUserDeleteError(error.message);
        setUserDeleteLoading(false);
      });
  };

  return (
    <motion.div
      initial="out"
      animate="in"
      exit="out"
      variants={pageTransitions.pageVariants}
      transition={pageTransitions.pageTransition}
    >
      <Modal
        show={showCommentDeclineModal}
        onHide={() => {
          setShowCommentDeclineModal(false);
          setCommentDeclineError("");
          setCommentDeclineMessage("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {commentDeclineError
              ? "Error!"
              : commentDeclineMessage
              ? "Success"
              : "Are you sure want to decline this comment?"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {commentDeclineError ? (
            <Alert variant="danger">{commentDeclineError}</Alert>
          ) : commentDeclineMessage ? (
            <Alert variant="success">{commentDeclineMessage}</Alert>
          ) : (
            <span
              style={{
                wordWrap: "break-word",
                fontSize: "15px",
                color: "#808080",
              }}
            >
              {commentsToAccept.length
                ? commentsToAccept[
                    commentSelectedIndex === -1 ? 0 : commentSelectedIndex
                  ].r_comment
                : null}
            </span>
          )}
        </Modal.Body>
        <Modal.Footer>
          {commentDeclineError || commentDeclineMessage ? (
            <Button
              variant="secondary"
              onClick={() => {
                setShowCommentDeclineModal(false);
                setCommentDeclineError("");
                setCommentDeclineMessage("");
              }}
            >
              OK
            </Button>
          ) : (
            <>
              <Button
                variant="danger"
                onClick={declineComment}
                disabled={commentDeclineLoading}
              >
                {commentDeclineLoading ? (
                  <i className="fa fa-spinner fa-spin" />
                ) : (
                  "Decline"
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowCommentDeclineModal(false);
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      <Modal
        show={showCommentAcceptModal}
        onHide={() => {
          setShowCommentAcceptModal(false);
          setCommentAcceptError("");
          setCommentAcceptMessage("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {commentAcceptError
              ? "Error!"
              : commentAcceptMessage
              ? "Success"
              : "Are you sure want to accept this comment?"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {commentAcceptError ? (
            <Alert variant="danger">{commentAcceptError}</Alert>
          ) : commentAcceptMessage ? (
            <Alert variant="success">{commentAcceptMessage}</Alert>
          ) : (
            <span
              style={{
                wordWrap: "break-word",
                fontSize: "15px",
                color: "#808080",
              }}
            >
              {commentsToAccept.length
                ? commentsToAccept[
                    commentSelectedIndex === -1 ? 0 : commentSelectedIndex
                  ].r_comment
                : null}
            </span>
          )}
        </Modal.Body>
        <Modal.Footer>
          {commentAcceptError || commentAcceptMessage ? (
            <Button
              variant="secondary"
              onClick={() => {
                setShowCommentAcceptModal(false);
                setCommentAcceptError("");
                setCommentAcceptMessage("");
              }}
            >
              OK
            </Button>
          ) : (
            <>
              <Button
                variant="success"
                onClick={acceptComment}
                disabled={commentAcceptLoading}
              >
                {commentAcceptLoading ? (
                  <i className="fa fa-spinner fa-spin" />
                ) : (
                  "Accept"
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowCommentAcceptModal(false);
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      <Modal
        show={showBlockModal}
        onHide={() => {
          setShowBlockModal(false);
          setBlockError("");
          setBlockMessage("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {blockError
              ? "Error!"
              : blockMessage
              ? "Success"
              : "Are you sure want to block this user?"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {blockError ? (
            <Alert variant="danger">{blockError}</Alert>
          ) : blockMessage ? (
            <Alert variant="success">{blockMessage}</Alert>
          ) : (
            <span
              style={{
                wordWrap: "break-word",
                fontSize: "15px",
                color: "#808080",
              }}
            >
              {users.length
                ? users[userSelectedIndex === -1 ? 0 : userSelectedIndex]
                    .u_email
                : null}
            </span>
          )}
        </Modal.Body>
        <Modal.Footer>
          {blockError || blockMessage ? (
            <Button
              variant="secondary"
              onClick={() => {
                setShowBlockModal(false);
                setBlockError("");
                setBlockMessage("");
              }}
            >
              OK
            </Button>
          ) : (
            <>
              <Button
                variant="danger"
                onClick={blockUser}
                disabled={blockLoading}
              >
                {blockLoading ? (
                  <i className="fa fa-spinner fa-spin" />
                ) : (
                  "Block"
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowBlockModal(false);
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      <Modal
        show={showUnBlockModal}
        onHide={() => {
          setShowUnBlockModal(false);
          setUnBlockError("");
          setUnBlockMessage("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {unBlockError
              ? "Error!"
              : unBlockMessage
              ? "Success"
              : "Are you sure want to unblock this user?"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {unBlockError ? (
            <Alert variant="danger">{unBlockError}</Alert>
          ) : unBlockMessage ? (
            <Alert variant="success">{unBlockMessage}</Alert>
          ) : (
            <span
              style={{
                wordWrap: "break-word",
                fontSize: "15px",
                color: "#808080",
              }}
            >
              {users.length
                ? users[userSelectedIndex === -1 ? 0 : userSelectedIndex]
                    .u_email
                : null}
            </span>
          )}
        </Modal.Body>
        <Modal.Footer>
          {unBlockError || unBlockMessage ? (
            <Button
              variant="secondary"
              onClick={() => {
                setShowUnBlockModal(false);
                setUnBlockError("");
                setUnBlockMessage("");
              }}
            >
              OK
            </Button>
          ) : (
            <>
              <Button
                variant="success"
                onClick={unBlockUser}
                disabled={unBlockLoading}
              >
                {unBlockLoading ? (
                  <i className="fa fa-spinner fa-spin" />
                ) : (
                  "Unblock"
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowUnBlockModal(false);
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      <Modal
        show={showUserDeleteModal}
        onHide={() => {
          setShowUserDeleteModal(false);
          setUserDeleteError("");
          setUserDeleteMessage("");
          setUsers(
            users.filter((user) => user.u_id !== users[userSelectedIndex].u_id)
          );
          setUserSelectedIndex(-1);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {userDeleteError
              ? "Error!"
              : userDeleteMessage
              ? "Success"
              : "Are you sure want to delete this user?"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userDeleteError ? (
            <Alert variant="danger">{userDeleteError}</Alert>
          ) : userDeleteMessage ? (
            <Alert variant="success">{userDeleteMessage}</Alert>
          ) : (
            <span
              style={{
                wordWrap: "break-word",
                fontSize: "15px",
                color: "#808080",
              }}
            >
              {users.length
                ? users[userSelectedIndex === -1 ? 0 : userSelectedIndex]
                    .u_email
                : null}
            </span>
          )}
        </Modal.Body>
        <Modal.Footer>
          {userDeleteError || userDeleteMessage ? (
            <Button
              variant="secondary"
              onClick={() => {
                setShowUserDeleteModal(false);
                setUserDeleteError("");
                setUserDeleteMessage("");
                setUsers(
                  users.filter(
                    (user) => user.u_id !== users[userSelectedIndex].u_id
                  )
                );
                setUserSelectedIndex(-1);
              }}
            >
              OK
            </Button>
          ) : (
            <>
              <Button
                variant="danger"
                onClick={deleteUser}
                disabled={userDeleteLoading}
              >
                {userDeleteLoading ? (
                  <i className="fa fa-spinner fa-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowUserDeleteModal(false);
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      <h1 style={{ margin: "20px" }}>Welcome on admin page!</h1>
      <div className="admin-page">
        <div style={{ display: "grid" }}>
          <h5>Recipes to accept</h5>
          <Table striped bordered hover variant="dark" responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Recipe Name</th>
              </tr>
            </thead>
            <tbody>
              {recipesToAcceptLoading ? (
                <tr style={{ transition: "0.3s" }}>
                  <td style={{ textAlign: "center" }} colSpan="2">
                    <i className="fa fa-spinner fa-spin" />
                  </td>
                </tr>
              ) : recipesToAcceptError ? (
                <tr style={{ transition: "0.3s" }}>
                  <td style={{ textAlign: "center" }} colSpan="2">
                    {recipesToAcceptError}
                  </td>
                </tr>
              ) : recipesToAccept && recipesToAccept.length ? (
                recipesToAccept.map((recipe, index) => {
                  return (
                    <tr key={recipe.r_id} style={{ transition: "0.3s" }}>
                      <td>
                        <Link
                          className="link-to-recipe"
                          to={`/recipe/${recipe.r_id}`}
                        >
                          {index + 1}.
                        </Link>
                      </td>
                      <td>
                        <Link
                          className="link-to-recipe"
                          to={`/recipe/${recipe.r_id}`}
                        >
                          {recipe.r_name}
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr style={{ transition: "0.3s" }}>
                  <td style={{ textAlign: "center" }} colSpan="2">
                    There is no recipes to accept!
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <div style={{ display: "grid" }}>
          <h5>Comments to accept</h5>
          <Table striped bordered hover variant="dark" responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Recipe to belong</th>
                <th>Comment</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              {commentsToAcceptLoading ? (
                <tr style={{ transition: "0.3s" }}>
                  <td style={{ textAlign: "center" }} colSpan="4">
                    <i className="fa fa-spinner fa-spin" />
                  </td>
                </tr>
              ) : commentsToAcceptError ? (
                <tr style={{ transition: "0.3s" }}>
                  <td style={{ textAlign: "center" }} colSpan="4">
                    {commentsToAcceptError}
                  </td>
                </tr>
              ) : commentsToAccept && commentsToAccept.length ? (
                commentsToAccept.map((comment, index) => {
                  return (
                    <tr
                      style={{ transition: "0.3s" }}
                      key={comment.r_comment_id}
                    >
                      <td>
                        <Link
                          className="link-to-recipe"
                          to={`/recipe/${comment.r_id}`}
                        >
                          {index + 1}.
                        </Link>
                      </td>
                      <td>
                        <Link
                          className="link-to-recipe"
                          to={`/recipe/${comment.r_id}`}
                        >
                          {comment.r_name}
                        </Link>
                      </td>
                      <td>{comment.r_comment}</td>
                      <td style={{ textAlign: "center" }}>
                        <Button
                          onClick={() => {
                            setShowCommentAcceptModal(true);
                            setCommentSelectedIndex(index);
                          }}
                          style={{ margin: "5px" }}
                          variant="success"
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() => {
                            setShowCommentDeclineModal(true);
                            setCommentSelectedIndex(index);
                          }}
                          style={{ margin: "5px" }}
                          variant="danger"
                        >
                          Decline
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr style={{ transition: "0.3s" }}>
                  <td style={{ textAlign: "center" }} colSpan="4">
                    There is no comments to accept!
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <div style={{ display: "grid" }}>
          <h5>Users</h5>
          <Table striped bordered hover variant="dark" responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Is Verified</th>
                <th>Block/Unblock User</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {usersLoading ? (
                <tr style={{ transition: "0.3s" }}>
                  <td style={{ textAlign: "center" }} colSpan="7">
                    <i className="fa fa-spinner fa-spin" />
                  </td>
                </tr>
              ) : usersError ? (
                <tr style={{ transition: "0.3s" }}>
                  <td style={{ textAlign: "center" }} colSpan="7">
                    {usersError}
                  </td>
                </tr>
              ) : users && users.length ? (
                users.map((user, index) => {
                  return (
                    <tr style={{ transition: "0.3s" }} key={index}>
                      <td>{index + 1}.</td>
                      <td>
                        {user.u_f_name} {user.u_l_name}
                      </td>
                      <td>{user.u_email}</td>
                      <td>{user.u_tel ? user.u_tel : "/"}</td>
                      <td style={{ textAlign: "center" }}>
                        {user.u_is_verified ? (
                          <span
                            style={{
                              backgroundColor: "#43e049",
                              padding: "3px 5px",
                              borderRadius: "3px",
                            }}
                          >
                            Yes
                          </span>
                        ) : (
                          <span
                            style={{
                              backgroundColor: "#e83c3c",
                              padding: "3px 5px",
                              borderRadius: "3px",
                            }}
                          >
                            No
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {user.u_is_blocked ? (
                          <Button
                            onClick={() => {
                              setShowUnBlockModal(true);
                              setUserSelectedIndex(index);
                            }}
                            style={{ margin: "5px" }}
                            variant="success"
                          >
                            Unblock
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              setShowBlockModal(true);
                              setUserSelectedIndex(index);
                            }}
                            style={{ margin: "5px" }}
                            variant="danger"
                          >
                            Block
                          </Button>
                        )}
                      </td>
                      <td>
                        <Button
                          onClick={() => {
                            setShowUserDeleteModal(true);
                            setUserSelectedIndex(index);
                          }}
                          style={{ margin: "5px" }}
                          variant="danger"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr style={{ transition: "0.3s" }}>
                  <td style={{ textAlign: "center" }} colSpan="7">
                    There is no user!
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </motion.div>
  );
}
