const CUISINES = ["Italian", "Mexican", "Asian", "American", "French", "Mediterranean", "Indian"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const COOKING_TIMES = [
  { label: "Under 30 min", value: "30" },
  { label: "Under 60 min", value: "60" },
  { label: "Under 2 hours", value: "120" },
];
const SERVINGS = [
  { label: "2+ servings", value: "2" },
  { label: "4+ servings", value: "4" },
  { label: "6+ servings", value: "6" },
];

function Filters({ search, setSearch, cuisine, setCuisine, difficulty, setDifficulty, maxTime, setMaxTime, maxServings, setMaxServings, onClear }) {
  const hasFilters = search || cuisine || difficulty || maxTime || maxServings;

  return (
    <div className="mb-8">
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-400 bg-white"
        />
        {hasFilters && (
          <button
            onClick={onClear}
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

        <select
          value={maxTime}
          onChange={e => setMaxTime(e.target.value)}
          className="px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-600 bg-white focus:outline-none focus:border-stone-400"
        >
          <option value="">Any cooking time</option>
          {COOKING_TIMES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>

        <select
          value={maxServings}
          onChange={e => setMaxServings(e.target.value)}
          className="px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-600 bg-white focus:outline-none focus:border-stone-400"
        >
          <option value="">Any servings</option>
          {SERVINGS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}

        </select>
      </div>
    </div>
  );
}

export default Filters;
