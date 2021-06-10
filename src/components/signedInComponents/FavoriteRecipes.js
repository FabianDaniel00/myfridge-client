import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Table,
  Image,
  Modal,
  Button,
  Form,
  Collapse,
  Toast,
  Alert,
  Card,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../style/FavoriteRecipes.scss";
import defaultRecipe from "../../img/recipe_default.png";

export default function FavoriteRecipes({ pageTransitions }) {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [daysFromWeeklyMenu, setDaysFromWeeklyMenu] = useState([]);
  const [favoriteRecipesLoading, setFavoriteRecipesLoading] = useState(true);
  const [favoriteRecipesError, setFavoriteRecipesError] = useState("");
  const [ratings, setRatings] = useState("");
  const [addFavoritesLoading, setAddFavoritesLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [selectedRecipeId, setSelectedRecipeId] = useState("");
  const [addToWeeklyLoading, setAddToWeeklyLoading] = useState(false);
  const [addToWeeklyError, setAddToWeeklyError] = useState("");
  const [addToWeeklyMessage, setAddToWeeklyMessage] = useState("");

  useEffect(() => {
    getFavoriteRecipes();
  }, []);

  const getFavoriteRecipes = () => {
    axios
      .get("http://localhost:8080/recipes/r/r/r/get_favorite_recipes", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response.data.err) {
          setFavoriteRecipesError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setFavoriteRecipes(() => {
            for (const favRecipe of response.data.favoriteRecipes) {
              favRecipe.favorite = true;
            }
            return response.data.favoriteRecipes;
          });

          setDaysFromWeeklyMenu(response.data.daysFromWeeklyMenu.sort());

          const ratings_ = [];
          const recipesCount = response.data.favoriteRecipes.length;
          for (let i = 0; i < recipesCount; i++) {
            const recipeRating =
              Math.round(response.data.favoriteRecipes[i].rating * 10) / 10;
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
        setFavoriteRecipesLoading(false);
      })
      .catch((error) => {
        setFavoriteRecipesError(error.message);
        setFavoriteRecipesLoading(false);
      });
  };

  const addFavoriteRecipe = (r_id) => {
    if (!addFavoritesLoading) {
      setAddFavoritesLoading(true);
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
            setModalError(response.data.err);
          } else {
            if (response.data.newToken) {
              localStorage.setItem("token", response.data.newToken);
            }
            if (response.data.updated) {
              const favRecipes = [...favoriteRecipes];
              for (const favRecipe of favRecipes) {
                if (favRecipe.recipe_id === r_id && favRecipe.favorite) {
                  favRecipe.favorite = false;
                  break;
                } else if (
                  favRecipe.recipe_id === r_id &&
                  !favRecipe.favorite
                ) {
                  favRecipe.favorite = true;
                  break;
                }
              }
              setFavoriteRecipes(favRecipes);
            }
          }
          setAddFavoritesLoading(false);
        })
        .catch((error) => {
          setModalError(error.message);
          setAddFavoritesLoading(false);
        });
    }
  };

  const addToWeeklyMenu = () => {
    setAddToWeeklyLoading(true);
    axios
      .post(
        "http://localhost:8080/recipes/add_to_weekly_menu",
        {
          day: selectedDay,
          r_id: selectedRecipeId,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((response) => {
        if (response.data.err) {
          setAddToWeeklyMessage("");
          setAddToWeeklyError(response.data.err);
        } else {
          if (response.data.newToken) {
            localStorage.setItem("token", response.data.newToken);
          }
          setDaysFromWeeklyMenu(() => {
            const days = [...daysFromWeeklyMenu];
            days.push({ day: String(selectedDay), r_id: selectedRecipeId });
            return days.sort((a, b) =>
              a.day > b.day ? 1 : b.day > a.day ? -1 : 0
            );
          });
          setAddToWeeklyError("");
          setAddToWeeklyMessage(response.data.message);
        }
        setAddToWeeklyLoading(false);
      })
      .catch((error) => {
        setAddToWeeklyMessage("");
        setAddToWeeklyError(error.message);
        setAddToWeeklyLoading(false);
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
      <Modal show={modalError} onHide={() => setModalError("")}>
        <Modal.Header closeButton>
          <Modal.Title>Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalError}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalError("")}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showWeeklyModal} onHide={() => setShowWeeklyModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add to weekly menu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecipeId && (
            <div style={{ width: "18rem", margin: "0 auto 30px auto" }}>
              <Card>
                <Card.Img
                  variant="top"
                  src={
                    favoriteRecipes.filter(
                      (recipe) => recipe.recipe_id === selectedRecipeId
                    )[0].r_pic
                      ? `data:image/png;base64,
              ${
                favoriteRecipes.filter(
                  (recipe) => recipe.recipe_id === selectedRecipeId
                )[0].r_pic
              }`
                      : defaultRecipe
                  }
                  alt={selectedRecipeId}
                />
                <Card.Body>
                  <Card.Title>
                    {
                      favoriteRecipes.filter(
                        (recipe) => recipe.recipe_id === selectedRecipeId
                      )[0].r_name
                    }
                  </Card.Title>
                </Card.Body>
              </Card>
              <div style={{ marginTop: "10px" }}>
                {daysFromWeeklyMenu.filter(
                  (day) => day.r_id === selectedRecipeId
                ).length ? (
                  <>
                    This recipe is on:{" "}
                    {daysFromWeeklyMenu
                      .filter((day) => day.r_id === selectedRecipeId)
                      .map((day, index) => {
                        return (
                          <span style={{ color: "#b0b0b0" }} key={day.day}>
                            {day.day === "1"
                              ? "Monday"
                              : day.day === "2"
                              ? "Tuesday"
                              : day.day === "3"
                              ? "Wednesday"
                              : day.day === "4"
                              ? "Thursday"
                              : day.day === "5"
                              ? "Friday"
                              : day.day === "6"
                              ? "Saturday"
                              : day.day === "7"
                              ? "Sunday"
                              : null}
                            {index !==
                            daysFromWeeklyMenu.filter(
                              (day) => day.r_id === selectedRecipeId
                            ).length -
                              1
                              ? ", "
                              : null}
                          </span>
                        );
                      })}
                  </>
                ) : (
                  "This recipe is not in weekly menu."
                )}
              </div>
            </div>
          )}
          <Form.Group controlId="addToWeeklyMenu">
            <Form.Label>Select the day:</Form.Label>
            <Form.Control
              onChange={(event) => setSelectedDay(parseInt(event.target.value))}
              value={selectedDay}
              as="select"
            >
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
              <option value="7">Sunday</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Collapse in={addToWeeklyError || addToWeeklyMessage}>
            <div>
              <Toast
                onClose={() => {
                  setAddToWeeklyError("");
                  setAddToWeeklyMessage("");
                }}
                show={addToWeeklyError || addToWeeklyMessage}
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
                    {addToWeeklyError
                      ? "error!"
                      : addToWeeklyMessage
                      ? "Success"
                      : null}
                  </strong>
                </Toast.Header>
                <Toast.Body>
                  {addToWeeklyError ? (
                    <Alert variant="danger">{addToWeeklyError}</Alert>
                  ) : addToWeeklyMessage ? (
                    <Alert variant="success">{addToWeeklyMessage}</Alert>
                  ) : null}
                </Toast.Body>
              </Toast>
            </div>
          </Collapse>
          <div style={{ whiteSpace: "nowrap" }}>
            <Button
              variant="secondary"
              onClick={() => setShowWeeklyModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={addToWeeklyMenu}
              disabled={addToWeeklyLoading}
              style={{ marginLeft: "10px" }}
            >
              {addToWeeklyLoading ? (
                <i className="fa fa-spinner fa-spin" />
              ) : (
                "Add"
              )}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      <div className="favorite-recipes">
        <h4 style={{ marginLeft: "20px" }}>Your favorite recipes</h4>
        <br />
        <Table hover responsive size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Picture</th>
              <th>Recipe Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Created By</th>
              <th>Rating</th>
              <th>Weekly Menu</th>
              <th>Favorite</th>
            </tr>
          </thead>
          <tbody>
            {favoriteRecipesLoading ? (
              <tr style={{ transition: "0.3s" }}>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  <i className="fa fa-spinner fa-spin" />
                </td>
              </tr>
            ) : favoriteRecipesError ? (
              <tr style={{ transition: "0.3s" }}>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  {favoriteRecipesError}
                </td>
              </tr>
            ) : favoriteRecipes.length ? (
              favoriteRecipes.map((favoriteRecipe, index) => {
                return (
                  <tr
                    key={favoriteRecipe.recipe_id}
                    style={{ transition: "0.3s" }}
                  >
                    <td>
                      <Link
                        style={{ transition: "0.3s" }}
                        to={`/recipe/${favoriteRecipe.recipe_id}`}
                      >
                        {index + 1}.
                      </Link>
                    </td>
                    <td>
                      <Link to={`/recipe/${favoriteRecipe.recipe_id}`}>
                        <Image
                          src={
                            favoriteRecipe.r_pic
                              ? `data:image/png;base64,${favoriteRecipe.r_pic}`
                              : defaultRecipe
                          }
                          alt={favoriteRecipe.recipe_id}
                          width="100%"
                          style={{ maxWidth: "200px", minWidth: "100px" }}
                          rounded
                        />
                      </Link>
                    </td>
                    <td>
                      <Link
                        style={{ transition: "0.3s" }}
                        to={`/recipe/${favoriteRecipe.recipe_id}`}
                      >
                        {favoriteRecipe.r_name}
                      </Link>
                    </td>
                    <td>{Math.round(favoriteRecipe.price * 100) / 100} €</td>
                    <td>{favoriteRecipe.r_cat_name}</td>
                    <td>
                      {favoriteRecipe.u_f_name} {favoriteRecipe.u_l_name}
                    </td>
                    <td>
                      {Math.round(favoriteRecipe.rating * 10) / 10 === 0 ? (
                        "There is no rating yet."
                      ) : (
                        <span>
                          <span style={{ whiteSpace: "nowrap" }}>
                            Overall rating of{" "}
                            <i>{favoriteRecipe.ratings_count}</i> is{" "}
                          </span>
                          {ratings[index].map((star) => {
                            return star;
                          })}
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <Button
                        variant="info"
                        size="sm"
                        style={{ whiteSpace: " nowrap" }}
                        onClick={() => {
                          setShowWeeklyModal(true);
                          setSelectedRecipeId(favoriteRecipe.recipe_id);
                        }}
                      >
                        Add to weekly menu
                      </Button>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {favoriteRecipe.favorite ? (
                        <i
                          onClick={() =>
                            addFavoriteRecipe(favoriteRecipe.recipe_id)
                          }
                          className="fas fa-heart favorite"
                        />
                      ) : (
                        <i
                          onClick={() =>
                            addFavoriteRecipe(favoriteRecipe.recipe_id)
                          }
                          className="far fa-heart favorite not-favorite"
                        />
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="9"
                  style={{
                    textAlign: "center",
                    color: "#8a8a8a",
                    transition: "0.3s",
                  }}
                >
                  You have no added favorite recipes.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </motion.div>
  );
}
