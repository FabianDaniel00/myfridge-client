import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Table, Image, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../style/FavoriteRecipes.scss";

export default function FavoriteRecipes({ pageTransitions }) {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [favoriteRecipesLoading, setFavoriteRecipesLoading] = useState(true);
  const [favoriteRecipesError, setFavoriteRecipesError] = useState("");
  const [ratings, setRatings] = useState("");
  const [modalError, setModalError] = useState("");

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
              } else if (favRecipe.recipe_id === r_id && !favRecipe.favorite) {
                favRecipe.favorite = true;
                break;
              }
            }
            setFavoriteRecipes(favRecipes);
          }
        }
      })
      .catch((error) => {
        setModalError(error.message);
      });
  };

  return (
    <motion.div
      initial="out"
      animate="in"
      exit="out"
      variants={pageTransitions.pageVariants}
      transition={pageTransitions.pageTransition}
      className="favorite-recipes"
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

      <h4>Your favorite recipes</h4>
      <br />
      <Table striped hover responsive className="fav-recipes-table" size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Picture</th>
            <th>Recipe Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Created By</th>
            <th>Rating</th>
            <th>Favorite</th>
          </tr>
        </thead>
        <tbody>
          {favoriteRecipesLoading ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                <i className="fa fa-spinner fa-spin" />
              </td>
            </tr>
          ) : favoriteRecipesError ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                {favoriteRecipesError}
              </td>
            </tr>
          ) : favoriteRecipes.length ? (
            favoriteRecipes.map((favoriteRecipe, index) => {
              return (
                <tr key={favoriteRecipe.recipe_id}>
                  <td>
                    <Link to={`/recipe/${favoriteRecipe.recipe_id}`}>
                      {index + 1}.
                    </Link>
                  </td>
                  <td>
                    <Link to={`/recipe/${favoriteRecipe.recipe_id}`}>
                      <Image
                        src={`data:image/png;base64,${favoriteRecipe.r_pic}`}
                        alt={favoriteRecipe.recipe_id}
                        width="100%"
                        style={{ maxWidth: "200px", minWidth: "100px" }}
                        rounded
                      />
                    </Link>
                  </td>
                  <td>
                    <Link to={`/recipe/${favoriteRecipe.recipe_id}`}>
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
              <td colSpan="8" style={{ textAlign: "center", color: "#8a8a8a" }}>
                You have no added favorite recipes.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </motion.div>
  );
}
