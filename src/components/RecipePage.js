import { useParams, Link } from "react-router-dom";
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
  const [editCommentLoading, setEditCommentLoading] = useState(false);
  const [editCommentError, setEditCommentError] = useState("");
  const [editCommentMessage, setEditCommentMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
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

  const { user } = useContext(userContext);

  const { r_id } = useParams();

  useEffect(() => {
    getRecipe();
    getRatingData();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRecipe = () => {
    axios
      .get(`http://localhost:8080/recipes/r/r/recipe/${r_id}`)
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
      .get(`http://localhost:8080/recipes/r/r/rating_data/${r_id}`)
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
        "http://localhost:8080/recipes/add_comment",
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
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setCommentError("");
          setCommentMessage(response.data.message);
          setComments((comments) => [
            {
              u_id: user.u_id,
              r_comment_id,
              r_comment: comment,
              u_f_name: user.u_f_name,
              u_l_name: user.u_l_name,
              u_monogram: user.u_monogram,
              r_comment_created_at: moment(new Date()).format(
                "YYYY-MM-DD HH:mm:ss"
              ),
            },
            ...comments,
          ]);
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
        "http://localhost:8080/recipes/delete_comment",
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

  const editComment = () => {
    setEditCommentLoading(true);
    axios
      .put(
        "http://localhost:8080/recipes/edit_comment",
        { r_comment_id: commentId, r_comment: commentContent },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.data.err) {
          setEditCommentMessage("");
          setEditCommentError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setEditCommentError("");
          setEditCommentMessage(response.data.message);
          const comments_ = [];
          for (const comment of comments) {
            if (comment.r_comment_id === commentId) {
              comment.r_comment = commentContent;
              comment.r_comment_modified_at = new Date().toISOString();
              comments_.push(comment);
            } else {
              comments_.push(comment);
            }
          }
          setComments(comments_);
        }
        setCommentId("");
        setCommentContent("");
        setEditCommentLoading(false);
      })
      .catch((err) => {
        setEditCommentMessage("");
        setEditCommentError(err.message);
        setCommentId("");
        setCommentContent("");
        setEditCommentLoading(false);
      });
  };

  const rateRecipe = (rating_by_user) => {
    axios
      .post(
        "http://localhost:8080/recipes/rate_recipe",
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
        "http://localhost:8080/recipes/favorite_recipes",
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

      <Modal
        show={showEditModal}
        onHide={() => {
          setShowEditModal(false);
          setEditCommentError("");
          setEditCommentMessage("");
          setCommentContent("");
          setCommentId("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {editCommentError
              ? "Error!"
              : editCommentMessage
              ? "Success"
              : "Update comment"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editCommentError ? (
            <Alert variant="danger">{editCommentError}</Alert>
          ) : editCommentMessage ? (
            <Alert variant="success">{editCommentMessage}</Alert>
          ) : (
            <FormControl
              as="textarea"
              rows="3"
              placeholder="Write your comment here..."
              aria-label="Write comment"
              aria-describedby="basic-addon"
              onChange={(event) => setCommentContent(event.target.value)}
              value={commentContent}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          {editCommentError || editCommentMessage ? (
            <Button
              variant="secondary"
              onClick={() => {
                setShowEditModal(false);
                setEditCommentError("");
                setEditCommentMessage("");
              }}
            >
              OK
            </Button>
          ) : (
            <>
              <Button
                variant="info"
                onClick={editComment}
                disabled={editCommentLoading}
              >
                {editCommentLoading ? (
                  <i className="fa fa-spinner fa-spin" />
                ) : (
                  "Update"
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowEditModal(false);
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

      {loading ? (
        <h3 style={{ margin: "20px", textAlign: "center" }}>
          <i className="fa fa-spinner fa-spin" />
        </h3>
      ) : error ? (
        <h4 style={{ margin: "20px", textAlign: "center" }}>{error}</h4>
      ) : (
        <>
          <div className="recipe-page">
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
                    <Link style={{ color: "#0373fc" }} to="/login">
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
                  <span
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
                  </span>
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
                        ({Math.round(ingredient.i_price * 10) / 10} €)
                      </span>
                    </li>
                  );
                })}
              </ul>
              <h4 style={{ marginTop: "25px" }}>
                <Badge variant="info">
                  Price: {Math.round(recipe.data.price * 10) / 10} €
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
                <Link style={{ color: "#0373fc" }} to="/login">
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
                        <Card className="comment">
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
                              <>
                                <abbr title="Edit comment">
                                  <i
                                    className="fas fa-pen edit"
                                    onClick={() => {
                                      setCommentId(comment.r_comment_id);
                                      setCommentContent(comment.r_comment);
                                      setShowEditModal(true);
                                    }}
                                  />
                                </abbr>
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
                              </>
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
                            {comment.r_comment_created_at <
                            comment.r_comment_modified_at
                              ? "Modified at " +
                                moment(comment.r_modified_created_at).calendar()
                              : "Posted at " +
                                moment(comment.r_comment_created_at).calendar()}
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
