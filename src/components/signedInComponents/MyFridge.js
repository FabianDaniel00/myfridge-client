/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import "../../style/RecipeCards.scss";
import "../../style/MyFridge.scss";
import "../../style/AddRecipe.scss";
import axios from "axios";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  CardDeck,
  Card,
  ListGroup,
  ListGroupItem,
  Pagination,
  Image,
  Button,
  FormControl,
  Modal,
} from "react-bootstrap";
import { motion } from "framer-motion";
import moment from "moment";
import defaultRecipe from "../../img/recipe_default.png";

export default function MyFridge({ pageTransitions }) {
  const redirect = useHistory();

  const { page, ingredients } = useParams();

  const [recipes, setRecipes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState([]);
  const [ratings, setRatings] = useState("");
  const [containGroceries, setContainGroceries] = useState([]);
  const [notContainGroceries, setNotContainGroceries] = useState([]);
  const [groceries, setGroceries] = useState([]);
  const [groceriesLoading, setGroceriesLoading] = useState(false);
  const [groceriesError, setGroceriesError] = useState("");
  const [groceryInput, setGroceryInput] = useState("");
  const [warningToastShow, setWarningToastShow] = useState(false);

  const getRecipes = (page_ = page, ingredients_ = ingredients) => {
    if (page_ && ingredients_) {
      setLoading(true);
      axios
        .get(
          `http://localhost:8080/recipes/r/r/my_fridge/${page_}/${ingredients_}`,
          {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          if (response.data.err) {
            setError(response.data.err);
          } else {
            if (response.data.newToken) {
              localStorage.setItem("token", response.data.newToken);
            }
            setRecipes(response.data.recipes);
            const pageCount = Math.ceil(response.data.recipesCount / 10);
            setPagination([]);
            for (let i = 1; i <= pageCount; i++) {
              setPagination((pagination) => [
                ...pagination,
                <Pagination.Item
                  onClick={() => {
                    redirect.push(`/my_fridge/${i}/${ingredients_}`);
                  }}
                  key={i}
                  active={i === parseInt(page_)}
                >
                  {i}
                </Pagination.Item>,
              ]);
            }
            const ratings_ = [];
            const recipesCount = response.data.recipes.length;
            for (let i = 0; i < recipesCount; i++) {
              const recipeRating =
                Math.round(response.data.recipes[i].rating * 10) / 10;
              ratings_.push([recipeRating + " "]);
              let halfStar = true;
              for (let j = 0; j < 5; j++) {
                if (j < Math.floor(recipeRating)) {
                  ratings_[i].push(
                    <i
                      key={`${i}${j}`}
                      style={{ color: "#d54215" }}
                      className="fa fa-star"
                    />
                  );
                } else if (
                  recipeRating - Math.floor(recipeRating) >= 0.3 &&
                  recipeRating - Math.floor(recipeRating) <= 0.7 &&
                  halfStar
                ) {
                  ratings_[i].push(
                    <i
                      key={`${i}${j}`}
                      style={{ color: "#d54215" }}
                      className="fas fa-star-half-alt"
                    />
                  );
                  halfStar = false;
                } else if (recipeRating) {
                  ratings_[i].push(
                    <i
                      key={`${i}${j}`}
                      style={{ color: "#d54215" }}
                      className="far fa-star"
                    />
                  );
                }
              }
            }
            setRatings(ratings_);
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    setTimeout(imageSizes, 300);
  }, [loading]);

  useEffect(() => {
    getRecipes();
    getGroceries();
  }, []);

  const getGroceries = () => {
    if (ingredients) {
      axios
        .get(`http://localhost:8080/recipes/r/r/get_groceries/${ingredients}`, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          if (response.data.err) {
            setError(response.data.err);
          } else {
            if (response.data.newToken) {
              localStorage.setItem("token", response.data.newToken);
            }
            setContainGroceries(response.data.containGroceries);
            setNotContainGroceries(response.data.notContainGroceries);
          }
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  };

  const searchRecipes = () => {
    let ingredients_ = "";

    for (const containGrocery of containGroceries) {
      ingredients_ += containGrocery.g_id + "-";
    }

    for (const notContainGrocery of notContainGroceries) {
      ingredients_ += "!" + notContainGrocery.g_id + "-";
    }

    window.history.replaceState(
      null,
      "myFridge.com",
      `/my_fridge/1/${ingredients_.slice(0, ingredients_.length - 1)}`
    );

    getRecipes(1, ingredients_.slice(0, ingredients_.length - 1));
  };

  const imageSizes = () => {
    const cardImages = document.getElementsByClassName("card-image");
    const length = cardImages.length;
    for (let i = 0; i < length; i++) {
      const width = cardImages[i].getBoundingClientRect().width;
      cardImages[i].style.height = Math.round(width / 1.59) + "px";
    }
  };

  window.addEventListener("resize", imageSizes);

  const searchGroceries = (input) => {
    setGroceries([]);
    if (input.length > 1) {
      setGroceriesLoading(true);
      axios
        .get(`http://localhost:8080/recipes/r/r/search_groceries/${input}`, {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((response) => {
          if (response.data.err) {
            setGroceriesError(response.data.err);
          } else {
            if (response.data.newToken) {
              localStorage.setItem("token", response.data.newToken);
            }
            setGroceries(response.data.result);
          }
          setGroceriesLoading(false);
        })
        .catch((error) => {
          setGroceriesError(error.message);
          setGroceriesLoading(false);
        });
    }
  };

  const addContainGrocery = (grocery) => {
    let contain = false;
    for (const containGrocery of containGroceries) {
      if (containGrocery.g_id === grocery.g_id) {
        contain = true;
        break;
      }
    }
    for (const notContainGrocery of notContainGroceries) {
      if (notContainGrocery.g_id === grocery.g_id) {
        contain = true;
        break;
      }
    }
    if (!contain) {
      setContainGroceries((containGroceries) => [...containGroceries, grocery]);
    } else {
      setWarningToastShow(true);
    }
  };

  const addNotContainGrocery = (grocery) => {
    let contain = false;
    for (const notContainGrocery of notContainGroceries) {
      if (notContainGrocery.g_id === grocery.g_id) {
        contain = true;
        break;
      }
    }
    for (const containGrocery of containGroceries) {
      if (containGrocery.g_id === grocery.g_id) {
        contain = true;
        break;
      }
    }
    if (!contain) {
      setNotContainGroceries((notContainGroceries) => [
        ...notContainGroceries,
        grocery,
      ]);
    } else {
      setWarningToastShow(true);
    }
  };

  const deleteContainGrocery = (g_id) => {
    setContainGroceries((containGroceries) =>
      containGroceries.filter((containGrocery) => {
        return containGrocery.g_id !== g_id;
      })
    );
  };

  const deleteNotContainGrocery = (g_id) => {
    setNotContainGroceries((containNotGroceries) =>
      containNotGroceries.filter((notContainGrocery) => {
        return notContainGrocery.g_id !== g_id;
      })
    );
  };

  return (
    <motion.div
      initial="out"
      animate="in"
      exit="out"
      variants={pageTransitions.pageVariants}
      transition={pageTransitions.pageTransition}
    >
      <motion.div>
        <Modal
          show={warningToastShow}
          onHide={() => setWarningToastShow(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Warning!</Modal.Title>
          </Modal.Header>
          <Modal.Body>This grocery is already added.</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setWarningToastShow(false)}
            >
              OK
            </Button>
          </Modal.Footer>
        </Modal>

        <h1
          style={{
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          MyFridge
        </h1>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="groceries">
            <h6>Search for groceries</h6>
            <div style={{ display: "flex" }}>
              <FormControl
                type="text"
                placeholder="min 2 letters..."
                className="mr-sm-2"
                size="sm"
                onChange={(event) => {
                  searchGroceries(event.target.value);
                  setGroceryInput(event.target.value);
                }}
                value={groceryInput}
                style={{ width: "200px" }}
              />
            </div>
            <div className="groceries-list">
              {groceriesLoading ? (
                <div style={{ width: "430px", textAlign: "center" }}>
                  <i className="fa fa-spinner fa-spin" />
                </div>
              ) : groceriesError ? (
                <span>{groceriesError}</span>
              ) : groceries.length ? (
                <>
                  {groceries.map((grocery) => {
                    return (
                      <div
                        key={grocery.g_id}
                        className="grocery select-grocery"
                        style={{ cursor: "default" }}
                      >
                        <Image
                          src={`data:image/png;base64,${grocery.g_img}`}
                          alt={`${grocery.g_id}`}
                          width="100%"
                          rounded
                        />
                        <span style={{ color: "#808080", fontSize: "12px" }}>
                          {grocery.g_name}
                        </span>
                        <br />
                        <span
                          style={{
                            color: "#bfbfbf",
                            fontSize: "10px",
                            lineHeight: "12px",
                            display: "inline-block",
                          }}
                        >
                          {grocery.g_cat_name}
                        </span>
                        <abbr
                          title="Click to add to not contain this grocery"
                          className="to-contain"
                        >
                          <i
                            className="fas fa-minus"
                            onClick={() => addNotContainGrocery(grocery)}
                          />
                        </abbr>
                        <abbr
                          title="Click to add to contain this grocery"
                          className="to-not-contain"
                        >
                          <i
                            className="fas fa-plus"
                            onClick={() => addContainGrocery(grocery)}
                          />
                        </abbr>
                      </div>
                    );
                  })}
                  <div className="groceries-placeholder"></div>
                  <div className="groceries-placeholder"></div>
                  <div className="groceries-placeholder"></div>
                  <div className="groceries-placeholder"></div>
                </>
              ) : (
                groceryInput.length > 1 && (
                  <span style={{ width: "430px" }}>
                    There is no found grocery!
                  </span>
                )
              )}
            </div>
          </div>
          <div className="fridge">
            <div className="contain-container">
              {!containGroceries.length && !notContainGroceries.length && (
                <label>Select at least 1 ingredient.</label>
              )}
              {containGroceries.length ? (
                <>
                  <label>Include Groceries:</label>
                  <TransitionGroup
                    className="groceries-list"
                    style={{ margin: "0" }}
                  >
                    {containGroceries.map((containGrocery) => {
                      return (
                        <CSSTransition
                          key={containGrocery.g_id}
                          timeout={500}
                          classNames="item"
                          className="grocery added-grocery contain"
                        >
                          <div style={{ borderRadius: "8px" }}>
                            <i
                              className="fas fa-times-circle x"
                              onClick={() => {
                                deleteContainGrocery(containGrocery.g_id);
                              }}
                            />
                            <Image
                              src={`data:image/png;base64,${containGrocery.g_img}`}
                              alt={`${containGrocery.g_id}`}
                              width="100%"
                              rounded
                            />
                            <span
                              style={{
                                color: "#808080",
                                fontSize: "12px",
                                wordWrap: "break-word",
                              }}
                            >
                              {containGrocery.g_name}
                            </span>
                          </div>
                        </CSSTransition>
                      );
                    })}
                    <div className="groceries-placeholder added"></div>
                    <div className="groceries-placeholder added"></div>
                    <div className="groceries-placeholder added"></div>
                    <div className="groceries-placeholder added"></div>
                  </TransitionGroup>
                </>
              ) : null}
            </div>
            <div className="not-contain-container">
              {notContainGroceries.length ? (
                <>
                  <label>Not Include Groceries:</label>
                  <TransitionGroup
                    className="groceries-list"
                    style={{ margin: "0" }}
                  >
                    {notContainGroceries.map((notContainGrocery) => {
                      return (
                        <CSSTransition
                          key={notContainGrocery.g_id}
                          timeout={500}
                          classNames="item"
                          className="grocery added-grocery not-contain"
                        >
                          <div style={{ borderRadius: "8px" }}>
                            <i
                              className="fas fa-times-circle x"
                              onClick={() => {
                                deleteNotContainGrocery(notContainGrocery.g_id);
                              }}
                            />
                            <Image
                              src={`data:image/png;base64,${notContainGrocery.g_img}`}
                              alt={`${notContainGrocery.g_id}`}
                              width="100%"
                              rounded
                            />
                            <span
                              style={{
                                color: "#808080",
                                fontSize: "12px",
                                wordWrap: "break-word",
                              }}
                            >
                              {notContainGrocery.g_name}
                            </span>
                          </div>
                        </CSSTransition>
                      );
                    })}
                    <div className="groceries-placeholder added"></div>
                    <div className="groceries-placeholder added"></div>
                    <div className="groceries-placeholder added"></div>
                    <div className="groceries-placeholder added"></div>
                  </TransitionGroup>
                </>
              ) : null}
            </div>
          </div>
          <Button
            onClick={searchRecipes}
            style={{ margin: "30px" }}
            variant="outline-info"
          >
            Let's Go!
          </Button>
        </div>

        {loading ? (
          <h3 style={{ margin: "20px", textAlign: "center" }}>
            <i className="fa fa-spinner fa-spin" />
          </h3>
        ) : error ? (
          <h4 style={{ margin: "20px", textAlign: "center" }}>{error}</h4>
        ) : (
          <>
            {recipes.length ? (
              <>
                <h3>Found recipes</h3>
                <CardDeck style={{ margin: "0", justifyContent: "center" }}>
                  {recipes &&
                    recipes.map((recipe, index) => {
                      return (
                        <Card
                          key={recipe.recipe_id}
                          style={{
                            marginBottom: "20px",
                          }}
                          className="recipe-card"
                        >
                          <Link
                            className="recipe-link"
                            to={`/recipe/${recipe.recipe_id}`}
                          >
                            <Card.Img
                              variant="top"
                              src={
                                recipe.r_pic
                                  ? `data:image/png;base64,${recipe.r_pic}`
                                  : defaultRecipe
                              }
                              alt={recipe.recipe_id}
                              className="card-image"
                            />
                            <Card.Body>
                              <Card.Title>{recipe.r_name}</Card.Title>
                              <Card.Text>
                                {recipe.r_description.length > 100 ? (
                                  <>
                                    <span>
                                      {recipe.r_description.substring(0, 100)}
                                    </span>
                                    <span style={{ color: "#999" }}>...</span>
                                  </>
                                ) : (
                                  recipe.r_description
                                )}
                              </Card.Text>
                            </Card.Body>
                            <ListGroup className="list-group-flush">
                              <ListGroupItem>
                                Price: {Math.round(recipe.price * 100) / 100} €
                              </ListGroupItem>
                              <ListGroupItem>{recipe.r_cat_name}</ListGroupItem>
                              <ListGroupItem>
                                {recipe.u_f_name} {recipe.u_l_name}
                              </ListGroupItem>
                              <ListGroupItem style={{ fontSize: "14px" }}>
                                {Math.round(recipe.rating * 10) / 10 === 0 ? (
                                  "There is no rating yet."
                                ) : (
                                  <span>
                                    Overall rating of{" "}
                                    <i>{recipe.ratings_count}</i> is{" "}
                                    {ratings[index].map((star) => {
                                      return star;
                                    })}
                                  </span>
                                )}
                              </ListGroupItem>
                            </ListGroup>
                            <Card.Footer
                              style={{
                                bottom: "0",
                                position: "absolute",
                                width: "100%",
                              }}
                            >
                              <small className="text-muted">
                                Posted at{" "}
                                {moment(recipe.r_created_at).calendar()}
                              </small>
                            </Card.Footer>
                          </Link>
                        </Card>
                      );
                    })}
                  <div
                    style={{ minWidth: "300px", flex: "1 0", margin: "0 15px" }}
                  ></div>
                  <div
                    style={{ minWidth: "300px", flex: "1 0", margin: "0 15px" }}
                  ></div>
                  <div
                    style={{ minWidth: "300px", flex: "1 0", margin: "0 15px" }}
                  ></div>
                  <div
                    style={{ minWidth: "300px", flex: "1 0", margin: "0 15px" }}
                  ></div>
                </CardDeck>
                <Pagination style={{ justifyContent: "center" }}>
                  <Pagination.First
                    onClick={() => {
                      redirect.push(`/my_fridge/1/${ingredients}`);
                    }}
                  />
                  <Pagination.Prev
                    onClick={() => {
                      if (parseInt(page) > 1) {
                        redirect.push(
                          `/my_fridge/${parseInt(page) - 1}/${ingredients}`
                        );
                      }
                    }}
                  />
                  {pagination}
                  <Pagination.Next
                    onClick={() => {
                      if (parseInt(page) < pagination.length) {
                        redirect.push(
                          `/my_fridge/${parseInt(page) + 1}/${ingredients}`
                        );
                      }
                    }}
                  />
                  <Pagination.Last
                    onClick={() => {
                      redirect.push(
                        `/my_fridge/${pagination.length}/${ingredients}`
                      );
                    }}
                  />
                </Pagination>
              </>
            ) : null}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
