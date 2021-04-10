import "../style/App.scss";
import { motion } from "framer-motion";
import UserContext from "./../user/UserContext";
import { useContext } from "react";

export default function Home({ pageTransitions }) {
  const { user } = useContext(UserContext);
  return (
    <motion.div
      initial="out"
      animate="in"
      exit="out"
      variants={pageTransitions.pageVariants}
      transition={pageTransitions.pageTransition}
    >
      <h1>Home</h1>
    </motion.div>
  );
}
