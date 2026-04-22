import { motion } from "motion/react";
import "./index.css";

interface CloudscapeContainerProps {
  header?: string;
  children: React.ReactNode;
  className?: string;
}

function CloudscapeContainer({
  header,
  children,
  className = "",
}: CloudscapeContainerProps) {
  return (
    <motion.div
      className={`cloudscape-container  ${className}`}
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {header && <h2 className="cloudscape-container-header">{header}</h2>}
      <div className="cloudscape-container-content">{children}</div>
    </motion.div>
  );
}

export default CloudscapeContainer;
