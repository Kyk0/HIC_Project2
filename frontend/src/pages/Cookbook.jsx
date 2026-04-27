import { useState, useEffect } from "react";
import { getCookbook } from "../api/cookbook";
import RecipeCard from "../components/RecipeCard";

function Cookbook() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [activeTab, setActiveTab] = useState("saved"); // "saved" | "posted"

  useEffect(() => {
    getCookbook()
      .then(d => setData(d))
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-12 text-center text-stone-500 mt-20">Loading cookbook...</div>;
  if (err) return <div className="p-12 text-center text-red-500 mt-20">Error: {err}</div>;
  if (!data) return null;

  const recipes = activeTab === "saved" ? data.saved : data.posted;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-orange-50 px-6 pt-28 border-b border-orange-200">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-stone-800 mb-8">My Cookbook</h1>
          
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-white/80 backdrop-blur p-5 rounded-2xl border border-orange-200/60 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-serif text-stone-800 mb-1">{data.stats.saved_count}</span>
              <span className="text-xs uppercase tracking-widest text-orange-700">Saved</span>
            </div>
            <div className="bg-white/80 backdrop-blur p-5 rounded-2xl border border-orange-200/60 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-serif text-stone-800 mb-1">{data.stats.posted_count}</span>
              <span className="text-xs uppercase tracking-widest text-orange-700">Authored</span>
            </div>
            <div className="bg-white/80 backdrop-blur p-5 rounded-2xl border border-orange-200/60 shadow-sm md:col-span-2 flex flex-col justify-center">
              <span className="text-xs uppercase tracking-widest text-orange-700 mb-2">Top Ingredients</span>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {data.stats.top_ingredients_saved.length > 0 ? (
                  data.stats.top_ingredients_saved.map((ing, i) => (
                    <span key={i} className="px-3 py-1 bg-orange-100/50 text-orange-800 rounded-lg text-xs font-medium border border-orange-200/50">
                      {ing}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-stone-500 italic">No ingredients saved yet.</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-start gap-8 -mb-[1px]">
            <button
              onClick={() => setActiveTab("saved")}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === "saved" ? "border-orange-800 text-orange-800" : "border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300"
              }`}
            >
              Saved Recipes
            </button>
            <button
              onClick={() => setActiveTab("posted")}
              className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === "posted" ? "border-orange-800 text-orange-800" : "border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300"
              }`}
            >
              My Recipes
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {recipes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 border-dashed">
            <p className="text-xl font-serif text-stone-800 mb-2">Nothing here yet</p>
            <p className="text-stone-500">
              {activeTab === "saved" ? "You haven't saved any recipes to your cookbook." : "You haven't posted any recipes."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export default Cookbook;
