import {useState, useEffect, useRef} from "react";
import {
    getKitchen,
    getIngredients,
    addItem,
    updateItem,
    deleteItem,
    moveChecked,
    clearItems,
} from "../api/kitchen";

function Kitchen() {
    const [items, setItems] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    const [activeTab, setActiveTab] = useState("have");
    const [inputValue, setInputValue] = useState("");
    const [selectedIng, setSelectedIng] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [quantity, setQuantity] = useState("");

    const dropdownRef = useRef(null);

    useEffect(() => {
        Promise.all([getKitchen(), getIngredients()])
            .then(([kitchenData, ingData]) => {
                setItems(Array.isArray(kitchenData) ? kitchenData : []);
                setIngredients(Array.isArray(ingData) ? ingData : []);
            })
            .catch(e => setErr(e.message))
            .finally(() => setLoading(false));

        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredIngredients = ingredients
        .filter(ing => ing.display_name.toLowerCase().includes(inputValue.toLowerCase()))
        .slice(0, 8);

    const currentItems = items.filter(i => i.status === activeTab);

    const groupedItems = currentItems.reduce((acc, item) => {
        const cat = item.ingredient.category || "other";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {});

    function handleSelectIngredient(ing) {
        setSelectedIng(ing);
        setInputValue(ing.display_name);
        setShowDropdown(false);
    }

    async function handleAdd() {
        if (!selectedIng) return;
        try {
            const newItem = await addItem({
                ingredient_id: selectedIng.id,
                status: activeTab,
                quantity_text: quantity || null,
            });
            setItems(prev => [...prev, newItem]);
            setInputValue("");
            setSelectedIng(null);
            setQuantity("");
        } catch (e) {
            alert("Failed to add item");
        }
    }

    async function handleToggleCheck(item) {
        const next = !item.is_checked;
        setItems(prev => prev.map(i => (i.id === item.id ? {...i, is_checked: next} : i)));
        try {
            await updateItem(item.id, {is_checked: next});
        } catch (e) {
            setItems(prev => prev.map(i => (i.id === item.id ? {...i, is_checked: !next} : i)));
        }
    }

    async function handleDelete(id) {
        try {
            await deleteItem(id);
            setItems(prev => prev.filter(i => i.id !== id));
        } catch (e) {
            alert("Failed to delete item");
        }
    }

    async function handleMoveChecked() {
        try {
            await moveChecked();
            setItems(prev =>
                prev.map(i =>
                    i.status === "shopping" && i.is_checked
                        ? {...i, status: "have", is_checked: false}
                        : i
                )
            );
        } catch (e) {
            alert("Failed to move items");
        }
    }

    async function handleClear(onlyChecked) {
        if (!window.confirm("Clear " + (onlyChecked ? "checked" : "all") + " items?")) return;
        try {
            await clearItems({status: activeTab, only_checked: onlyChecked});
            setItems(prev =>
                prev.filter(i => {
                    if (i.status !== activeTab) return true;
                    if (onlyChecked && !i.is_checked) return true;
                    return false;
                })
            );
        } catch (e) {
            alert("Failed to clear items");
        }
    }

    if (loading)
        return <div className="p-12 text-center text-stone-500 mt-20">Loading kitchen...</div>;

    return (
        <div className="min-h-screen bg-stone-50">
            <div className="bg-orange-50 px-6 pt-20 pb-4 border-b border-stone-200">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl md:text-4xl font-serif text-stone-800">
                            My Kitchen
                        </h1>

                        <div className="flex bg-white border border-stone-200 rounded-xl p-1">
                            <button
                                onClick={() => setActiveTab("have")}
                                className={
                                    "px-5 py-2 rounded-lg text-sm " +
                                    (activeTab === "have"
                                        ? "bg-orange-600 text-white"
                                        : "text-stone-500 hover:text-stone-800")
                                }
                            >
                                Virtual Fridge
                            </button>
                            <button
                                onClick={() => setActiveTab("shopping")}
                                className={
                                    "px-5 py-2 rounded-lg text-sm " +
                                    (activeTab === "shopping"
                                        ? "bg-orange-600 text-white"
                                        : "text-stone-500 hover:text-stone-800")
                                }
                            >
                                Shopping List
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-10">
                {err && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200 mb-6">
                        {err}
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
                    <h2 className="text-lg font-serif text-stone-800 mb-4">
                        {"Add to " + (activeTab === "have" ? "Fridge" : "Shopping List")}
                    </h2>
                    <div className="flex gap-3" ref={dropdownRef}>
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search ingredients..."
                                value={inputValue}
                                onChange={e => {
                                    setInputValue(e.target.value);
                                    setSelectedIng(null);
                                    setShowDropdown(true);
                                }}
                                onFocus={() => setShowDropdown(true)}
                                className="w-full px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
                            />
                            {showDropdown && inputValue && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                    {filteredIngredients.length > 0 ? (
                                        filteredIngredients.map(ing => (
                                            <button
                                                key={ing.id}
                                                onClick={() => handleSelectIngredient(ing)}
                                                className="w-full text-left px-4 py-2 text-sm text-stone-700 hover:bg-stone-50 border-b border-stone-100 last:border-0"
                                            >
                                                {ing.display_name}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-stone-400 text-center">
                                            No matching ingredients
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <input
                            type="text"
                            placeholder="Quantity"
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                            className="w-28 px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400 placeholder-stone-400"
                        />
                        <button
                            onClick={handleAdd}
                            disabled={!selectedIng}
                            className="px-5 py-2 bg-stone-800 text-white rounded-lg text-sm hover:bg-stone-700 disabled:opacity-40"
                        >
                            Add
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-stone-200 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-serif text-stone-800">
                            {activeTab === "have" ? "What you have" : "What to buy"}
                        </h2>
                        <div className="flex gap-2">
                            {activeTab === "shopping" && currentItems.some(i => i.is_checked) && (
                                <button
                                    onClick={handleMoveChecked}
                                    className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-xs hover:bg-orange-200"
                                >
                                    Move checked to Fridge
                                </button>
                            )}
                            {currentItems.length > 0 && (
                                <button
                                    onClick={() => handleClear(false)}
                                    className="px-3 py-1.5 bg-stone-100 text-stone-600 rounded-lg text-xs hover:bg-stone-200"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>

                    {currentItems.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="font-serif text-stone-600 text-lg mb-1">
                                {activeTab === "have"
                                    ? "Your fridge is empty"
                                    : "Shopping list is empty"}
                            </p>
                            <p className="text-stone-400 text-sm">
                                Add ingredients using the search above.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-8">
                            {Object.keys(groupedItems)
                                .sort()
                                .map(cat => (
                                    <div key={cat}>
                                        <h3 className="text-xs uppercase tracking-widest text-stone-400 mb-3 border-b border-stone-100 pb-2">
                                            {cat}
                                        </h3>
                                        <div className="flex flex-col gap-2">
                                            {groupedItems[cat].map(item => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center gap-3 group"
                                                >
                                                    <button
                                                        onClick={() => handleToggleCheck(item)}
                                                        className={
                                                            "w-5 h-5 rounded flex items-center justify-center flex-shrink-0 " +
                                                            (item.is_checked
                                                                ? "bg-orange-500 text-white"
                                                                : "border border-stone-300 bg-white hover:border-orange-400")
                                                        }
                                                    >
                                                        {item.is_checked && (
                                                            <svg
                                                                className="w-3 h-3"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={3}
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                        )}
                                                    </button>

                                                    <span
                                                        className={
                                                            "flex-1 text-sm " +
                                                            (item.is_checked
                                                                ? "text-stone-400 line-through"
                                                                : "text-stone-700")
                                                        }
                                                    >
                                                        {item.ingredient.display_name}
                                                    </span>

                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-stone-300 hover:text-red-400 opacity-0 group-hover:opacity-100"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                            className="w-4 h-4"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Kitchen;
