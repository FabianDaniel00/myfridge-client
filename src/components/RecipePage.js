import { useParams, Link, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import moment from "moment";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { v4 as uuidv4 } from "uuid";
import {
  Image,
  Card,
  InputGroup,
  Button,
  FormControl,
  Toast,
  Alert,
  Collapse,
  Modal,
  Badge,
} from "react-bootstrap";
import { motion } from "framer-motion";
import "../style/RecipePage.scss";
import defaultRecipe from "../img/recipe_default.png";
import userContext from "../user/UserContext.js";

export default function RecipePage({ pageTransitions }) {
  const [recipe, setRecipe] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState([]);
  const [comment, setComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [commentMessage, setCommentMessage] = useState("");
  const [deleteCommentLoading, setDeleteCommentLoading] = useState(false);
  const [deleteCommentError, setDeleteCommentError] = useState("");
  const [deleteCommentMessage, setDeleteCommentMessage] = useState("");
  const [commentId, setCommentId] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [ratingStars, setRatingStars] = useState([]);
  const [rateError, setRateError] = useState("");
  const [rateMessage, setRateMessage] = useState("");
  const [rateToastShow, setRateToastShow] = useState(false);
  const [rateByUser, setRateByUser] = useState("");
  const [overallRating, setOverallRating] = useState("");
  const [ratingsCount, setRatingsCount] = useState(0);
  const [ratingDataLoading, setRatingDataLoading] = useState(true);
  const [ratingDataError, setRatingDataError] = useState("");
  const [favoriteError, setFavoriteError] = useState("");
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);
  const [declineError, setDeclineError] = useState("");
  const [declineMessage, setDeclineMessage] = useState("");
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [acceptError, setAcceptError] = useState("");
  const [acceptMessage, setAcceptMessage] = useState("");

  const { user } = useContext(userContext);

  const { r_id } = useParams();

  const location = useLocation();

  useEffect(() => {
    getRecipe();
    getRatingData();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRecipe = () => {
    axios
      .get(`${process.env.REACT_APP_API_HOST}/recipes/r/r/recipe/${r_id}`)
      .then((response) => {
        if (response.data.err) {
          setError(response.data.err);
        } else {
          const length = response.data.recipe.data.r_description.length;
          let description = response.data.recipe.data.r_description;
          for (let i = 0; i < length; i++) {
            if (description[i] === "\n") {
              description = [
                description.slice(0, i),
                "\n",
                description.slice(i),
              ].join("");
              i++;
            }
          }
          response.data.recipe.data.r_description = description;
          setRecipe(response.data.recipe);
          setComments(response.data.comments);
          setRateByUser(response.data.rating_by_user);

          const rating_by_user = response.data.rating_by_user;
          setRatingStars([rating_by_user ? rating_by_user + " " : "  "]);
          for (let i = 0; i < 5; i++) {
            if (i < rating_by_user) {
              // eslint-disable-next-line no-loop-func
              setRatingStars((ratingStars) => [
                ...ratingStars,
                <i
                  key={i}
                  style={{ color: "#d54215" }}
                  className="fa fa-star star"
                  onMouseEnter={() => drawStars(i + 1)}
                />,
              ]);
            } else {
              // eslint-disable-next-line no-loop-func
              setRatingStars((ratingStars) => [
                ...ratingStars,
                <i
                  key={i}
                  style={{ color: "#d54215" }}
                  className="far fa-star star"
                  onMouseEnter={() => drawStars(i + 1)}
                />,
              ]);
            }
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const getRatingData = () => {
    setRatingDataLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_HOST}/recipes/r/r/rating_data/${r_id}`)
      .then((response) => {
        if (response.data.err) {
          setRatingDataError(response.data.err);
        } else {
          setOverallRating(Math.round(response.data.rating * 10) / 10);
          setRatingsCount(response.data.ratings_count);

          const rating = Math.round(response.data.rating * 10) / 10;
          let halfStar = true;
          setRating([rating + " "]);
          for (let i = 0; i < 5; i++) {
            if (i < Math.floor(rating)) {
              setRating((rating) => [
                ...rating,
                <i
                  key={i}
                  style={{ color: "#d54215" }}
                  className="fa fa-star"
                />,
              ]);
            } else if (
              rating - Math.floor(rating) >= 0.3 &&
              rating - Math.floor(rating) <= 0.7 &&
              halfStar
            ) {
              setRating((rating) => [
                ...rating,
                <i
                  key={i}
                  style={{ color: "#d54215" }}
                  className="fas fa-star-half-alt"
                />,
              ]);
              halfStar = false;
            } else if (rating) {
              setRating((rating) => [
                ...rating,
                <i
                  key={i}
                  style={{ color: "#d54215" }}
                  className="far fa-star"
                />,
              ]);
            }
          }
        }
        setRatingDataLoading(false);
      })
      .catch((error) => {
        setRatingDataError(error.message);
        setRatingDataLoading(false);
      });
  };

  const drawStars = (starsCount) => {
    setRatingStars([starsCount + " "]);
    for (let i = 0; i < 5; i++) {
      if (i < starsCount) {
        setRatingStars((ratingStars) => [
          ...ratingStars,
          <i
            key={i}
            style={{ color: "#d54215" }}
            className="fa fa-star star"
            onMouseEnter={() => drawStars(i + 1)}
            onClick={() => rateRecipe(i + 1)}
          />,
        ]);
      } else {
        setRatingStars((ratingStars) => [
          ...ratingStars,
          <i
            key={i}
            style={{ color: "#d54215" }}
            className="far fa-star star"
            onMouseEnter={() => drawStars(i + 1)}
          />,
        ]);
      }
    }
  };

  const drawDefaultRating = (rating = rateByUser) => {
    setRatingStars([rating ? rating + " " : "  "]);
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        // eslint-disable-next-line no-loop-func
        setRatingStars((ratingStars) => [
          ...ratingStars,
          <i
            key={i}
            style={{ color: "#d54215" }}
            className="fa fa-star star"
            onMouseEnter={() => drawStars(i + 1)}
          />,
        ]);
      } else {
        // eslint-disable-next-line no-loop-func
        setRatingStars((ratingStars) => [
          ...ratingStars,
          <i
            key={i}
            style={{ color: "#d54215" }}
            className="far fa-star star"
            onMouseEnter={() => drawStars(i + 1)}
          />,
        ]);
      }
    }
  };

  const addComment = () => {
    setCommentLoading(true);
    const r_comment_id = uuidv4();
    axios
      .post(
        `${process.env.REACT_APP_API_HOST}/recipes/add_comment`,
        {
          comment,
          r_comment_id,
          r_id,
          u_id: user.u_id,
        },
        { headers: { "x-access-token": localStorage.getItem("token") } }
      )
      .then((response) => {
        if (response.data.err) {
          setCommentMessage("");
          setCommentError(response.data.err);
          if (response.data.commentId) {
            const comment_ = document.getElementById(response.data.commentId);
            comment_.scrollIntoView();
            comment_.style.backgroundColor = "#e6fcff";
            setTimeout(() => {
              comment_.style.backgroundColor = "#fff";
            }, 5000);
            setComment("");
          }
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setCommentError("");
          setCommentMessage(response.data.message);
          setComment("");
        }
        setCommentLoading(false);
      })
      .catch((err) => {
        setCommentError(err.message);
        setCommentLoading(false);
      });
  };

  const deleteComment = () => {
    setDeleteCommentLoading(true);
    axios
      .put(
        `${process.env.REACT_APP_API_HOST}/recipes/delete_comment`,
        { r_comment_id: commentId },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.data.err) {
          setDeleteCommentMessage("");
          setDeleteCommentError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setDeleteCommentError("");
          setDeleteCommentMessage(response.data.message);
          setComments((comments) =>
            comments.filter((comment) => {
              return comment.r_comment_id !== commentId;
            })
          );
        }
        setCommentId("");
        setCommentContent("");
        setDeleteCommentLoading(false);
      })
      .catch((err) => {
        setDeleteCommentMessage("");
        setDeleteCommentError(err.message);
        setCommentId("");
        setCommentContent("");
        setDeleteCommentLoading(false);
      });
  };

  const rateRecipe = (rating_by_user) => {
    axios
      .post(
        `${process.env.REACT_APP_API_HOST}/recipes/rate_recipe`,
        {
          r_id,
          rating: rating_by_user,
        },
        {
          headers: { "x-access-token": localStorage.getItem("token") },
        }
      )
      .then((response) => {
        if (response.data.err) {
          setRateMessage("");
          setRateError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setRateError("");
          setRateMessage(response.data.message);
          setRateByUser(rating_by_user);
          drawDefaultRating(rating_by_user);
          getRatingData();
        }
        setRateToastShow(true);
      })
      .catch((error) => {
        setRateMessage("");
        setRateError(error.message);
        setRateToastShow(true);
      });
  };

  const addFavoriteRecipe = () => {
    axios
      .post(
        `${process.env.REACT_APP_API_HOST}/recipes/favorite_recipes`,
        {
          r_id,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.data.err) {
          setFavoriteError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          if (response.data.updated || response.data.added) {
            const recipe_ = { ...recipe };
            if (recipe_.data.is_favorite) {
              recipe_.data.is_favorite = false;
            } else {
              recipe_.data.is_favorite = true;
            }
            setRecipe(recipe_);
          }
        }
      })
      .catch((error) => {
        setFavoriteError(error.message);
      });
  };

  const declineRecipe = () => {
    setDeclineLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API_HOST}/admin/decline_recipe`,
        {
          r_id: recipe.data.r_id,
          r_name: recipe.data.r_name,
          email: recipe.data.u_email,
          fName: recipe.data.u_f_name,
          lName: recipe.data.u_l_name,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.data.err) {
          setDeclineMessage("");
          setDeclineError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setDeclineError("");
          setDeclineMessage(response.data.message);
          setRecipe(() => {
            const recipe_ = { ...recipe };
            recipe_.data.r_accepted = 0;
            return recipe_;
          });
        }
        setDeclineLoading(false);
      })
      .catch((error) => {
        setDeclineMessage("");
        setDeclineError(error.message);
        setDeclineLoading(false);
      });
  };

  const acceptRecipe = () => {
    setAcceptLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API_HOST}/admin/accept_recipe`,
        {
          r_id: recipe.data.r_id,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.data.err) {
          setAcceptMessage("");
          setAcceptError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setAcceptError("");
          setAcceptMessage(response.data.message);
          setRecipe(() => {
            const recipe_ = { ...recipe };
            recipe_.data.r_accepted = 1;
            return recipe_;
          });
        }
        setAcceptLoading(false);
      })
      .catch((error) => {
        setAcceptMessage("");
        setAcceptError(error.message);
        setAcceptLoading(false);
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
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setDeleteCommentError("");
          setDeleteCommentMessage("");
          setCommentContent("");
          setCommentId("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {deleteCommentError
              ? "Error!"
              : deleteCommentMessage
              ? "Success"
              : "Are you sure want to delete this comment?"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteCommentError ? (
            <Alert variant="danger">{deleteCommentError}</Alert>
          ) : deleteCommentMessage ? (
            <Alert variant="success">{deleteCommentMessage}</Alert>
          ) : (
            <span style={{ wordWrap: "break-word" }}>{commentContent}</span>
          )}
        </Modal.Body>
        <Modal.Footer>
          {deleteCommentError || deleteCommentMessage ? (
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteCommentError("");
                setDeleteCommentMessage("");
              }}
            >
              OK
            </Button>
          ) : (
            <>
              <Button
                variant="info"
                onClick={deleteComment}
                disabled={deleteCommentLoading}
              >
                {deleteCommentLoading ? (
                  <i className="fa fa-spinner fa-spin" />
                ) : (
                  "Delete"
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCommentContent("");
                  setCommentId("");
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      <div className="rate-toast">
        <Collapse in={rateToastShow}>
          <div>
            <Toast
              onClose={() => setRateToastShow(false)}
              show={rateToastShow}
              delay={5000}
              autohide
            >
              <Toast.Header>
                {/* <img
                      src="holder.js/20x20?text=%20"
                      className="rounded mr-2"
                      alt=""
                    /> */}
                <strong className="mr-auto">
                  {rateError ? "Error!" : rateMessage ? "Success" : null}
                </strong>
              </Toast.Header>
              <Toast.Body>
                {rateError ? (
                  <Alert variant="danger">{rateError}</Alert>
                ) : rateMessage ? (
                  <Alert variant="success">{rateMessage}</Alert>
                ) : null}
              </Toast.Body>
            </Toast>
          </div>
        </Collapse>
      </div>

      <Modal
        show={showDeclineModal}
        onHide={() => {
          setShowDeclineModal(false);
          setDeclineError("");
          setDeclineMessage("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {declineError
              ? "Error!"
              : declineMessage
              ? "Success"
              : "Are you sure want to decline this recipe?"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {declineError ? (
            <Alert variant="danger">{declineError}</Alert>
          ) : declineMessage ? (
            <Alert variant="success">{declineMessage}</Alert>
          ) : (
            <span
              style={{
                wordWrap: "break-word",
                fontSize: "25px",
                color: "#808080",
              }}
            >
              {recipe && recipe.data.r_name}
            </span>
          )}
        </Modal.Body>
        <Modal.Footer>
          {declineError || declineMessage ? (
            <Button
              variant="secondary"
              onClick={() => {
                setShowDeclineModal(false);
                setDeclineError("");
                setDeclineMessage("");
              }}
            >
              OK
            </Button>
          ) : (
            <>
              <Button
                variant="danger"
                onClick={declineRecipe}
                disabled={declineLoading}
              >
                {declineLoading ? (
                  <i className="fa fa-spinner fa-spin" />
                ) : (
                  "Decline"
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDeclineModal(false);
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      <Modal
        show={showAcceptModal}
        onHide={() => {
          setShowAcceptModal(false);
          setAcceptError("");
          setAcceptMessage("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {acceptError
              ? "Error!"
              : acceptMessage
              ? "Success"
              : "Are you sure want to accept this recipe?"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {acceptError ? (
            <Alert variant="danger">{acceptError}</Alert>
          ) : acceptMessage ? (
            <Alert variant="success">{acceptMessage}</Alert>
          ) : (
            <span
              style={{
                wordWrap: "break-word",
                fontSize: "25px",
                color: "#808080",
              }}
            >
              {recipe && recipe.data.r_name}
            </span>
          )}
        </Modal.Body>
        <Modal.Footer>
          {acceptError || acceptMessage ? (
            <Button
              variant="secondary"
              onClick={() => {
                setShowAcceptModal(false);
                setAcceptError("");
                setAcceptMessage("");
              }}
            >
              OK
            </Button>
          ) : (
            <>
              <Button
                variant="success"
                onClick={acceptRecipe}
                disabled={acceptLoading}
              >
                {acceptLoading ? (
                  <i className="fa fa-spinner fa-spin" />
                ) : (
                  "Accept"
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowAcceptModal(false);
                }}
              >
                Cancel
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

      {loading ? (
        <h3 style={{ margin: "20px", textAlign: "center" }}>
          <i className="fa fa-spinner fa-spin" />
        </h3>
      ) : error ? (
        <h4 style={{ margin: "20px", textAlign: "center" }}>{error}</h4>
      ) : (
        <>
          <div className="recipe-page">
            {user && user.u_is_admin === 1 && recipe.data.r_accepted === 1 && (
              <Alert
                style={{
                  position: "sticky",
                  top: "20px",
                  zIndex: "1",
                  opacity: "0.9",
                }}
                variant="success"
              >
                This recipe is accepted!{" "}
                <Button
                  onClick={() => setShowDeclineModal(true)}
                  variant="danger"
                >
                  Decline
                </Button>
              </Alert>
            )}
            {user && user.u_is_admin === 1 && recipe.data.r_accepted === 0 && (
              <Alert
                style={{
                  position: "sticky",
                  top: "20px",
                  zIndex: "1",
                  opacity: "0.9",
                }}
                variant="danger"
              >
                This recipe was declined!{" "}
                <Button
                  onClick={() => setShowAcceptModal(true)}
                  variant="success"
                >
                  Accept
                </Button>
              </Alert>
            )}
            {user && user.u_is_admin === 1 && recipe.data.r_accepted === -1 && (
              <Alert
                style={{
                  position: "sticky",
                  top: "20px",
                  zIndex: "1",
                  opacity: "0.9",
                }}
                variant="warning"
              >
                This recipe is pending...{" "}
                <div
                  style={{
                    whiteSpace: "nowrap",
                    display: "inline-block",
                    marginTop: "10px",
                  }}
                >
                  <Button
                    onClick={() => setShowAcceptModal(true)}
                    variant="success"
                    style={{ margin: "0 10px" }}
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => setShowDeclineModal(true)}
                    variant="danger"
                    style={{ margin: "0 10px" }}
                  >
                    Decline
                  </Button>
                </div>
              </Alert>
            )}
            <h1>{recipe.data.r_name}</h1>
            <span
              style={{
                marginBottom: "20px",
                color: "rgb(145, 145, 145)",
                fontSize: "13px",
                borderLeft: "2px solid #7db1b5",
                paddingLeft: "3px",
              }}
            >
              {recipe.data.r_cat_name}
            </span>
            <div className="rating">
              <span style={{ marginRight: "10px" }}>
                {ratingDataLoading ? (
                  <i className="fa fa-spinner fa-spin" />
                ) : ratingDataError ? (
                  <Alert variant="danger">{ratingDataError}</Alert>
                ) : (
                  <span>
                    {Math.round(overallRating * 10) / 10 === 0 ? (
                      "There is no rating yet."
                    ) : (
                      <span>
                        Overall rating of <i>{ratingsCount}</i> is{" "}
                        {rating.map((star) => {
                          return star;
                        })}
                      </span>
                    )}
                  </span>
                )}
              </span>
              <span>
                {user ? (
                  <span>
                    Your rating:{" "}
                    {rateByUser === 0 && <i>(Please rate this recipe) </i>}
                    <span
                      style={{
                        whiteSpace: "pre",
                        fontFamily: "'Brush Script MT', monospace",
                      }}
                      onMouseLeave={() => drawDefaultRating()}
                    >
                      {ratingStars.map((star) => {
                        return star;
                      })}
                    </span>
                  </span>
                ) : (
                  <Alert
                    variant="secondary"
                    style={{
                      padding: "5px",
                      fontSize: "12px",
                      margin: "0",
                    }}
                  >
                    If you want to rate please login!{" "}
                    <Link
                      style={{ color: "#0373fc" }}
                      to={{
                        pathname: "/login",
                        state: { prevPath: location.pathname },
                      }}
                    >
                      Click here to login!
                    </Link>
                  </Alert>
                )}
              </span>
            </div>
            {user && (
              <div
                style={{
                  marginBottom: "20px",
                }}
              >
                {recipe.data.is_favorite ? (
                  <div
                    style={{
                      color: "#636363",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ marginRight: "5px", width: "143px" }}>
                      Remove from favorites:
                    </span>
                    <i
                      onClick={addFavoriteRecipe}
                      className="fas fa-heart favorite"
                    />
                  </div>
                ) : (
                  <span
                    style={{
                      color: "#636363",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ marginRight: "5px", width: "143px" }}>
                      Add to favorites:
                    </span>
                    <i
                      onClick={addFavoriteRecipe}
                      className="far fa-heart favorite not-favorite"
                    />
                  </span>
                )}
                <Collapse in={favoriteError}>
                  <div>
                    <Toast
                      onClose={() => setFavoriteError("")}
                      show={favoriteError}
                      delay={5000}
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
                        <Alert variant="danger">{favoriteError}</Alert>
                      </Toast.Body>
                    </Toast>
                  </div>
                </Collapse>
              </div>
            )}
            <div>
              <div className="monogram">{recipe.data.u_monogram}</div>
              By{" "}
              <span style={{ color: "#528387" }}>
                {recipe.data.u_f_name} {recipe.data.u_l_name}
              </span>
            </div>
            <span
              style={{
                fontSize: "13px",
                marginBottom: "20px",
                color: "rgb(145, 145, 145)",
              }}
            >
              Posted at {moment(recipe.data.r_created_at).calendar()}
            </span>
            <div className="recipe-body">
              <div className="recipe-image">
                <Image
                  src={
                    recipe.data.r_pic
                      ? `data:image/png;base64,${recipe.data.r_pic}`
                      : defaultRecipe
                  }
                  alt={`${r_id}`}
                  width="100%"
                  rounded
                />
              </div>

              <div className="recipe-description">
                <pre>
                  <code>{recipe.data.r_description}</code>
                </pre>
              </div>
            </div>

            <div>
              <hr className="center-diamond" />
            </div>

            <div className="recipe-ingredients">
              <h3 style={{ marginBottom: "40px" }}>Ingredients</h3>
              <ul type="circle">
                {recipe.ingredients.map((ingredient) => {
                  return (
                    <li key={ingredient.g_id}>
                      {ingredient.g_name}, {ingredient.g_quantity}{" "}
                      {ingredient.g_quantity_type}{" "}
                      <span style={{ fontSize: "15px", color: "#424242" }}>
                        ({Math.round(ingredient.i_price * 100) / 100} €)
                      </span>
                    </li>
                  );
                })}
              </ul>
              <h4 style={{ marginTop: "25px" }}>
                <Badge variant="info">
                  Price: {Math.round(recipe.data.price * 100) / 100} €
                </Badge>
              </h4>
            </div>

            <div>
              <hr className="center-ball" />
            </div>

            <h5 style={{ marginBottom: "20px" }}>
              Comments ({comments.length})
            </h5>
            {user ? (
              <InputGroup style={{ marginBottom: "20px" }}>
                <FormControl
                  as="textarea"
                  rows="3"
                  placeholder="Write your comment here..."
                  aria-label="Write comment"
                  aria-describedby="basic-addon"
                  onChange={(event) => setComment(event.target.value)}
                  value={comment}
                />
                <InputGroup.Append>
                  <Button
                    onClick={addComment}
                    variant="outline-info"
                    disabled={commentLoading}
                  >
                    {commentLoading ? (
                      <i className="fa fa-spinner fa-spin" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            ) : (
              <Alert variant="secondary">
                If you want comment please login!{" "}
                <Link
                  style={{ color: "#0373fc" }}
                  to={{
                    pathname: "/login",
                    state: { prevPath: location.pathname },
                  }}
                >
                  Click here to login!
                </Link>
              </Alert>
            )}

            <Collapse in={commentError || commentMessage}>
              <div>
                <Toast
                  onClose={() => {
                    setCommentError("");
                    setCommentMessage("");
                  }}
                  show={commentError || commentMessage}
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
                    <strong className="mr-auto">
                      {commentError
                        ? "Error!"
                        : commentMessage
                        ? "Success"
                        : null}
                    </strong>
                  </Toast.Header>
                  <Toast.Body>
                    {commentError ? (
                      <Alert variant="danger">{commentError}</Alert>
                    ) : commentMessage ? (
                      <Alert variant="success">{commentMessage}</Alert>
                    ) : null}
                  </Toast.Body>
                </Toast>
              </div>
            </Collapse>

            <div className="recipe-comments">
              {!comments.length ? (
                <span>There is no comment!</span>
              ) : (
                <TransitionGroup>
                  {comments.map((comment) => {
                    return (
                      <CSSTransition
                        key={comment.r_comment_id}
                        timeout={500}
                        classNames="item"
                      >
                        <Card id={comment.r_comment_id} className="comment">
                          <Card.Header style={{ position: "relative" }}>
                            <div className="monogram small-monogram">
                              {comment.u_monogram}
                            </div>
                            <span
                              style={{ fontSize: "15px", fontStyle: "italic" }}
                            >
                              <span
                                style={
                                  user.u_id === comment.u_id
                                    ? { color: "#516bc9" }
                                    : { color: "#000" }
                                }
                              >
                                {comment.u_f_name} {comment.u_l_name}
                              </span>
                            </span>
                            {user.u_id === comment.u_id && (
                              <abbr title="Delete comment">
                                <i
                                  className="fas fa-trash-alt delete"
                                  onClick={() => {
                                    setCommentId(comment.r_comment_id);
                                    setCommentContent(comment.r_comment);
                                    setShowDeleteModal(true);
                                  }}
                                />
                              </abbr>
                            )}
                          </Card.Header>
                          <Card.Body>
                            <Card.Text>
                              <span
                                style={{
                                  wordBreak: "break-all",
                                }}
                              >
                                {comment.r_comment}
                              </span>
                            </Card.Text>
                          </Card.Body>
                          <Card.Footer
                            style={{
                              fontStyle: "italic",
                              fontSize: "13px",
                              padding: "5px 5px 5px 30px",
                            }}
                            className="text-muted"
                          >
                            Posted at{" "}
                            {moment(comment.r_comment_created_at).calendar()}
                          </Card.Footer>
                        </Card>
                      </CSSTransition>
                    );
                  })}
                </TransitionGroup>
              )}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
