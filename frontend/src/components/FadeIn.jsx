import {motion} from "framer-motion";

function FadeIn({
  children,
  delay = 0,
  y = 20,
  duration = 0.6,
  className = "",

  inView = false,
}) {
  const trigger = inView
    ? {
        whileInView: {opacity: 1, y: 0},
        viewport: {once: true, margin: "-50px"},
      }
    : {animate: {opacity: 1, y: 0}};

  return (
    <motion.div
      initial={{opacity: 0, y}}
      {...trigger}
      transition={{duration, delay, ease: "easeOut"}}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default FadeIn;
