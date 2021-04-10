import { useLocation } from "react-router";
import { motion } from "framer-motion";

function NoMatch({ pageTransitions }) {
  const location = useLocation();
  return (
    <motion.div
      initial="out"
      animate="in"
      exit="out"
      variants={pageTransitions.pageVariants}
      transition={pageTransitions.pageTransition}
    >
      <h1 style={{ margin: "50px" }}>
        No match for <code>{location.pathname}</code>
      </h1>
    </motion.div>
  );
}

export default NoMatch;
