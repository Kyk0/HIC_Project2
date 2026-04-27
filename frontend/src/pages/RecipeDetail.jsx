import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getRecipe, deleteRecipe } from "../api/recipes";
import { getComments, postComment, deleteComment, updateComment } from "../api/comments";
import { getCookbook, saveRecipe, unsaveRecipe } from "../api/cookbook";
import CheckIcon from "../assets/CheckIcon";
import CartIcon from "../assets/CartIcon";
import { getKitchen, addItem } from "../api/kitchen";
import { useAuth } from "../context/AuthContext";

function RecipeDetail() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [newComment, setNewComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentBody, setEditCommentBody] = useState("");

  const [kitchenItems, setKitchenItems] = useState([]);
  const [addingMissing, setAddingMissing] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getRecipe(id),
      getComments(id),
      token ? getCookbook() : Promise.resolve(null),
      token ? getKitchen() : Promise.resolve(null)
    ])
      .then(([recipeData, commentsData, cookbookData, kitchenData]) => {
        setRecipe(recipeData);
        setComments(commentsData);
        if (cookbookData && cookbookData.saved) {
          const isSaved = cookbookData.saved.some(r => r.id === parseInt(id));
          setSaved(isSaved);
        }
        if (kitchenData) {
          setKitchenItems(Array.isArray(kitchenData) ? kitchenData : []);
        }
      })
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
  }, [id, token]);

  async function handleToggleSave() {
    if (!token) return navigate("/login");
    try {
      if (saved) {
        await unsaveRecipe(id);
        setSaved(false);
      } else {
        await saveRecipe(id);
        setSaved(true);
      }
    } catch (e) {
      alert("Failed to update cookbook");
    }
  }

  async function handleDeleteRecipe() {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await deleteRecipe(id);
      navigate("/");
    } catch (e) {
      alert("Failed to delete recipe");
    }
  }

  async function handlePostComment(e) {
    e.preventDefault();
    if (!newComment.trim()) return;
    setPostingComment(true);
    try {
      const created = await postComment(id, newComment);
      if (created.id) {
        setComments(prev => [...prev, created]);
        setNewComment("");
      }
    } catch (e) {
      alert("Failed to post comment");
    } finally {
      setPostingComment(false);
    }
  }

  function getIngredientStatus(ing) {
    if (!kitchenItems || !ing.ingredient) return null;
    const item = kitchenItems.find(k => k.ingredient.id === ing.ingredient.id);
    return item ? item.status : null;
  }

  async function handleAddMissingToShoppingList() {
    if (!token) return navigate("/login");
    setAddingMissing(true);
    
    const missing = recipe.ingredients.filter(ing => {
      if (!ing.ingredient) return false;
      const status = getIngredientStatus(ing);
      return status !== "have" && status !== "shopping";
    });

    if (missing.length === 0) {
      alert("You already have all ingredients or they are in your shopping list!");
      setAddingMissing(false);
      return;
    }

    try {
      const promises = missing.map(ing => 
        addItem({
          ingredient_id: ing.ingredient.id,
          status: "shopping",
          quantity_text: ing.quantity_text || null
        })
      );
      
      const newItems = await Promise.all(promises);
      setKitchenItems(prev => [...prev, ...newItems]);
      
    } catch (e) {
      alert("Failed to add some items to shopping list");
    } finally {
      setAddingMissing(false);
    }
  }

  function handleStartEdit(comment) {
    setEditCommentId(comment.id);
    setEditCommentBody(comment.body);
  }

  function handleCancelEdit() {
    setEditCommentId(null);
    setEditCommentBody("");
  }

  async function handleSaveEdit(commentId) {
    if (!editCommentBody.trim()) return;
    try {
      const updated = await updateComment(commentId, editCommentBody);
      if (updated.id) {
        setComments(prev => prev.map(c => c.id === commentId ? updated : c));
        handleCancelEdit();
      }
    } catch (e) {
      alert("Failed to update comment");
    }
  }

  async function handleDeleteComment(commentId) {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (e) {
      alert("Failed to delete comment");
    }
  }

  if (loading) return <div className="p-8 text-center text-stone-500 mt-20">Loading recipe...</div>;
  if (err || !recipe) return <div className="p-8 text-center text-red-500 mt-20">Failed to load recipe: {err}</div>;

  const isOwner = user && recipe.author_id === user.id;

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-orange-50 border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 md:py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {recipe.cuisine && <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium uppercase tracking-wider">{recipe.cuisine}</span>}
              {recipe.difficulty && <span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-medium uppercase tracking-wider">{recipe.difficulty}</span>}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif text-stone-800 mb-6 leading-tight">{recipe.name}</h1>
            
            <div className="flex flex-wrap gap-6 text-sm text-stone-500 mb-8">
              {recipe.prep_time_minutes && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-stone-400">Prep</span>
                  <span className="font-medium text-stone-700">{recipe.prep_time_minutes} mins</span>
                </div>
              )}
              {recipe.cook_time_minutes && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-stone-400">Cook</span>
                  <span className="font-medium text-stone-700">{recipe.cook_time_minutes} mins</span>
                </div>
              )}
              {recipe.servings && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-stone-400">Servings</span>
                  <span className="font-medium text-stone-700">{recipe.servings}</span>
                </div>
              )}
              {recipe.calories_per_serving && (
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-widest text-stone-400">Calories</span>
                  <span className="font-medium text-stone-700">{recipe.calories_per_serving} / serv</span>
                </div>
              )}
            </div>

            <div className="flex gap-3 items-center">
              <button
                onClick={handleToggleSave}
                title={saved ? "Remove from Cookbook" : "Save to Cookbook"}
                className={"p-2.5 rounded-lg border transition-colors " + (saved ? "bg-orange-100 border-orange-200 text-orange-600" : "bg-white border-stone-200 text-stone-400 hover:text-stone-700")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
              </button>

              {isOwner && (
                <>
                  <Link to={`/recipe/${id}/edit`} className="px-4 py-2 bg-white border border-stone-200 text-stone-700 rounded-lg text-sm hover:bg-stone-50 transition-colors">
                    Edit
                  </Link>
                  <button onClick={handleDeleteRecipe} className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors">
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
          
          {/* Image */}
          <div className="rounded-2xl overflow-hidden shadow-lg bg-stone-100 aspect-[4/3] flex items-center justify-center">
            {recipe.image_url ? (
              <img src={recipe.image_url} alt={recipe.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-stone-400 font-medium">No image</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Ingredients (Sidebar) */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm sticky top-6">
            <h2 className="text-xl font-serif text-stone-800 mb-6">Ingredients</h2>
            <ul className="flex flex-col gap-2">
              {recipe.ingredients?.map((ing, i) => {
                const status = getIngredientStatus(ing);
                const isHave = status === "have";
                const isShopping = status === "shopping";
                
                return (
                  <li key={i} className={`flex gap-3 text-sm items-start p-2.5 rounded-lg transition-colors ${
                    isHave ? "bg-green-50 text-green-800 border border-green-200/60 shadow-sm" :
                    isShopping ? "bg-amber-50 text-amber-800 border border-amber-200/60 shadow-sm" :
                    "text-stone-600 border border-transparent"
                  }`}>
                    <span className={isHave ? "text-green-600 mt-0.5" : isShopping ? "text-amber-600 mt-0.5" : "text-orange-400 mt-0.5"}>
                      {isHave ? (
                        <CheckIcon />
                      ) : isShopping ? (
                        <CartIcon />
                      ) : (
                        "•"
                      )}
                    </span>
                    <span className="font-medium">{typeof ing === 'object' ? ing.original_text : ing}</span>
                  </li>
                );
              })}
              {!recipe.ingredients?.length && <p className="text-sm text-stone-400">No ingredients listed.</p>}
            </ul>

            {token && recipe.ingredients?.length > 0 && (
              <button 
                onClick={handleAddMissingToShoppingList}
                disabled={addingMissing}
                className="mt-6 w-full py-2.5 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200 transition-colors disabled:opacity-50"
              >
                {addingMissing ? "Adding..." : "+ Add missing to shopping list"}
              </button>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border border-stone-200 p-8 md:p-10 shadow-sm mb-12">
            <h2 className="text-2xl font-serif text-stone-800 mb-8">Instructions</h2>
            <ol className="flex flex-col gap-8">
              {recipe.instructions?.map((inst, i) => (
                <li key={i} className="flex gap-5 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm">
                    {typeof inst === 'object' ? inst.step_number || i + 1 : i + 1}
                  </span>
                  <p className="text-stone-700 leading-relaxed mt-1">
                    {typeof inst === 'object' ? inst.text : inst}
                  </p>
                </li>
              ))}
              {!recipe.instructions?.length && <p className="text-sm text-stone-400">No instructions listed.</p>}
            </ol>
          </div>

          {/* Tags */}
          {(recipe.tags?.length > 0 || recipe.meal_types?.length > 0) && (
            <div className="mb-12 flex gap-2 flex-wrap">
              {recipe.tags?.map((tag, i) => (
                <span key={`tag-${i}`} className="px-3 py-1 bg-stone-200 text-stone-600 rounded-lg text-xs font-medium">#{tag}</span>
              ))}
              {recipe.meal_types?.map((type, i) => (
                <span key={`meal-${i}`} className="px-3 py-1 bg-stone-200 text-stone-600 rounded-lg text-xs font-medium">{type}</span>
              ))}
            </div>
          )}

          {/* Comments */}
          <div className="border-t border-stone-200 pt-8">
            <h3 className="text-xl font-serif text-stone-800 mb-6">Comments ({comments?.length || 0})</h3>

            {token ? (
              <form onSubmit={handlePostComment} className="mb-6">
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Leave a comment..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-orange-300 resize-none h-16 mb-2"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={postingComment || !newComment.trim()}
                    className="px-4 py-1.5 bg-stone-800 text-white rounded-lg text-xs hover:bg-stone-700 disabled:opacity-50"
                  >
                    {postingComment ? "Posting..." : "Post"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-6 p-4 bg-stone-100 rounded-xl text-center">
                <p className="text-stone-500 text-xs mb-2">Log in to leave a comment.</p>
                <Link to="/login" className="text-orange-600 text-xs hover:underline">Log in</Link>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {comments?.map((comment, i) => {
                const isCommentOwner = user && comment.user_id === user.id;
                const isEditing = editCommentId === comment.id;
                return (
                  <div key={i} className="bg-white px-4 py-3 rounded-lg border border-stone-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-stone-700">{comment.username || "User"}</span>
                      {isCommentOwner && !isEditing && (
                        <div className="flex gap-2">
                          <button onClick={() => handleStartEdit(comment)} className="text-xs text-stone-400 hover:text-stone-600">Edit</button>
                          <button onClick={() => handleDeleteComment(comment.id)} className="text-xs text-stone-400 hover:text-red-500">Delete</button>
                        </div>
                      )}
                    </div>
                    {isEditing ? (
                      <div>
                        <textarea
                          value={editCommentBody}
                          onChange={e => setEditCommentBody(e.target.value)}
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs text-stone-800 focus:outline-none focus:border-orange-300 resize-none h-16 mb-2"
                        />
                        <div className="flex justify-end gap-2">
                          <button onClick={handleCancelEdit} className="px-3 py-1 bg-stone-100 text-stone-600 rounded text-xs hover:bg-stone-200">Cancel</button>
                          <button onClick={() => handleSaveEdit(comment.id)} disabled={!editCommentBody.trim()} className="px-3 py-1 bg-stone-800 text-white rounded text-xs hover:bg-stone-700 disabled:opacity-50">Save</button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-stone-500 text-xs leading-relaxed">{comment.body}</p>
                    )}
                  </div>
                );
              })}
              {(!comments || comments.length === 0) && <p className="text-stone-400 text-xs italic">No comments yet.</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
