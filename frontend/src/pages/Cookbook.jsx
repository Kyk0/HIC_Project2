import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {getCookbook} from "../api/cookbook";
import RecipeCard from "../components/RecipeCard";

function Cookbook() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [err, setErr] = useState(null);
    const [tab, setTab] = useState("saved");

    useEffect(() => {
        getCookbook()
            .then(d => setData(d))
            .catch(e => setErr(e.message))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return <div className="p-12 text-center text-stone-500 mt-20">Loading cookbook...</div>;
    }

    if (err) {
        return <div className="p-12 text-center text-red-500 mt-20">Error: {err}</div>;
    }

    if (!data) return null;

    const recipes = tab === "saved" ? data.saved : data.posted;

    return (
        <div className="min-h-screen bg-stone-50">
            <div className="bg-orange-50 px-6 pt-20 pb-4 border-b border-stone-200">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-start justify-between mb-5">
                        <h1 className="text-4xl font-serif text-stone-800">
                            My Cookbook
                        </h1>

                        <Link
                            to="/recipe/new"
                            className="px-5 py-2.5 bg-stone-800 text-stone-50 rounded-lg text-sm hover:bg-stone-700 mt-2"
                        >
                            New Recipe
                        </Link>
                    </div>

                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-center px-4 py-2.5 bg-amber-50 border border-amber-100 rounded-xl min-w-16">
                                <span className="text-xl font-serif text-amber-700">
                                {data.stats.saved_count}
                                </span>

                                <span className="text-xs text-amber-500 mt-0.5">saved</span>
                            </div>

                            <div className="flex flex-col items-center px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl min-w-16">
                                <span className="text-xl font-serif text-indigo-700">
                                {data.stats.posted_count}
                            </span>
                                <span className="text-xs text-indigo-500 mt-0.5">posted</span>
                            </div>

                            {data.stats.top_ingredients_saved.length > 0 && (
                                <div className="flex items-center gap-2 ml-2 pl-5 border-l border-stone-200">
                                <span className="text-xs uppercase text-stone-400 shrink-0">
                                    Top
                                </span>

                                    <div className="flex flex-wrap gap-1.5">
                                        {data.stats.top_ingredients_saved.map((ing, i) => (
                                            <span key={i} className="px-2.5 py-1 bg-orange-50 text-orange-800 rounded-lg text-xs border border-orange-100">
                                            {ing}
                                        </span>
                                        ))}
                                    </div>
                                </div>)}
                        </div>


                        <div className="flex bg-white border border-stone-200 rounded-xl p-1 shrink-0">
                            <button
                                onClick={() => setTab("saved")}
                                className={"px-5 py-2 rounded-lg text-sm " + (tab === "saved" ? "bg-orange-600 text-white" : "text-stone-500 hover:text-stone-800")}
                            >

                                Saved
                            </button>

                            <button
                                onClick={() => setTab("posted")}
                                className={"px-5 py-2 rounded-lg text-sm " + (tab === "posted" ? "bg-orange-600 text-white" : "text-stone-500 hover:text-stone-800")}
                            >
                                My Recipes
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            <div className="max-w-6xl mx-auto px-6 py-12">
                {recipes.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-stone-400 text-sm">
                            {tab === "saved" ? "No saved recipes yet." : "No recipes posted yet."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-6">
                        {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
                    </div>
                )}
            </div>
        </div>
    );
}
export default Cookbook;
