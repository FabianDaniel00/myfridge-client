import { motion } from "framer-motion";
import { Tab, Tabs, CardGroup, Card, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "../../style/Menu.scss";
import defaultRecipe from "../../img/recipe_default.png";

export default function Menu({ pageTransitions }) {
  const [tabKey, setTabKey] = useState(new Date().getDay());
  const [recipes, setRecipes] = useState([]);
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [recipesError, setRecipesError] = useState("");
  const [removeError, setRemoveError] = useState("");
  const [removeLoading, setRemoveLoading] = useState(false);

  useEffect(() => {
    getRecipes();
  }, []);

  const getRecipes = () => {
    axios
      .get("http://localhost:8080/recipes/r/r/r/get_menu", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.data.err) {
          setRecipesError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setRecipes(response.data.recipes);
        }
        setRecipesLoading(false);
      })
      .catch((error) => {
        setRecipesError(error.message);
        setRecipesLoading(false);
      });
  };

  const removeFromWeeklyMenu = (r_id, day) => {
    if (!removeLoading) {
      setRemoveLoading(true);
      axios
        .post(
          "http://localhost:8080/recipes/remove_from_weekly_menu",
          {
            r_id,
            day,
          },
          {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          if (response.data.err) {
            setRemoveError(response.data.err);
          } else {
            if (response.data.newToken) {
              localStorage.setItem("token", response.data.newToken);
            }
            if (response.data.removed) {
              setRecipes(
                recipes.filter(
                  (recipe) => recipe.r_id !== r_id || recipe.day !== day
                )
              );
            }
          }
          setRemoveLoading(false);
        })
        .catch((error) => {
          setRemoveError(error.message);
          setRemoveLoading(false);
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
      <Modal show={removeError} onHide={() => setRemoveError("")}>
        <Modal.Header closeButton>
          <Modal.Title>Error!</Modal.Title>
        </Modal.Header>
        <Modal.Body>{removeError}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setRemoveError("")}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      <h4 style={{ margin: "20px" }}>Weekly Menu</h4>
      <Tabs
        style={{ margin: "0 10px" }}
        activeKey={tabKey}
        onSelect={(k) => setTabKey(k)}
      >
        <Tab className="week-tab" eventKey="1" title="Monday">
          <CardGroup style={{ marginTop: "10px", maxWidth: "1000px" }}>
            {recipesLoading ? (
              <i style={{ margin: "20px" }} className="fa fa-spinner fa-spin" />
            ) : recipesError ? (
              <span style={{ margin: "20px" }}>{recipesError}</span>
            ) : recipes.length ? (
              recipes.filter((recipe) => parseInt(recipe.day) === 1).length ? (
                <TransitionGroup style={{ display: "flex", flexWrap: "wrap" }}>
                  {recipes
                    .filter((recipe) => parseInt(recipe.day) === 1)
                    .map((recipe, index) => {
                      return (
                        <CSSTransition
                          key={index}
                          timeout={500}
                          classNames="item"
                          className="recipe-day"
                        >
                          <Card>
                            <abbr
                              title="Click here to remove from weekly menu"
                              className="remove-recipe"
                              onClick={() =>
                                removeFromWeeklyMenu(recipe.r_id, recipe.day)
                              }
                            >
                              <i className="fas fa-minus-circle" />
                            </abbr>
                            <Link
                              className="recipe-day-link"
                              to={`/recipe/${recipe.r_id}`}
                            >
                              <Card.Img
                                variant="top"
                                src={
                                  recipe.r_pic
                                    ? `data:image/png;base64,${recipe.r_pic}`
                                    : defaultRecipe
                                }
                                alt={`${recipe.r_id}`}
                                width="100%"
                              />
                              <Card.Body>
                                <Card.Title>{recipe.r_name}</Card.Title>
                                <small className="text-muted">
                                  {recipe.r_cat_name}
                                </small>
                              </Card.Body>
                            </Link>
                          </Card>
                        </CSSTransition>
                      );
                    })}
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                </TransitionGroup>
              ) : (
                <>
                  <span style={{ margin: "20px" }}>
                    There is no added recipe.
                  </span>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                </>
              )
            ) : (
              <span style={{ margin: "20px" }}>There is no added recipe.</span>
            )}
          </CardGroup>
        </Tab>
        <Tab className="week-tab" eventKey="2" title="Tuesday">
          <CardGroup style={{ marginTop: "10px", maxWidth: "1000px" }}>
            {recipesLoading ? (
              <i style={{ margin: "20px" }} className="fa fa-spinner fa-spin" />
            ) : recipesError ? (
              <span style={{ margin: "20px" }}>{recipesError}</span>
            ) : recipes.length ? (
              recipes.filter((recipe) => parseInt(recipe.day) === 2).length ? (
                <TransitionGroup style={{ display: "flex", flexWrap: "wrap" }}>
                  {recipes
                    .filter((recipe) => parseInt(recipe.day) === 2)
                    .map((recipe, index) => {
                      return (
                        <CSSTransition
                          key={index}
                          timeout={500}
                          classNames="item"
                          className="recipe-day"
                        >
                          <Card>
                            <abbr
                              title="Click here to remove from weekly menu"
                              className="remove-recipe"
                              onClick={() =>
                                removeFromWeeklyMenu(recipe.r_id, recipe.day)
                              }
                            >
                              <i className="fas fa-minus-circle" />
                            </abbr>
                            <Link
                              className="recipe-day-link"
                              to={`/recipe/${recipe.r_id}`}
                            >
                              <Card.Img
                                variant="top"
                                src={
                                  recipe.r_pic
                                    ? `data:image/png;base64,${recipe.r_pic}`
                                    : defaultRecipe
                                }
                                alt={`${recipe.r_id}`}
                                width="100%"
                              />
                              <Card.Body>
                                <Card.Title>{recipe.r_name}</Card.Title>
                                <small className="text-muted">
                                  {recipe.r_cat_name}
                                </small>
                              </Card.Body>
                            </Link>
                          </Card>
                        </CSSTransition>
                      );
                    })}
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                </TransitionGroup>
              ) : (
                <>
                  <span style={{ margin: "20px" }}>
                    There is no added recipe.
                  </span>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                </>
              )
            ) : (
              <span style={{ margin: "20px" }}>There is no added recipe.</span>
            )}
          </CardGroup>
        </Tab>
        <Tab className="week-tab" eventKey="3" title="Wednesday">
          <CardGroup style={{ marginTop: "10px", maxWidth: "1000px" }}>
            {recipesLoading ? (
              <i style={{ margin: "20px" }} className="fa fa-spinner fa-spin" />
            ) : recipesError ? (
              <span style={{ margin: "20px" }}>{recipesError}</span>
            ) : recipes.length ? (
              recipes.filter((recipe) => parseInt(recipe.day) === 3).length ? (
                <TransitionGroup style={{ display: "flex", flexWrap: "wrap" }}>
                  {recipes
                    .filter((recipe) => parseInt(recipe.day) === 3)
                    .map((recipe, index) => {
                      return (
                        <CSSTransition
                          key={index}
                          timeout={500}
                          classNames="item"
                          className="recipe-day"
                        >
                          <Card>
                            <abbr
                              title="Click here to remove from weekly menu"
                              className="remove-recipe"
                              onClick={() =>
                                removeFromWeeklyMenu(recipe.r_id, recipe.day)
                              }
                            >
                              <i className="fas fa-minus-circle" />
                            </abbr>
                            <Link
                              className="recipe-day-link"
                              to={`/recipe/${recipe.r_id}`}
                            >
                              <Card.Img
                                variant="top"
                                src={
                                  recipe.r_pic
                                    ? `data:image/png;base64,${recipe.r_pic}`
                                    : defaultRecipe
                                }
                                alt={`${recipe.r_id}`}
                                width="100%"
                              />
                              <Card.Body>
                                <Card.Title>{recipe.r_name}</Card.Title>
                                <small className="text-muted">
                                  {recipe.r_cat_name}
                                </small>
                              </Card.Body>
                            </Link>
                          </Card>
                        </CSSTransition>
                      );
                    })}
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                </TransitionGroup>
              ) : (
                <>
                  <span style={{ margin: "20px" }}>
                    There is no added recipe.
                  </span>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                </>
              )
            ) : (
              <span style={{ margin: "20px" }}>There is no added recipe.</span>
            )}
          </CardGroup>
        </Tab>
        <Tab className="week-tab" eventKey="4" title="Thursday">
          <CardGroup style={{ marginTop: "10px", maxWidth: "1000px" }}>
            {recipesLoading ? (
              <i style={{ margin: "20px" }} className="fa fa-spinner fa-spin" />
            ) : recipesError ? (
              <span style={{ margin: "20px" }}>{recipesError}</span>
            ) : recipes.length ? (
              recipes.filter((recipe) => parseInt(recipe.day) === 4).length ? (
                <TransitionGroup style={{ display: "flex", flexWrap: "wrap" }}>
                  {recipes
                    .filter((recipe) => parseInt(recipe.day) === 4)
                    .map((recipe, index) => {
                      return (
                        <CSSTransition
                          key={index}
                          timeout={500}
                          classNames="item"
                          className="recipe-day"
                        >
                          <Card>
                            <abbr
                              title="Click here to remove from weekly menu"
                              className="remove-recipe"
                              onClick={() =>
                                removeFromWeeklyMenu(recipe.r_id, recipe.day)
                              }
                            >
                              <i className="fas fa-minus-circle" />
                            </abbr>
                            <Link
                              className="recipe-day-link"
                              to={`/recipe/${recipe.r_id}`}
                            >
                              <Card.Img
                                variant="top"
                                src={
                                  recipe.r_pic
                                    ? `data:image/png;base64,${recipe.r_pic}`
                                    : defaultRecipe
                                }
                                alt={`${recipe.r_id}`}
                                width="100%"
                              />
                              <Card.Body>
                                <Card.Title>{recipe.r_name}</Card.Title>
                                <small className="text-muted">
                                  {recipe.r_cat_name}
                                </small>
                              </Card.Body>
                            </Link>
                          </Card>
                        </CSSTransition>
                      );
                    })}
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                </TransitionGroup>
              ) : (
                <>
                  <span style={{ margin: "20px" }}>
                    There is no added recipe.
                  </span>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                </>
              )
            ) : (
              <span style={{ margin: "20px" }}>There is no added recipe.</span>
            )}
          </CardGroup>
        </Tab>
        <Tab className="week-tab" eventKey="5" title="Friday">
          <CardGroup style={{ marginTop: "10px", maxWidth: "1000px" }}>
            {recipesLoading ? (
              <i style={{ margin: "20px" }} className="fa fa-spinner fa-spin" />
            ) : recipesError ? (
              <span style={{ margin: "20px" }}>{recipesError}</span>
            ) : recipes.length ? (
              recipes.filter((recipe) => parseInt(recipe.day) === 5).length ? (
                <TransitionGroup style={{ display: "flex", flexWrap: "wrap" }}>
                  {recipes
                    .filter((recipe) => parseInt(recipe.day) === 5)
                    .map((recipe, index) => {
                      return (
                        <CSSTransition
                          key={index}
                          timeout={500}
                          classNames="item"
                          className="recipe-day"
                        >
                          <Card>
                            <abbr
                              title="Click here to remove from weekly menu"
                              className="remove-recipe"
                              onClick={() =>
                                removeFromWeeklyMenu(recipe.r_id, recipe.day)
                              }
                            >
                              <i className="fas fa-minus-circle" />
                            </abbr>
                            <Link
                              className="recipe-day-link"
                              to={`/recipe/${recipe.r_id}`}
                            >
                              <Card.Img
                                variant="top"
                                src={
                                  recipe.r_pic
                                    ? `data:image/png;base64,${recipe.r_pic}`
                                    : defaultRecipe
                                }
                                alt={`${recipe.r_id}`}
                                width="100%"
                              />
                              <Card.Body>
                                <Card.Title>{recipe.r_name}</Card.Title>
                                <small className="text-muted">
                                  {recipe.r_cat_name}
                                </small>
                              </Card.Body>
                            </Link>
                          </Card>
                        </CSSTransition>
                      );
                    })}
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                </TransitionGroup>
              ) : (
                <>
                  <span style={{ margin: "20px" }}>
                    There is no added recipe.
                  </span>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                </>
              )
            ) : (
              <span style={{ margin: "20px" }}>There is no added recipe.</span>
            )}
          </CardGroup>
        </Tab>
        <Tab className="week-tab" eventKey="6" title="Saturday">
          <CardGroup style={{ marginTop: "10px", maxWidth: "1000px" }}>
            {recipesLoading ? (
              <i style={{ margin: "20px" }} className="fa fa-spinner fa-spin" />
            ) : recipesError ? (
              <span style={{ margin: "20px" }}>{recipesError}</span>
            ) : recipes.length ? (
              recipes.filter((recipe) => parseInt(recipe.day) === 6).length ? (
                <TransitionGroup style={{ display: "flex", flexWrap: "wrap" }}>
                  {recipes
                    .filter((recipe) => parseInt(recipe.day) === 6)
                    .map((recipe, index) => {
                      return (
                        <CSSTransition
                          key={index}
                          timeout={500}
                          classNames="item"
                          className="recipe-day"
                        >
                          <Card>
                            <abbr
                              title="Click here to remove from weekly menu"
                              className="remove-recipe"
                              onClick={() =>
                                removeFromWeeklyMenu(recipe.r_id, recipe.day)
                              }
                            >
                              <i className="fas fa-minus-circle" />
                            </abbr>
                            <Link
                              className="recipe-day-link"
                              to={`/recipe/${recipe.r_id}`}
                            >
                              <Card.Img
                                variant="top"
                                src={
                                  recipe.r_pic
                                    ? `data:image/png;base64,${recipe.r_pic}`
                                    : defaultRecipe
                                }
                                alt={`${recipe.r_id}`}
                                width="100%"
                              />
                              <Card.Body>
                                <Card.Title>{recipe.r_name}</Card.Title>
                                <small className="text-muted">
                                  {recipe.r_cat_name}
                                </small>
                              </Card.Body>
                            </Link>
                          </Card>
                        </CSSTransition>
                      );
                    })}
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                </TransitionGroup>
              ) : (
                <>
                  <span style={{ margin: "20px" }}>
                    There is no added recipe.
                  </span>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                </>
              )
            ) : (
              <span style={{ margin: "20px" }}>There is no added recipe.</span>
            )}
          </CardGroup>
        </Tab>
        <Tab className="week-tab" eventKey="0" title="Sunday">
          <CardGroup style={{ marginTop: "10px", maxWidth: "1000px" }}>
            {recipesLoading ? (
              <i style={{ margin: "20px" }} className="fa fa-spinner fa-spin" />
            ) : recipesError ? (
              <span style={{ margin: "20px" }}>{recipesError}</span>
            ) : recipes.length ? (
              recipes.filter((recipe) => parseInt(recipe.day) === 0).length ? (
                <TransitionGroup style={{ display: "flex", flexWrap: "wrap" }}>
                  {recipes
                    .filter((recipe) => parseInt(recipe.day) === 0)
                    .map((recipe, index) => {
                      return (
                        <CSSTransition
                          key={index}
                          timeout={500}
                          classNames="item"
                          className="recipe-day"
                        >
                          <Card>
                            <abbr
                              title="Click here to remove from weekly menu"
                              className="remove-recipe"
                              onClick={() =>
                                removeFromWeeklyMenu(recipe.r_id, recipe.day)
                              }
                            >
                              <i className="fas fa-minus-circle" />
                            </abbr>
                            <Link
                              className="recipe-day-link"
                              to={`/recipe/${recipe.r_id}`}
                            >
                              <Card.Img
                                variant="top"
                                src={
                                  recipe.r_pic
                                    ? `data:image/png;base64,${recipe.r_pic}`
                                    : defaultRecipe
                                }
                                alt={`${recipe.r_id}`}
                                width="100%"
                              />
                              <Card.Body>
                                <Card.Title>{recipe.r_name}</Card.Title>
                                <small className="text-muted">
                                  {recipe.r_cat_name}
                                </small>
                              </Card.Body>
                            </Link>
                          </Card>
                        </CSSTransition>
                      );
                    })}
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                </TransitionGroup>
              ) : (
                <>
                  <span style={{ margin: "20px" }}>
                    There is no added recipe.
                  </span>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                  <div style={{ minWidth: "200px", flex: "1 0" }}></div>
                </>
              )
            ) : (
              <span style={{ margin: "20px" }}>There is no added recipe.</span>
            )}
          </CardGroup>
        </Tab>
      </Tabs>
    </motion.div>
  );
}
