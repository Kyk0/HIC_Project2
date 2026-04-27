import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function RecipeCard({ recipe }) {
  const difficultyColor =
    recipe.difficulty === "Easy" ? "text-green-600" :
    recipe.difficulty === "Medium" ? "text-amber-600" :
    "text-red-500";

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link to={`/recipe/${recipe.id}`} className="block bg-white rounded-xl border border-stone-100 overflow-hidden">
        <div className="h-56 bg-stone-100">
          {recipe.image_url
            ? <img src={recipe.image_url} alt={recipe.name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-stone-300 text-sm">No image</div>
          }
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="font-serif text-stone-800 text-lg leading-snug">{recipe.name}</h3>
            {recipe.difficulty && (
              <span className={`text-sm font-medium shrink-0 mt-0.5 ${difficultyColor}`}>
                {recipe.difficulty}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm">
            {recipe.cuisine && (
              <span className="text-stone-600 font-semibold">{recipe.cuisine}</span>
            )}
            {recipe.rating != null && (
              <span className="text-stone-600 font-semibold">{recipe.rating.toFixed(1)} rating</span>
            )}
            {recipe.calories_per_serving != null && (
              <span className="text-stone-600 font-semibold">{recipe.calories_per_serving} kcal</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default RecipeCard;
