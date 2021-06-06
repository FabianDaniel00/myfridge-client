import { motion } from "framer-motion";
import "../style/RecipeCategories.scss";
import { Card, CardDeck } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RecipeCategories({ pageTransitions }) {
  const [recipeCategoriesLoading, setRecipeCategoriesLoading] = useState(true);
  const [recipeCategoriesError, setRecipeCategoriesError] = useState("");
  const [recipeCategories, setRecipeCategories] = useState([]);

  const getRecipeCategories = () => {
    axios
      .get("http://localhost:8080/recipes/r/r/get/recipes_categories")
      .then((response) => {
        if (response.data.err) {
          setRecipeCategoriesError(response.data.err);
        } else {
          setRecipeCategories(response.data.result);
        }
        setRecipeCategoriesLoading(false);
      })
      .catch((error) => {
        setRecipeCategoriesError(error.message);
        setRecipeCategoriesLoading(false);
      });
  };

  useEffect(() => {
    getRecipeCategories();
  }, []);

  return (
    <motion.div
      initial="out"
      animate="in"
      exit="out"
      variants={pageTransitions.pageVariants}
      transition={pageTransitions.pageTransition}
    >
      <h1 style={{ marginBottom: "20px", textAlign: "center" }}>
        Recipe Categories
      </h1>

      {recipeCategoriesLoading ? (
        <h3 style={{ margin: "20px", textAlign: "center" }}>
          <i className="fa fa-spinner fa-spin" />
        </h3>
      ) : recipeCategoriesError ? (
        <h4 style={{ margin: "20px", textAlign: "center" }}>
          {recipeCategoriesError}
        </h4>
      ) : (
        <CardDeck className="recipe-categories">
          {recipeCategories &&
            recipeCategories.map((recipeCategory) => {
              return (
                <Card
                  style={{ flexBasis: "50%", margin: "30px" }}
                  className="category-card"
                  key={recipeCategory.r_cat_id}
                >
                  <Link
                    exact
                    to={`recipes/${recipeCategory.r_cat_id}/1/all`}
                    className="category-link"
                  >
                    <Card.Img
                      variant="top"
                      src={`data:image/png;base64,${recipeCategory.r_cat_image}`}
                      alt={recipeCategory.r_cat_id}
                    />
                    <Card.Body>
                      <Card.Title>{recipeCategory.r_cat_name}</Card.Title>
                    </Card.Body>
                  </Link>
                </Card>
              );
            })}
        </CardDeck>
      )}
    </motion.div>
  );
}
