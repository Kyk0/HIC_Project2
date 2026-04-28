import { motion } from "framer-motion";
import { Link } from "react-router-dom";


function RecipeCard({ recipe }) {

    let difficultyColor = "text-red-600 bg-red-50";
    if (recipe.difficulty === "Easy") difficultyColor = "text-green-600 bg-green-50";
    if (recipe.difficulty === "Medium") difficultyColor = "text-amber-600 bg-amber-50";

    return (
        <motion.div whileHover={{y: -4}} transition={{duration: 0.2}}>

            <Link
                to={"/recipe/" + recipe.id}
                className="block bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-md overflow-hidden group"
            >

                <div className="aspect-[4/3] overflow-hidden bg-amber-100 relative flex items-center justify-center">
                    {recipe.image_url ? (
                        <img
                            src={recipe.image_url}
                            alt={recipe.name}
                            className="w-full h-full object-cover group-hover:scale-105"
                        />) : (<span className="text-stone-400 font-medium">No image</span>)}
                </div>

                <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                        <h3 className="font-serif text-stone-800 text-xl leading-snug line-clamp-2">
                            {recipe.name}
                        </h3>

                        {recipe.difficulty && (
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase shrink-0 mt-1 ${difficultyColor}`}>
                                {recipe.difficulty}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-between text-sm mt-1">

                        {recipe.cuisine ? (
                            <span className="text-stone-500 font-medium">{recipe.cuisine}</span>) : (
                            <span className="text-stone-400 italic">General</span>
                        )}


                        <div className="font-semibold text-stone-700">
                            {recipe.rating != null ? (
                                <span className="text-stone-700">
                                    Rating: {recipe.rating.toFixed(1)}
                                </span>
                            ) : (
                                <span className="text-stone-400 font-normal italic">No rating</span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
export default RecipeCard;