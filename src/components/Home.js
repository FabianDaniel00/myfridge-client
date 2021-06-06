import "../style/App.scss";
import { motion } from "framer-motion";
import RecipeCards from "./RecipeCards.js";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import UserContext from "./../user/UserContext.js";

export default function Home({ pageTransitions }) {
  const { category, search } = useParams();

  const [recipeCategories, setRecipeCategories] = useState([]);
  const [recipeCategoriesError, setRecipeCategoriesError] = useState("");
  const [searchInput, setSearchInput] = useState(
    search === "all" ? "" : search
  );

  const redirect = useHistory();

  const { user } = useContext(UserContext);

  const getRecipeCategories = () => {
    axios
      .get("http://localhost:8080/recipes/r/r/get/recipes_categories")
      .then((response) => {
        if (response.data.err) {
          setRecipeCategoriesError(response.data.err);
        } else {
          setRecipeCategories(response.data.result);
        }
      })
      .catch((error) => {
        setRecipeCategoriesError(error.message);
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
      <h1 style={{ marginBottom: "20px", textAlign: "center" }}>Recipes</h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <Form.Group
          controlId="recipeCategory"
          style={{ width: "200px", margin: "5px" }}
        >
          <Form.Label style={{ fontSize: "13px" }}>Recipe Category</Form.Label>
          <Form.Control
            size="sm"
            as="select"
            onChange={(event) =>
              redirect.push(`/recipes/${event.target.value}/1/${search}`)
            }
            value={category}
          >
            <option value="all">-all-</option>
            {recipeCategoriesError ? (
              <option>{recipeCategoriesError}</option>
            ) : (
              recipeCategories &&
              recipeCategories.map((recipeCategory) => {
                return (
                  <option
                    key={recipeCategory.r_cat_id}
                    value={recipeCategory.r_cat_id}
                  >
                    {recipeCategory.r_cat_name}
                  </option>
                );
              })
            )}
          </Form.Control>
        </Form.Group>

        {user && (
          <InputGroup size="sm" style={{ width: "300px", margin: "5px" }}>
            <Form.Control
              placeholder="Search..."
              aria-label="Search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            <InputGroup.Append>
              <Button
                variant="outline-info"
                onClick={() =>
                  redirect.push(`/recipes/${category}/1/${searchInput}`)
                }
              >
                Search
              </Button>
            </InputGroup.Append>
          </InputGroup>
        )}
      </div>

      <RecipeCards />
    </motion.div>
  );
}
