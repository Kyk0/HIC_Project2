import { motion } from "framer-motion";

function FeatureCard({ title, text, className = "" }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={"p-6 bg-white rounded-xl border border-green-100 " + className}
    >
      <h3 className="text-xl font-serif text-stone-800 mb-2">{title}</h3>
      <p className="text-sm text-stone-500">{text}</p>
    </motion.div>
  );
}

export default FeatureCard;
