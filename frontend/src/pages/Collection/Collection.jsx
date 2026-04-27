import { useState, useEffect } from "react";
import { API_URL } from "../../api/index";
import RecipeCard from "../../components/RecipeCard";


const CUISINES = ["Italian", "Mexican", "Asian", "American", "French", "Mediterranean", "Indian"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];


function Collection() {

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [difficulty, setDifficulty] = useState("");

  // debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setSearch(inputValue), 400);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // fetch recipes when filters change
  useEffect(() => {
    setLoading(true);
    setErr(null);
    
    const params = {};
    if (search) params.q = search;
    if (cuisine) params.cuisine = cuisine;
    if (difficulty) params.difficulty = difficulty;

    const qs = new URLSearchParams(params).toString();
    
    let url = API_URL + "/recipes";
    if (qs) {
      url = url + "?" + qs;
    }
    
    fetch(url)
      .then(r => r.json())
      .then(data => setRecipes(Array.isArray(data) ? data : []))
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, [search, cuisine, difficulty]);

  function clearFilters() {
    setInputValue("");
    setSearch("");
    setCuisine("");
    setDifficulty("");
  }

  const hasFilters = inputValue || cuisine || difficulty;

  return (
    <div className="min-h-screen pt-24 pb-16 px-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Recipes</p>
        <h1 className="text-4xl font-serif text-stone-800">Collection</h1>
      </div>

      <div className="mb-8">
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Search recipes..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="flex-1 px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 bg-white"
          />
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-stone-500 border border-stone-200 rounded-lg bg-white hover:bg-stone-50"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="flex gap-3 flex-wrap">
          <select
            value={cuisine}
            onChange={e => setCuisine(e.target.value)}
            className="px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-600 bg-white focus:outline-none focus:border-stone-400"
          >
            <option value="">All cuisines</option>
            {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            className="px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-600 bg-white focus:outline-none focus:border-stone-400"
          >
            <option value="">Any difficulty</option>
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="min-h-[600px]">
        {err && <p className="text-sm text-red-500 mt-4">{err}</p>}

        {loading ? (
          <p className="text-stone-400 mt-10">Loading recipes...</p>
        ) : recipes.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-stone-400">No recipes found.</p>
            <p className="text-sm text-stone-300 mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-5">
              {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
            </p>
            <div className="grid grid-cols-3 gap-6">
              {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Collection;