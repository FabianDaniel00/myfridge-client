import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../../style/AddRecipe.scss";
import {
  FormControl,
  Image,
  Form,
  Button,
  Alert,
  Collapse,
  Toast,
  Modal,
} from "react-bootstrap";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { v4 as uuidv4 } from "uuid";

export default function AddRecipe({ pageTransitions }) {
  const [groceryInput, setGroceryInput] = useState("");
  const [groceries, setGroceries] = useState([]);
  const [groceriesLoading, setGroceriesLoading] = useState(false);
  const [groceriesError, setGroceriesError] = useState("");
  const [addedGroceries, setAddedGroceries] = useState([]);
  const [recipeCategories, setRecipeCategories] = useState([]);
  const [recipeCategoriesError, setRecipeCategoriesError] = useState("");
  const [recipeName, setRecipeName] = useState("");
  const [recipeDescription, setRecipeDescription] = useState("");
  const [recipeCategory, setRecipeCategory] = useState(-1);
  const [recipePic, setRecipePic] = useState("");
  const [addRecipeLoading, setAddRecipeLoading] = useState(false);
  const [addRecipeError, setAddRecipeError] = useState("");
  const [addRecipeMessage, setAddRecipeMessage] = useState("");
  const [warningToastShow, setWarningToastShow] = useState(false);

  useEffect(() => {
    getRecipeCategories();
  }, []);

  const getRecipeCategories = () => {
    axios
      .get(
        `${process.env.REACT_APP_API_HOST}/recipes/r/r/get/recipes_categories`
      )
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

  const searchGroceries = (input) => {
    setGroceries([]);
    if (input.length > 1) {
      setGroceriesLoading(true);
      axios
        .get(
          `${process.env.REACT_APP_API_HOST}/recipes/r/r/search_groceries/${input}`,
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

  const addGrocery = (grocery) => {
    let contain = false;
    for (const addedGrocery of addedGroceries) {
      if (addedGrocery.grocery.g_id === grocery.g_id) {
        contain = true;
        break;
      }
    }
    if (!contain) {
      setAddedGroceries((addedGroceries) => [
        ...addedGroceries,
        { grocery, quantity: 0 },
      ]);
    } else {
      setWarningToastShow(true);
    }
  };

  const deleteAddedGrocery = (g_id) => {
    setAddedGroceries((addedGroceries) =>
      addedGroceries.filter((addedGrocery) => {
        return addedGrocery.grocery.g_id !== g_id;
      })
    );
  };

  const validatePic = async () => {
    const pic = document.getElementById("recipe_pic");

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

      if (picSize >= 4096) {
        pic.value = "";
        setAddRecipeMessage("");
        setAddRecipeError("Picture is to large.");
        return false;
      } else if (!checkExtension()) {
        pic.value = "";
        setAddRecipeMessage("");
        setAddRecipeError("The selected file is not a picture!");
        return false;
      } else {
        const resultPic = await toBase64(pic.files[0]).catch((e) => Error(e));
        if (resultPic instanceof Error) {
          setAddRecipeMessage("");
          setAddRecipeError(resultPic.message);
          setAddRecipeLoading(false);
          return false;
        }
        setRecipePic(resultPic);
        return true;
      }
    } else {
      return true;
    }
  };

  const addRecipe = (event) => {
    event.preventDefault();

    const checkQuantity = () => {
      if (addedGroceries.length < 2) {
        return false;
      }

      for (const ingredient of addedGroceries) {
        if (ingredient.quantity <= 0) {
          return false;
        }
      }
      return true;
    };

    if (validatePic() && checkQuantity() && recipeCategory !== -1) {
      setAddRecipeLoading(true);

      const r_id = uuidv4();

      const ingredients = [];
      for (const ingredient of addedGroceries) {
        ingredients.push([
          parseInt(ingredient.grocery.g_id),
          r_id,
          parseFloat(ingredient.quantity),
        ]);
      }

      axios
        .post(
          `${process.env.REACT_APP_API_HOST}/recipes/add_recipe`,
          {
            r_id,
            r_name: recipeName,
            r_description: recipeDescription,
            r_cat_id: recipeCategory,
            r_pic: recipePic,
            ingredients: ingredients,
          },
          {
            headers: {
              "x-access-token": localStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          if (response.data.err) {
            setAddRecipeMessage("");
            setAddRecipeError(response.data.err);
          } else {
            if (response.data.newToken) {
              localStorage.setItem("token", response.data.newToken);
            }
            const pic = document.getElementById("recipe_pic");
            setGroceryInput("");
            setGroceries([]);
            setRecipeName("");
            setAddedGroceries([]);
            setRecipeDescription("");
            setRecipeCategory(-1);
            pic.value = "";

            setAddRecipeError("");
            setAddRecipeMessage(response.data.message);
          }
          setAddRecipeLoading(false);
        })
        .catch((error) => {
          setAddRecipeMessage("");
          setAddRecipeError(error.message);
          setAddRecipeLoading(false);
        });
    } else {
      setAddRecipeMessage("");
      setAddRecipeError("Please check the fields!");
    }
  };

  const changeQuantity = (quantity, index) => {
    const addedIngredients = [...addedGroceries];

    addedIngredients[index].quantity = quantity;
    setAddedGroceries(addedIngredients);
  };

  return (
    <motion.div
      initial="out"
      animate="in"
      exit="out"
      variants={pageTransitions.pageVariants}
      transition={pageTransitions.pageTransition}
      className="add-recipe"
    >
      <Modal show={warningToastShow} onHide={() => setWarningToastShow(false)}>
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

      <h2>Add Recipe</h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
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
                      className="grocery"
                      onClick={() => addGrocery(grocery)}
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
        <Form className="recipe-details" onSubmit={(event) => addRecipe(event)}>
          <h6>Recipe Details</h6>
          <Form.Group controlId="recipeName">
            <Form.Label style={{ fontSize: "13px" }}>
              Recipe Name <i style={{ color: "#f00" }}>*</i>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Recipe name"
              size="sm"
              onChange={(event) => setRecipeName(event.target.value)}
              value={recipeName}
              required
            />
          </Form.Group>
          <div style={{ border: "1px solid #d1d1d1", padding: "5px" }}>
            <div style={{ fontSize: "12px" }}>
              Ingredients{" "}
              {addedGroceries.length < 2 ? (
                <span style={{ color: "#ff3300" }}>
                  ({addedGroceries.length})
                </span>
              ) : (
                "(" + addedGroceries.length + ")"
              )}
            </div>
            {addedGroceries.length ? (
              <TransitionGroup className="groceries-list">
                {addedGroceries.map((addedGrocery, index) => {
                  return (
                    <CSSTransition
                      key={addedGrocery.grocery.g_id}
                      timeout={500}
                      classNames="item"
                      className="grocery added-grocery contain"
                    >
                      <div
                        style={{ position: "relative", paddingBottom: "40px" }}
                      >
                        <i
                          className="fas fa-times-circle x"
                          onClick={() => {
                            deleteAddedGrocery(addedGrocery.grocery.g_id);
                          }}
                        />
                        <Image
                          src={`data:image/png;base64,${addedGrocery.grocery.g_img}`}
                          alt={`${addedGrocery.grocery.g_id}`}
                          width="100%"
                          rounded
                        />
                        <span style={{ color: "#808080", fontSize: "12px" }}>
                          {addedGrocery.grocery.g_name}
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
                          {addedGrocery.grocery.g_cat_name}
                        </span>
                        <div
                          style={{
                            display: "block",
                            position: "absolute",
                            bottom: "5px",
                            left: "12px",
                          }}
                        >
                          <Form.Control
                            type="number"
                            placeholder="0"
                            min="0"
                            step="any"
                            onChange={(event) => {
                              changeQuantity(event.target.value, index);
                            }}
                            size="sm"
                            className="quantity"
                            required
                          />
                          <span style={{ fontSize: "13px", color: "#bfbfbf" }}>
                            {addedGrocery.grocery.g_quantity_type}
                          </span>
                        </div>
                      </div>
                    </CSSTransition>
                  );
                })}
                <div className="groceries-placeholder"></div>
                <div className="groceries-placeholder"></div>
                <div className="groceries-placeholder"></div>
                <div className="groceries-placeholder"></div>
              </TransitionGroup>
            ) : (
              <span>You have to add at least 2 ingredients.</span>
            )}
          </div>

          <Form.Group controlId="recipeDescription">
            <Form.Label style={{ fontSize: "13px" }}>
              Recipe Description <i style={{ color: "#f00" }}>*</i>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="1. step...
2. step...
3. step...
4. ..."
              onChange={(event) => setRecipeDescription(event.target.value)}
              size="sm"
              as="textarea"
              rows="4"
              value={recipeDescription}
              required
            />
          </Form.Group>

          <Form.Group controlId="recipeCategory">
            <Form.Label style={{ fontSize: "13px" }}>
              Recipe Category <i style={{ color: "#f00" }}>*</i>
            </Form.Label>
            <Form.Control
              size="sm"
              as="select"
              onChange={(event) => setRecipeCategory(event.target.value)}
              value={recipeCategory}
            >
              <option value="-1">-select one-</option>
              {recipeCategoriesError ? (
                <option value="-1">{recipeCategoriesError}</option>
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

          <Form.File>
            <Form.File.Label style={{ fontSize: "13px" }}>
              Upload image for recipe{" "}
              <i style={{ color: "#a1a1a1" }}>
                (optional, max 4 MB, recommended 286x100)
              </i>
            </Form.File.Label>
            <Form.File.Input
              accept="image/png, image/jpeg, image/jpg"
              onChange={validatePic}
              id="recipe_pic"
              style={{ fontSize: "13px" }}
            />
          </Form.File>

          <br />

          <Button variant="info" type="submit" disabled={addRecipeLoading}>
            {addRecipeLoading ? (
              <i className="fa fa-spinner fa-spin" />
            ) : (
              "Add recipe"
            )}
          </Button>

          <Collapse in={addRecipeError || addRecipeMessage}>
            <div>
              <Toast
                onClose={() => {
                  setAddRecipeError("");
                  setAddRecipeMessage("");
                }}
                show={addRecipeError || addRecipeMessage}
                delay={30000}
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
                    {addRecipeError
                      ? "Error!"
                      : addRecipeMessage
                      ? "Success"
                      : null}
                  </strong>
                </Toast.Header>
                <Toast.Body>
                  {addRecipeError ? (
                    <Alert variant="danger">{addRecipeError}</Alert>
                  ) : addRecipeMessage ? (
                    <Alert variant="success">{addRecipeMessage}</Alert>
                  ) : null}
                </Toast.Body>
              </Toast>
            </div>
          </Collapse>
        </Form>
      </div>
    </motion.div>
  );
}
