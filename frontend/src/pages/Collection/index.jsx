import { useState, useEffect } from "react";
import { getRecipes } from "../../api/recipes";
import RecipeCard from "../../components/RecipeCard";
import Filters from "./Filters";

function Collection() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [maxTime, setMaxTime] = useState("");
  const [maxServings, setMaxServings] = useState("");

  // debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setSearch(inputValue), 400);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // fetch from server when server-side filters change
  useEffect(() => {
    setErr(null);
    const params = {};
    if (search) params.q = search;
    if (cuisine) params.cuisine = cuisine;
    if (difficulty) params.difficulty = difficulty;

    getRecipes(params)
      .then(data => setRecipes(Array.isArray(data) ? data : []))
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, [search, cuisine, difficulty]);

  // client-side filtering for time and servings
  const displayed = recipes.filter(r => {
    if (maxTime) {
      const total = (r.prep_time_minutes ?? 0) + (r.cook_time_minutes ?? 0);
      if (total > parseInt(maxTime)) return false;
    }
    if (maxServings && r.servings != null) {
      if (r.servings < parseInt(maxServings)) return false;
    }
    return true;
  });

  function clearFilters() {
    setInputValue("");
    setSearch("");
    setCuisine("");
    setDifficulty("");
    setMaxTime("");
    setMaxServings("");
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Recipes</p>
        <h1 className="text-4xl font-serif text-stone-800">Collection</h1>
      </div>

      <Filters
        search={inputValue} setSearch={setInputValue}
        cuisine={cuisine} setCuisine={setCuisine}
        difficulty={difficulty} setDifficulty={setDifficulty}
        maxTime={maxTime} setMaxTime={setMaxTime}
        maxServings={maxServings} setMaxServings={setMaxServings}
        onClear={clearFilters}
      />

      {err && <p className="text-sm text-red-500 mt-4">{err}</p>}

      {loading ? (
        <p className="text-stone-400 mt-10">Loading recipes...</p>
      ) : displayed.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-stone-400">No recipes found.</p>
          <p className="text-sm text-stone-300 mt-1">Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-5">
            {displayed.length} {displayed.length === 1 ? "recipe" : "recipes"}
          </p>
          <div className="grid grid-cols-3 gap-6">
            {displayed.map(r => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        </>
      )}
    </div>
  );
}

export default Collection;
