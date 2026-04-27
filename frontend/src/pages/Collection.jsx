import { useState, useEffect } from "react";
import { API_URL } from "../api/index";
import RecipeCard from "../components/RecipeCard";

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

  useEffect(() => {
    const timer = setTimeout(() => setSearch(inputValue), 400);
    return () => clearTimeout(timer);
  }, [inputValue]);

  useEffect(() => {
    setLoading(true);
    setErr(null);
    
    const params = {};
    if (search) params.q = search;
    if (cuisine) params.cuisine = cuisine;
    if (difficulty) params.difficulty = difficulty;

    const qs = new URLSearchParams(params).toString();
    let url = API_URL + "/recipes";
    if (qs) url += "?" + qs;
    
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
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Hero Header */}
      <div className="bg-orange-50/60 border-b border-stone-200 pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-3">Discover</p>
          <h1 className="text-5xl font-serif text-stone-800 mb-10">The Recipe Collection</h1>
          
          <div className="max-w-3xl mx-auto bg-white p-3 rounded-2xl shadow-sm border border-stone-200 flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search recipes..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-shadow"
              />
            </div>
            
            <div className="flex gap-3">
              <select
                value={cuisine}
                onChange={e => setCuisine(e.target.value)}
                className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-600 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-shadow"
              >
                <option value="">All cuisines</option>
                {CUISINES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-600 focus:outline-none focus:ring-2 focus:ring-orange-100 transition-shadow"
              >
                <option value="">Any difficulty</option>
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2.5 text-sm text-stone-500 font-medium hover:text-stone-800 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-12">
        {err && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200 mb-8">{err}</div>}

        {loading ? (
          <div className="text-center py-20 text-stone-400 font-medium">Loading recipes...</div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-serif text-stone-800 mb-2 mt-4">No recipes found</p>
            <p className="text-stone-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        ) : (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6 border-b border-stone-200 pb-4">
              Showing {recipes.length} {recipes.length === 1 ? "result" : "results"}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Collection;