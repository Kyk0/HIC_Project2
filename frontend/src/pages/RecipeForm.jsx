import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRecipe, createRecipe, updateRecipe } from "../api/recipes";

function RecipeForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    image_url: "",
    cuisine: "",
    difficulty: "",
    prep_time_minutes: "",
    cook_time_minutes: "",
    servings: "",
    calories_per_serving: "",
    tags: "",
    meal_types: ""
  });

  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);

  useEffect(() => {
    if (isEdit) {
      getRecipe(id)
        .then(data => {
          setFormData({
            name: data.name || "",
            image_url: data.image_url || "",
            cuisine: data.cuisine || "",
            difficulty: data.difficulty || "",
            prep_time_minutes: data.prep_time_minutes || "",
            cook_time_minutes: data.cook_time_minutes || "",
            servings: data.servings || "",
            calories_per_serving: data.calories_per_serving || "",
            tags: data.tags ? data.tags.join(", ") : "",
            meal_types: data.meal_types ? data.meal_types.join(", ") : ""
          });
          setIngredients(data.ingredients?.length ? data.ingredients.map(i => typeof i === 'object' ? (i.original_text || "") : i) : [""]);
          setInstructions(data.instructions?.length ? data.instructions.map(i => typeof i === 'object' ? (i.text || "") : i) : [""]);
        })
        .catch(e => setErr(e.message))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  function handleChange(e) {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleIngredientChange(index, value) {
    const newArr = [...ingredients];
    newArr[index] = value;
    setIngredients(newArr);
  }

  function handleInstructionChange(index, value) {
    const newArr = [...instructions];
    newArr[index] = value;
    setInstructions(newArr);
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErr("Image is too large (max 5MB).");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image_url: reader.result }));
      setErr(null);
    };
    reader.onerror = () => {
      setErr("Failed to read the image file.");
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    setSaving(true);

    const payload = {
      ...formData,
      prep_time_minutes: formData.prep_time_minutes ? parseInt(formData.prep_time_minutes) : null,
      cook_time_minutes: formData.cook_time_minutes ? parseInt(formData.cook_time_minutes) : null,
      servings: formData.servings ? parseInt(formData.servings) : null,
      calories_per_serving: formData.calories_per_serving ? parseInt(formData.calories_per_serving) : null,
      ingredients: ingredients.filter(i => i.trim() !== ""),
      instructions: instructions.filter(i => i.trim() !== ""),
      tags: formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
      meal_types: formData.meal_types ? formData.meal_types.split(",").map(t => t.trim()).filter(Boolean) : []
    };

    if (!payload.name || payload.ingredients.length === 0 || payload.instructions.length === 0) {
      setErr("Name, ingredients, and instructions are required.");
      setSaving(false);
      return;
    }

    try {
      if (isEdit) {
        const updated = await updateRecipe(id, payload);
        if (updated.id) {
          navigate(`/recipe/${updated.id}`);
        } else {
          setErr(updated.detail || "Failed to update recipe.");
        }
      } else {
        const created = await createRecipe(payload);
        if (created.id) {
          navigate(`/recipe/${created.id}`);
        } else {
          setErr(created.detail || "Failed to create recipe.");
        }
      }
    } catch (e) {
      setErr("Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 text-stone-500 text-center mt-20">Loading recipe details...</div>;

  return (
    <div className="flex-1 bg-orange-50/60 pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-serif text-stone-800">
            {isEdit ? "Edit Recipe" : "Create a Recipe"}
          </h1>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-stone-500 hover:text-stone-800 text-sm font-medium transition-colors"
          >
            ← Back
          </button>
        </div>

        {err && <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{err}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          
          {/* Card: Image Upload */}
          <div className="bg-white rounded-xl border border-stone-200 p-8 shadow-sm">
            <h2 className="text-xl font-serif text-stone-800 mb-4">Recipe Photo</h2>
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-stone-200 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors">
              {formData.image_url ? (
                <div className="relative w-full max-w-sm rounded-lg overflow-hidden border border-stone-200">
                  <img src={formData.image_url} alt="Recipe Preview" className="w-full h-auto object-cover" />
                  <button type="button" onClick={() => setFormData(f => ({ ...f, image_url: "" }))} className="absolute top-2 right-2 w-8 h-8 bg-white text-stone-700 rounded-full flex items-center justify-center shadow hover:bg-stone-100 font-bold text-xs">
                    X
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-sm font-medium">Upload Photo</span>
                  <p className="text-stone-600 mb-4 text-sm">Add a photo of your finished dish</p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 shadow-sm transition-colors"
                  >
                    Select an Image
                  </button>
                  <p className="mt-3 text-xs text-stone-400">Or paste an image URL below</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            
            {!formData.image_url && (
              <div className="mt-4">
                <label className="block text-sm text-stone-500 mb-1">Image URL (Optional)</label>
                <input
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-orange-300 transition-colors"
                />
              </div>
            )}
          </div>

          {/* Card: Basic Details */}
          <div className="bg-white rounded-xl border border-stone-200 p-8 shadow-sm">
            <h2 className="text-xl font-serif text-stone-800 mb-6">Basic Details</h2>
            
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-sm text-stone-600 mb-1">Recipe Name <span className="text-red-400">*</span></label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Grandma's Famous Lasagna"
                  required
                  className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-orange-300 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-stone-600 mb-1">Cuisine</label>
                  <input
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleChange}
                    placeholder="e.g. Italian"
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-orange-300 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-stone-600 mb-1">Difficulty</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-orange-300 transition-colors bg-white"
                  >
                    <option value="">Select difficulty...</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 pt-2">
                <div>
                  <label className="block text-sm text-stone-600 mb-1">Prep (mins)</label>
                  <input
                    type="number"
                    name="prep_time_minutes"
                    value={formData.prep_time_minutes}
                    onChange={handleChange}
                    placeholder="15"
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-orange-300 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-stone-600 mb-1">Cook (mins)</label>
                  <input
                    type="number"
                    name="cook_time_minutes"
                    value={formData.cook_time_minutes}
                    onChange={handleChange}
                    placeholder="45"
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-orange-300 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-stone-600 mb-1">Servings</label>
                  <input
                    type="number"
                    name="servings"
                    value={formData.servings}
                    onChange={handleChange}
                    placeholder="4"
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-orange-300 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-stone-600 mb-1">Calories</label>
                  <input
                    type="number"
                    name="calories_per_serving"
                    value={formData.calories_per_serving}
                    onChange={handleChange}
                    placeholder="350"
                    className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-orange-300 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card: Ingredients & Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Ingredients */}
            <div className="bg-white rounded-xl border border-stone-200 p-8 shadow-sm flex flex-col">
              <h2 className="text-xl font-serif text-stone-800 mb-6 flex items-center gap-2">
                Ingredients <span className="text-red-400 text-sm">*</span>
              </h2>
              <div className="flex-1 flex flex-col gap-3">
                {ingredients.map((ing, i) => (
                  <div key={i} className="flex gap-2 items-start group">
                    <span className="text-stone-400 font-mono text-xs pt-3 w-4">{i + 1}.</span>
                    <input
                      value={ing}
                      onChange={(e) => handleIngredientChange(i, e.target.value)}
                      placeholder="e.g. 2 cups flour"
                      className="flex-1 px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-orange-300 transition-colors"
                    />
                    <button type="button" onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))} className="p-2 text-stone-400 hover:text-red-500 font-bold text-xs">
                      X
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setIngredients([...ingredients, ""])}
                className="mt-4 self-start px-4 py-2 bg-stone-50 border border-stone-200 text-stone-600 rounded-lg text-sm font-medium hover:bg-stone-100 hover:text-stone-800 transition-colors"
              >
                + Add Ingredient
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-xl border border-stone-200 p-8 shadow-sm flex flex-col">
              <h2 className="text-xl font-serif text-stone-800 mb-6 flex items-center gap-2">
                Instructions <span className="text-red-400 text-sm">*</span>
              </h2>
              <div className="flex-1 flex flex-col gap-3">
                {instructions.map((inst, i) => (
                  <div key={i} className="flex gap-2 items-start group">
                    <span className="text-stone-400 font-mono text-xs pt-3 w-4">{i + 1}.</span>
                    <textarea
                      value={inst}
                      onChange={(e) => handleInstructionChange(i, e.target.value)}
                      placeholder="Describe this step..."
                      className="flex-1 px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-orange-300 transition-colors min-h-[4.5rem] resize-y"
                    />
                    <button type="button" onClick={() => setInstructions(instructions.filter((_, idx) => idx !== i))} className="p-2 text-stone-400 hover:text-red-500 font-bold text-xs">
                      X
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setInstructions([...instructions, ""])}
                className="mt-4 self-start px-4 py-2 bg-stone-50 border border-stone-200 text-stone-600 rounded-lg text-sm font-medium hover:bg-stone-100 hover:text-stone-800 transition-colors"
              >
                + Add Step
              </button>
            </div>
          </div>

          {/* Card: Classification */}
          <div className="bg-white rounded-xl border border-stone-200 p-8 shadow-sm">
            <h2 className="text-xl font-serif text-stone-800 mb-6">Tags & Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-stone-600 mb-1">Tags</label>
                <input
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="e.g. healthy, vegan, spicy (comma separated)"
                  className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-orange-300 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-stone-600 mb-1">Meal Types</label>
                <input
                  name="meal_types"
                  value={formData.meal_types}
                  onChange={handleChange}
                  placeholder="e.g. dinner, breakfast, snack (comma separated)"
                  className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-orange-300 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-white text-stone-600 font-medium rounded-lg hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Publish Recipe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecipeForm;
