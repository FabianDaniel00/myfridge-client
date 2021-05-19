import "../style/App.scss";
import { motion } from "framer-motion";
import RecipeCards from "./RecipeCards.js";

export default function Home({ pageTransitions }) {
  return (
    <motion.div
      initial="out"
      animate="in"
      exit="out"
      variants={pageTransitions.pageVariants}
      transition={pageTransitions.pageTransition}
    >
      <h1 style={{ marginBottom: "20px", textAlign: "center" }}>Recipes</h1>
      <RecipeCards />
    </motion.div>
  );
}
