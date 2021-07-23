/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import "../style/RecipeCards.scss";
import axios from "axios";
import { useParams, Link, useHistory } from "react-router-dom";
import {
  CardDeck,
  Card,
  ListGroup,
  ListGroupItem,
  Pagination,
} from "react-bootstrap";
import moment from "moment";
import defaultRecipe from "../img/recipe_default.png";
import UserContext from "../user/UserContext.js";

export default function RecipeCards() {
  const { category, page, search } = useParams();

  const redirect = useHistory();

  const [recipes, setRecipes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState([]);
  const [ratings, setRatings] = useState("");

  const { user } = useContext(UserContext);

  const getRecipes = () => {
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_API_HOST}/recipes/${category}/${page}/${search}`
      )
      .then((response) => {
        if (response.data.err) {
          setError(response.data.err);
        } else {
          setRecipes(response.data.recipes);
          const pageCount = Math.ceil(response.data.recipesCount / 10);
          for (let i = 1; i <= pageCount; i++) {
            setPagination((pagination) => [
              ...pagination,
              <Pagination.Item
                onClick={() => {
                  window.scrollTo(0, 0);
                  redirect.push(`/recipes/${category}/${i}/${search}`);
                }}
                key={i}
                active={i === parseInt(page)}
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
  };

  useEffect(() => {
    getRecipes();
  }, []);

  useEffect(() => {
    setTimeout(imageSizes, 300);
  }, [loading]);

  const imageSizes = () => {
    const cardImages = document.getElementsByClassName("card-image");
    const length = cardImages.length;
    for (let i = 0; i < length; i++) {
      const width = cardImages[i].getBoundingClientRect().width;
      cardImages[i].style.height = Math.round(width / 1.59) + "px";
    }
  };

  window.addEventListener("resize", imageSizes);

  return (
    <>
      {loading ? (
        <h3 style={{ margin: "20px", textAlign: "center" }}>
          <i className="fa fa-spinner fa-spin" /> loading recipes...
        </h3>
      ) : error ? (
        <h4 style={{ margin: "20px", textAlign: "center" }}>{error}</h4>
      ) : (
        <>
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
                              Overall rating of <i>{recipe.ratings_count}</i> is{" "}
                              {ratings[index].map((star) => {
                                return star;
                              })}
                            </span>
                          )}
                        </ListGroupItem>
                        {user && (
                          <ListGroupItem>
                            {recipe.is_favorite ? (
                              <span
                                style={{
                                  color: "#636363",
                                  fontSize: "13px",
                                  display: "flex",
                                  alignItems: "center",
                                  flexWrap: "wrap",
                                }}
                              >
                                <span style={{ marginRight: "5px" }}>
                                  Your favorite
                                </span>
                                <i className="fas fa-heart card-favorite favorite" />
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
                                <span style={{ marginRight: "5px" }}>
                                  Not your favorite
                                </span>
                                <i className="far fa-heart favorite card-favorite not-favorite" />
                              </span>
                            )}
                          </ListGroupItem>
                        )}
                      </ListGroup>
                      <Card.Footer
                        style={{
                          bottom: "0",
                          position: "absolute",
                          width: "100%",
                        }}
                      >
                        <small className="text-muted">
                          Posted at {moment(recipe.r_created_at).calendar()}
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
                window.scrollTo(0, 0);
                redirect.push(`/recipes/${category}/1/${search}`);
              }}
            />
            <Pagination.Prev
              onClick={() => {
                if (parseInt(page) > 1) {
                  window.scrollTo(0, 0);
                  redirect.push(
                    `/recipes/${category}/${parseInt(page) - 1}/${search}`
                  );
                }
              }}
            />
            {pagination}
            <Pagination.Next
              onClick={() => {
                if (parseInt(page) < pagination.length) {
                  window.scrollTo(0, 0);
                  redirect.push(
                    `/recipes/${category}/${parseInt(page) + 1}/${search}`
                  );
                }
              }}
            />
            <Pagination.Last
              onClick={() => {
                window.scrollTo(0, 0);
                redirect.push(
                  `/recipes/${category}/${pagination.length}/${search}`
                );
              }}
            />
          </Pagination>
        </>
      )}
    </>
  );
}
