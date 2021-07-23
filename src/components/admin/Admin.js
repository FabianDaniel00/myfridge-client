import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Table,
  Button,
  Modal,
  Alert,
  InputGroup,
  Form,
  Image,
  Collapse,
  Toast,
} from "react-bootstrap";
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
  const [adminPassword, setAdminPassword] = useState("");
  const [showUserMakeAdminModal, setShowUserMakeAdminModal] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [showUserRemoveAdminModal, setShowUserRemoveAdminModal] =
    useState(false);
  const [makeAdminLoading, setMakeAdminLoading] = useState(false);
  const [makeAdminError, setMakeAdminError] = useState("");
  const [makeAdminMessage, setMakeAdminMessage] = useState("");
  const [showUserDeleteModal, setShowUserDeleteModal] = useState(false);
  const [userDeleteLoading, setUserDeleteLoading] = useState(false);
  const [userDeleteError, setUserDeleteError] = useState("");
  const [userDeleteMessage, setUserDeleteMessage] = useState("");
  const [usersSearch, setUsersSearch] = useState("");
  const [groceriesSearch, setGroceriesSearch] = useState("");
  const [groceries, setGroceries] = useState([]);
  const [groceriesLoading, setGroceriesLoading] = useState(true);
  const [groceriesError, setGroceriesError] = useState("");
  const [showGroceryEditModal, setShowGroceryEditModal] = useState(false);
  const [grocerySelectedIndex, setGrocerySelectedIndex] = useState(-1);
  const [showGroceryDeleteModal, setShowGroceryDeleteModal] = useState(false);
  const [groceryDeleteError, setGroceryDeleteError] = useState("");
  const [groceryDeleteMessage, setGroceryDeleteMessage] = useState("");
  const [groceryDeleteLoading, setGroceryDeleteLoading] = useState(false);
  const [groceryEditError, setGroceryEditError] = useState("");
  const [groceryEditMessage, setGroceryEditMessage] = useState("");
  const [groceryEditLoading, setGroceryEditLoading] = useState(false);
  const [groceryName, setGroceryName] = useState("");
  const [groceryCategory, setGroceryCategory] = useState(-1);
  const [groceryPrice, setGroceryPrice] = useState(0);
  const [groceryQuantityType, setGroceryQuantityType] = useState("");
  const [groceryWarranty, setGroceryWarranty] = useState(0);
  const [groceryImage, setGroceryImage] = useState("");
  const [groceryCategories, setGroceryCategories] = useState([]);
  const [groceryCategoriesError, setGroceryCategoriesError] = useState("");
  const [groceryImageError, setGroceryImageError] = useState("");
  const [showGroceryAddModal, setShowGroceryAddModal] = useState(false);
  const [groceryAddLoading, setGroceryAddLoading] = useState(false);
  const [groceryAddMessage, setGroceryAddMessage] = useState("");
  const [groceryAddError, setGroceryAddError] = useState("");

  useEffect(() => {
    getRecipesToAccept();
    getCommentsToAccept();
    getUsers();
    getGroceries();
    getGroceryCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setUsersLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_API_HOST}/admin/get_users/${
          usersSearch ? usersSearch : `all`
        }`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
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

  const makeAdminUser = () => {
    if (!adminPassword) {
      setAdminError("Please give your password!");
    } else {
      setMakeAdminLoading(true);
      axios
        .post(
          `${process.env.REACT_APP_API_HOST}/admin/make_admin_user`,
          {
            u_id: users[userSelectedIndex].u_id,
            u_is_admin: !users[userSelectedIndex].u_is_admin,
            admin_password: adminPassword,
          },
          {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          if (response.data.err) {
            setMakeAdminMessage("");
            setMakeAdminError(response.data.err);
          } else if (response.data.wrongPassword) {
            setAdminError(response.data.wrongPassword);
          } else {
            if (response.data.newToken) {
              localStorage.setItem("token", response.data.newToken);
            }
            setUsers(() => {
              const users_ = [...users];
              users_[userSelectedIndex].u_is_admin =
                !users_[userSelectedIndex].u_is_admin;

              return users_;
            });
            setMakeAdminError("");
            setMakeAdminMessage(response.data.message);
          }
          setMakeAdminLoading(false);
        })
        .catch((error) => {
          setMakeAdminMessage("");
          setMakeAdminError(error.message);
          setMakeAdminLoading(false);
        });
    }
  };

  const getGroceries = () => {
    setGroceriesLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_API_HOST}/admin/get_groceries/${
          groceriesSearch ? groceriesSearch : `all`
        }`,
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.data.err) {
          setGroceriesError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setGroceries(response.data.groceries);
        }
        setGroceriesLoading(false);
      })
      .catch((error) => {
        setGroceriesError(error.message);
        setGroceriesLoading(false);
      });
  };

  const deleteGrocery = () => {
    setGroceryDeleteLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API_HOST}/admin/delete_grocery`,
        {
          g_id: groceries[grocerySelectedIndex].g_id,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.data.err) {
          setGroceryDeleteMessage("");
          setGroceryDeleteError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setGroceryDeleteError("");
          setGroceryDeleteMessage(response.data.message);
        }
        setGroceryDeleteLoading(false);
      })
      .catch((error) => {
        setGroceryDeleteMessage("");
        setGroceryDeleteError(error.message);
        setGroceryDeleteLoading(false);
      });
  };

  const editGrocery = () => {
    if (
      !groceryName ||
      groceryCategory === "" ||
      groceryPrice === "" ||
      !groceryQuantityType ||
      groceryWarranty === ""
    ) {
      setGroceryImageError("Missing parameters...");
    } else {
      setGroceryEditLoading(true);
      axios
        .post(
          `${process.env.REACT_APP_API_HOST}/admin/edit_grocery`,
          {
            g_id: groceries[grocerySelectedIndex].g_id,
            g_img: groceryImage
              ? groceryImage
              : "data:image/png;base64," +
                groceries[grocerySelectedIndex].g_img,
            g_name: groceryName,
            g_cat_id: groceryCategory,
            g_price: groceryPrice,
            g_quantity_type: groceryQuantityType,
            warranty_day: groceryWarranty,
          },
          {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          if (response.data.err) {
            setGroceryEditMessage("");
            setGroceryEditError(response.data.err);
          } else {
            if (response.data.newToken) {
              localStorage.setItem("token", response.data.newToken);
            }
            setGroceries((groceries) => {
              const groceries_ = [...groceries];
              groceries_[grocerySelectedIndex].g_img = groceryImage
                ? groceryImage.split(";base64,")[1]
                : groceries_[grocerySelectedIndex].g_img;
              groceries_[grocerySelectedIndex].g_name = groceryName;
              groceries_[grocerySelectedIndex].g_cat_id = groceryCategory;
              groceries_[grocerySelectedIndex].g_cat_name =
                groceryCategories.filter(
                  (groceryCategory_) =>
                    groceryCategory_.g_cat_id === parseInt(groceryCategory)
                )[0].g_cat_name;
              groceries_[grocerySelectedIndex].g_price = groceryPrice;
              groceries_[grocerySelectedIndex].g_quantity_type =
                groceryQuantityType;
              groceries_[grocerySelectedIndex].warranty_day = groceryWarranty;

              return groceries_;
            });
            setGroceryEditError("");
            setGroceryEditMessage(response.data.message);
          }
          setGroceryEditLoading(false);
        })
        .catch((error) => {
          setGroceryEditMessage("");
          setGroceryEditError(error.message);
          setGroceryEditLoading(false);
        });
    }
  };

  const addGrocery = () => {
    if (parseInt(groceryCategory) === -1) {
      setGroceryImageError("Please select one category!");
    } else if (!groceryImage) {
      setGroceryImageError("Please select a picture!");
    } else if (
      !groceryName ||
      groceryPrice === "" ||
      !groceryQuantityType ||
      groceryWarranty === ""
    ) {
      setGroceryImageError("Missing parameters...");
    } else {
      setGroceryAddLoading(true);
      axios
        .post(
          `${process.env.REACT_APP_API_HOST}/admin/add_grocery`,
          {
            g_img: groceryImage
              ? groceryImage
              : "data:image/png;base64," +
                groceries[grocerySelectedIndex].g_img,
            g_name: groceryName,
            g_cat_id: groceryCategory,
            g_price: groceryPrice,
            g_quantity_type: groceryQuantityType,
            warranty_day: groceryWarranty,
          },
          {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          if (response.data.err) {
            setGroceryAddMessage("");
            setGroceryAddError(response.data.err);
          } else {
            if (response.data.newToken) {
              localStorage.setItem("token", response.data.newToken);
            }
            setGroceries((groceries) => [
              {
                g_id: response.data.g_id,
                g_name: groceryName,
                g_cat_name: groceryCategories.filter(
                  (groceryCategory_) =>
                    groceryCategory_.g_cat_id === parseInt(groceryCategory)
                )[0].g_cat_name,
                g_cat_id: groceryCategory,
                g_price: groceryPrice,
                g_quantity_type: groceryQuantityType,
                g_img: groceryImage.split(";base64,")[1],
                warranty_day: groceryWarranty,
              },
              ...groceries,
            ]);
            setGroceryAddError("");
            setGroceryAddMessage(response.data.message);
          }
          setGroceryAddLoading(false);
        })
        .catch((error) => {
          setGroceryAddMessage("");
          setGroceryAddError(error.message);
          setGroceryAddLoading(false);
        });
    }
  };

  const getGroceryCategories = () => {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/admin/get_g_categories`, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.data.err) {
          setGroceryCategoriesError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setGroceryCategories(response.data.categories);
        }
      })
      .catch((error) => {
        setGroceryCategoriesError(error.message);
      });
  };

  const validateGroceryPic = async () => {
    const pic = document.getElementById("grocery_pic");

    const checkExtension = () => {
      const picName = pic.files[0].name;
      const parts = picName.split(".");
      const extension = parts[parts.length - 1];

      switch (extension.toLowerCase()) {
        case "jpg":
          return true;
        case "jpeg":
          return true;
        case "png":
          return true;
        default:
          return false;
      }
    };

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    if (pic.files.length) {
      const picSize = Math.round(pic.files.item(0).size / 1024);

      if (picSize >= 1024) {
        pic.value = "";
        setGroceryImageError("Picture is to large.");
        return false;
      } else if (!checkExtension()) {
        pic.value = "";
        setGroceryImageError("The selected file is not a picture!");
        return false;
      } else {
        const resultPic = await toBase64(pic.files[0]).catch((e) => Error(e));
        if (resultPic instanceof Error) {
          setGroceryImageError(resultPic.message);
          return false;
        }
        setGroceryImage(resultPic);
        return true;
      }
    } else {
      return true;
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
                  setUserSelectedIndex(-1);
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
          if (userDeleteMessage) {
            setUsers(
              users.filter(
                (user) => user.u_id !== users[userSelectedIndex].u_id
              )
            );
          }
          setShowUserDeleteModal(false);
          setUserDeleteError("");
          setUserDeleteMessage("");
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
                if (userDeleteMessage) {
                  setUsers(
                    users.filter(
                      (user) => user.u_id !== users[userSelectedIndex].u_id
                    )
                  );
                }
                setShowUserDeleteModal(false);
                setUserDeleteError("");
                setUserDeleteMessage("");
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
                  setUserSelectedIndex(-1);
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      <Modal
        show={showUserMakeAdminModal}
        onHide={() => {
          setShowUserMakeAdminModal(false);
          setMakeAdminError("");
          setMakeAdminMessage("");
          setUserSelectedIndex(-1);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {makeAdminError
              ? "Error!"
              : makeAdminMessage
              ? "Success"
              : "Are you sure want to give this user admin?"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {makeAdminError ? (
            <Alert variant="danger">{makeAdminError}</Alert>
          ) : makeAdminMessage ? (
            <Alert variant="success">{makeAdminMessage}</Alert>
          ) : (
            <>
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

              <br />
              <br />

              <Form.Group controlId="makeAdminPass">
                <Form.Label>Your password:</Form.Label>
                <Form.Control
                  onChange={(event) => setAdminPassword(event.target.value)}
                  type="password"
                />
              </Form.Group>

              <Collapse in={adminError}>
                <div>
                  <Toast
                    onClose={() => {
                      setAdminError("");
                    }}
                    show={adminError}
                    delay={10000}
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
                      <Alert variant="danger">{adminError}</Alert>
                    </Toast.Body>
                  </Toast>
                </div>
              </Collapse>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {makeAdminError || makeAdminMessage ? (
            <Button
              variant="secondary"
              onClick={() => {
                setShowUserMakeAdminModal(false);
                setMakeAdminError("");
                setMakeAdminMessage("");
                setUserSelectedIndex(-1);
              }}
            >
              OK
            </Button>
          ) : (
            <>
              <Button
                variant="warning"
                onClick={makeAdminUser}
                disabled={makeAdminLoading}
              >
                {makeAdminLoading ? (
                  <i className="fa fa-spinner fa-spin" />
                ) : (
                  "Give Admin"
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowUserMakeAdminModal(false);
                  setUserSelectedIndex(-1);
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      <Modal
        show={showUserRemoveAdminModal}
        onHide={() => {
          setShowUserRemoveAdminModal(false);
          setMakeAdminError("");
          setMakeAdminMessage("");
          setUserSelectedIndex(-1);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {makeAdminError
              ? "Error!"
              : makeAdminMessage
              ? "Success"
              : "Are you sure want to remove admin from this user?"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {makeAdminError ? (
            <Alert variant="danger">{makeAdminError}</Alert>
          ) : makeAdminMessage ? (
            <Alert variant="success">{makeAdminMessage}</Alert>
          ) : (
            <>
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

              <br />
              <br />

              <Form.Group controlId="removeAdminPass">
                <Form.Label>Your password:</Form.Label>
                <Form.Control
                  onChange={(event) => setAdminPassword(event.target.value)}
                  type="password"
                />
              </Form.Group>

              <Collapse in={adminError}>
                <div>
                  <Toast
                    onClose={() => {
                      setAdminError("");
                    }}
                    show={adminError}
                    delay={10000}
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
                      <Alert variant="danger">{adminError}</Alert>
                    </Toast.Body>
                  </Toast>
                </div>
              </Collapse>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {makeAdminError || makeAdminMessage ? (
            <Button
              variant="secondary"
              onClick={() => {
                setShowUserRemoveAdminModal(false);
                setMakeAdminError("");
                setMakeAdminMessage("");
                setUserSelectedIndex(-1);
              }}
            >
              OK
            </Button>
          ) : (
            <>
              <Button
                variant="danger"
                onClick={makeAdminUser}
                disabled={makeAdminLoading}
              >
                {makeAdminLoading ? (
                  <i className="fa fa-spinner fa-spin" />
                ) : (
                  "Remove Admin"
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowUserRemoveAdminModal(false);
                  setUserSelectedIndex(-1);
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      <Modal
        show={showGroceryDeleteModal}
        onHide={() => {
          if (groceryDeleteMessage) {
            setGroceries(
              groceries.filter(
                (grocery) =>
                  grocery.g_id !== groceries[grocerySelectedIndex].g_id
              )
            );
          }
          setShowGroceryDeleteModal(false);
          setGroceryDeleteError("");
          setGroceryDeleteMessage("");
          setGrocerySelectedIndex(-1);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {groceryDeleteError
              ? "Error!"
              : groceryDeleteMessage
              ? "Success"
              : "Are you sure want to delete this grocery?"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {groceryDeleteError ? (
            <Alert variant="danger">{groceryDeleteError}</Alert>
          ) : groceryDeleteMessage ? (
            <Alert variant="success">{groceryDeleteMessage}</Alert>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Image
                src={`data:image/png;base64,${
                  groceries.length
                    ? groceries[
                        grocerySelectedIndex === -1 ? 0 : grocerySelectedIndex
                      ].g_img
                    : null
                }`}
                alt={
                  groceries.length
                    ? groceries[
                        grocerySelectedIndex === -1 ? 0 : grocerySelectedIndex
                      ].g_id
                    : null
                }
                width="128px"
                rounded
              />
              <span
                style={{
                  wordWrap: "break-word",
                  fontSize: "15px",
                  color: "#808080",
                }}
              >
                {groceries.length
                  ? groceries[
                      grocerySelectedIndex === -1 ? 0 : grocerySelectedIndex
                    ].g_name
                  : null}
              </span>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {groceryDeleteError || groceryDeleteMessage ? (
            <Button
              variant="secondary"
              onClick={() => {
                if (groceryDeleteMessage) {
                  setGroceries(
                    groceries.filter(
                      (grocery) =>
                        grocery.g_id !== groceries[grocerySelectedIndex].g_id
                    )
                  );
                }
                setShowGroceryDeleteModal(false);
                setGroceryDeleteError("");
                setGroceryDeleteMessage("");
                setGrocerySelectedIndex(-1);
              }}
            >
              OK
            </Button>
          ) : (
            <>
              <Button
                variant="danger"
                onClick={deleteGrocery}
                disabled={groceryDeleteLoading}
              >
                {groceryDeleteLoading ? (
                  <i className="fa fa-spinner fa-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowGroceryDeleteModal(false);
                  setGrocerySelectedIndex(-1);
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      <Modal
        show={showGroceryAddModal}
        onHide={() => {
          setShowGroceryAddModal(false);
          setGroceryAddError("");
          setGroceryAddMessage("");
          setGrocerySelectedIndex(-1);
          setGroceryName("");
          setGroceryCategory(-1);
          setGroceryPrice(0);
          setGroceryQuantityType("");
          setGroceryWarranty(0);
          setGroceryImage("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {groceryAddError
              ? "Error!"
              : groceryAddMessage
              ? "Success"
              : "Grocery Add"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {groceryAddError ? (
            <Alert variant="danger">{groceryAddError}</Alert>
          ) : groceryAddMessage ? (
            <Alert variant="success">{groceryAddMessage}</Alert>
          ) : (
            <>
              <Form.Group controlId="gAddName">
                <Form.Label>Grocery Name:</Form.Label>
                <Form.Control
                  onChange={(event) => setGroceryName(event.target.value)}
                  type="text"
                />
              </Form.Group>

              <Form.Group controlId="gAddCategory">
                <Form.Label>Grocery Category:</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(event) => setGroceryCategory(event.target.value)}
                >
                  <option value="-1">-choose one category-</option>
                  {groceryCategoriesError ? (
                    <option>{groceryCategoriesError}</option>
                  ) : (
                    groceryCategories &&
                    groceryCategories.map((groceryCategory) => {
                      return (
                        <option
                          key={groceryCategory.g_cat_id}
                          value={groceryCategory.g_cat_id}
                        >
                          {groceryCategory.g_cat_name}
                        </option>
                      );
                    })
                  )}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="gAddPrice">
                <Form.Label>Grocery Price: (€)</Form.Label>
                <Form.Control
                  onChange={(event) => setGroceryPrice(event.target.value)}
                  type="number"
                />
              </Form.Group>

              <Form.Group controlId="gAddQuantityType">
                <Form.Label>Grocery Quantity Type:</Form.Label>
                <Form.Control
                  onChange={(event) =>
                    setGroceryQuantityType(event.target.value)
                  }
                  type="text"
                />
              </Form.Group>

              <Form.Group controlId="gAddWarranty">
                <Form.Label>Grocery Warranty in days:</Form.Label>
                <Form.Control
                  onChange={(event) => setGroceryWarranty(event.target.value)}
                  type="number"
                />
              </Form.Group>

              <Form.File>
                <Form.File.Label>
                  Image for grocery{" "}
                  <i style={{ color: "#a1a1a1", fontSize: "13px" }}>
                    (max 1 MB, 128x128)
                  </i>
                </Form.File.Label>
                <Form.File.Input
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={validateGroceryPic}
                  id="grocery_pic"
                  style={{ fontSize: "13px" }}
                />
              </Form.File>

              <Collapse in={groceryImageError}>
                <div>
                  <Toast
                    onClose={() => {
                      setGroceryImageError("");
                    }}
                    show={groceryImageError}
                    delay={10000}
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
                      <Alert variant="danger">{groceryImageError}</Alert>
                    </Toast.Body>
                  </Toast>
                </div>
              </Collapse>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {groceryAddError || groceryAddMessage ? (
            <Button
              variant="secondary"
              onClick={() => {
                setShowGroceryAddModal(false);
                setGroceryAddError("");
                setGroceryAddMessage("");
                setGrocerySelectedIndex(-1);
                setGroceryName("");
                setGroceryCategory(-1);
                setGroceryPrice(0);
                setGroceryQuantityType("");
                setGroceryWarranty(0);
                setGroceryImage("");
              }}
            >
              OK
            </Button>
          ) : (
            <>
              <Button
                variant="success"
                onClick={addGrocery}
                disabled={groceryAddLoading}
              >
                {groceryAddLoading ? (
                  <i className="fa fa-spinner fa-spin" />
                ) : (
                  "Add"
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowGroceryAddModal(false);
                  setGrocerySelectedIndex(-1);
                  setGroceryName("");
                  setGroceryCategory(-1);
                  setGroceryPrice(0);
                  setGroceryQuantityType("");
                  setGroceryWarranty(0);
                  setGroceryImage("");
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      <Modal
        show={showGroceryEditModal}
        onHide={() => {
          setShowGroceryEditModal(false);
          setGroceryEditError("");
          setGroceryEditMessage("");
          setGrocerySelectedIndex(-1);
          setGroceryName("");
          setGroceryCategory(-1);
          setGroceryPrice(0);
          setGroceryQuantityType("");
          setGroceryWarranty(0);
          setGroceryImage("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {groceryEditError
              ? "Error!"
              : groceryEditMessage
              ? "Success"
              : "Grocery Edit"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {groceryEditError ? (
            <Alert variant="danger">{groceryEditError}</Alert>
          ) : groceryEditMessage ? (
            <Alert variant="success">{groceryEditMessage}</Alert>
          ) : (
            <>
              <div style={{ textAlign: "center" }}>
                <Image
                  src={`data:image/png;base64,${
                    groceries.length
                      ? groceries[
                          grocerySelectedIndex === -1 ? 0 : grocerySelectedIndex
                        ].g_img
                      : null
                  }`}
                  alt={
                    groceries.length
                      ? groceries[
                          grocerySelectedIndex === -1 ? 0 : grocerySelectedIndex
                        ].g_id
                      : null
                  }
                  width="128px"
                  style={{ marginBottom: "10px" }}
                  rounded
                />
              </div>
              <Form.Group controlId="gName">
                <Form.Label>Grocery Name:</Form.Label>
                <Form.Control
                  onChange={(event) => setGroceryName(event.target.value)}
                  type="text"
                  value={groceryName}
                />
              </Form.Group>

              <Form.Group controlId="gCategory">
                <Form.Label>Grocery Category:</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(event) => setGroceryCategory(event.target.value)}
                  value={groceryCategory}
                >
                  {groceryCategoriesError ? (
                    <option>{groceryCategoriesError}</option>
                  ) : (
                    groceryCategories &&
                    groceryCategories.map((groceryCategory) => {
                      return (
                        <option
                          key={groceryCategory.g_cat_id}
                          value={groceryCategory.g_cat_id}
                        >
                          {groceryCategory.g_cat_name}
                        </option>
                      );
                    })
                  )}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="gPrice">
                <Form.Label>Grocery Price: (€)</Form.Label>
                <Form.Control
                  onChange={(event) => setGroceryPrice(event.target.value)}
                  type="number"
                  value={groceryPrice}
                />
              </Form.Group>

              <Form.Group controlId="gQuantityType">
                <Form.Label>Grocery Quantity Type:</Form.Label>
                <Form.Control
                  onChange={(event) =>
                    setGroceryQuantityType(event.target.value)
                  }
                  type="text"
                  value={groceryQuantityType}
                />
              </Form.Group>

              <Form.Group controlId="gWarranty">
                <Form.Label>Grocery Warranty in days:</Form.Label>
                <Form.Control
                  onChange={(event) => setGroceryWarranty(event.target.value)}
                  type="number"
                  value={groceryWarranty}
                />
              </Form.Group>

              <Form.File>
                <Form.File.Label>
                  Image change for grocery{" "}
                  <i style={{ color: "#a1a1a1", fontSize: "13px" }}>
                    (max 1 MB, 128x128)
                  </i>
                </Form.File.Label>
                <Form.File.Input
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={validateGroceryPic}
                  id="grocery_pic"
                  style={{ fontSize: "13px" }}
                />
              </Form.File>

              <Collapse in={groceryImageError}>
                <div>
                  <Toast
                    onClose={() => {
                      setGroceryImageError("");
                    }}
                    show={groceryImageError}
                    delay={10000}
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
                      <Alert variant="danger">{groceryImageError}</Alert>
                    </Toast.Body>
                  </Toast>
                </div>
              </Collapse>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {groceryEditError || groceryEditMessage ? (
            <Button
              variant="secondary"
              onClick={() => {
                setShowGroceryEditModal(false);
                setGroceryEditError("");
                setGroceryEditMessage("");
                setGrocerySelectedIndex(-1);
                setGroceryName("");
                setGroceryCategory(-1);
                setGroceryPrice(0);
                setGroceryQuantityType("");
                setGroceryWarranty(0);
                setGroceryImage("");
              }}
            >
              OK
            </Button>
          ) : (
            <>
              <Button
                variant="success"
                onClick={editGrocery}
                disabled={groceryEditLoading}
              >
                {groceryEditLoading ? (
                  <i className="fa fa-spinner fa-spin" />
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowGroceryEditModal(false);
                  setGrocerySelectedIndex(-1);
                  setGroceryName("");
                  setGroceryCategory(-1);
                  setGroceryPrice(0);
                  setGroceryQuantityType("");
                  setGroceryWarranty(0);
                  setGroceryImage("");
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

        <div style={{ display: "grid", marginTop: "10px" }}>
          <h5>Groceries</h5>

          <Button
            variant="outline-info"
            style={{ width: "200px" }}
            onClick={() => setShowGroceryAddModal(true)}
          >
            <i className="fas fa-plus" /> Add grocery
          </Button>

          <InputGroup size="sm" style={{ width: "300px", margin: "10px auto" }}>
            <Form.Control
              placeholder="Search for groceries...."
              aria-label="Search"
              onChange={(event) => setGroceriesSearch(event.target.value)}
            />
            <InputGroup.Append>
              <Button
                variant="outline-secondary"
                onClick={getGroceries}
                disabled={groceriesLoading}
              >
                Search
              </Button>
            </InputGroup.Append>
          </InputGroup>

          <Table striped bordered hover variant="dark" responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity type</th>
                <th>Warranty in days</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {groceriesLoading ? (
                <tr style={{ transition: "0.3s" }}>
                  <td style={{ textAlign: "center" }} colSpan="9">
                    <i className="fa fa-spinner fa-spin" />
                  </td>
                </tr>
              ) : groceriesError ? (
                <tr style={{ transition: "0.3s" }}>
                  <td style={{ textAlign: "center" }} colSpan="9">
                    {groceriesError}
                  </td>
                </tr>
              ) : groceries && groceries.length ? (
                groceries.map((grocery, index) => {
                  return (
                    <tr style={{ transition: "0.3s" }} key={index}>
                      <td>{index + 1}.</td>
                      <td style={{ textAlign: "center" }}>
                        <Image
                          src={`data:image/png;base64,${grocery.g_img}`}
                          alt={grocery.g_id}
                          rounded
                        />
                      </td>
                      <td>{grocery.g_name}</td>
                      <td>{grocery.g_cat_name}</td>
                      <td>
                        {Math.round(grocery.g_price * 100) / 100} €{" "}
                        {grocery.g_quantity_type === "g" ? "(1 kg)" : null}
                      </td>
                      <td>{grocery.g_quantity_type}</td>
                      <td>{grocery.warranty_day}</td>
                      <td style={{ textAlign: "center" }}>
                        <Button
                          onClick={() => {
                            setGroceryName(grocery.g_name);
                            setGroceryCategory(grocery.g_cat_id);
                            setGroceryPrice(grocery.g_price);
                            setGroceryQuantityType(grocery.g_quantity_type);
                            setGroceryWarranty(grocery.warranty_day);
                            setShowGroceryEditModal(true);
                            setGrocerySelectedIndex(index);
                          }}
                          style={{ margin: "5px" }}
                          variant="warning"
                        >
                          Edit
                        </Button>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <Button
                          onClick={() => {
                            setShowGroceryDeleteModal(true);
                            setGrocerySelectedIndex(index);
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
                  <td style={{ textAlign: "center" }} colSpan="9">
                    There is no grocery!
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <div style={{ display: "grid", marginTop: "10px" }}>
          <h5>Users</h5>

          <InputGroup size="sm" style={{ width: "300px", margin: "10px auto" }}>
            <Form.Control
              placeholder="Search with email or name..."
              aria-label="Search"
              onChange={(event) => setUsersSearch(event.target.value)}
            />
            <InputGroup.Append>
              <Button
                variant="outline-secondary"
                onClick={getUsers}
                disabled={usersLoading}
              >
                Search
              </Button>
            </InputGroup.Append>
          </InputGroup>

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
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
              {usersLoading ? (
                <tr style={{ transition: "0.3s" }}>
                  <td style={{ textAlign: "center" }} colSpan="8">
                    <i className="fa fa-spinner fa-spin" />
                  </td>
                </tr>
              ) : usersError ? (
                <tr style={{ transition: "0.3s" }}>
                  <td style={{ textAlign: "center" }} colSpan="8">
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
                      <td style={{ textAlign: "center" }}>
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
                      <td style={{ textAlign: "center" }}>
                        {user.u_is_admin ? (
                          <Button
                            onClick={() => {
                              setShowUserRemoveAdminModal(true);
                              setUserSelectedIndex(index);
                            }}
                            style={{ margin: "5px" }}
                            variant="danger"
                          >
                            Remove Admin
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              setShowUserMakeAdminModal(true);
                              setUserSelectedIndex(index);
                            }}
                            style={{ margin: "5px" }}
                            variant="warning"
                          >
                            Give Admin
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr style={{ transition: "0.3s" }}>
                  <td style={{ textAlign: "center" }} colSpan="8">
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
