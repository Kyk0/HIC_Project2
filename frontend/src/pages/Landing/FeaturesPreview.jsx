import FadeIn from "../../components/FadeIn";

const items = [
  {
    title: "Save recipes",
    desc: "Bookmark any recipe to your personal cookbook. Come back to it whenever you want.",
  },
  {
    title: "Browse & discover",
    desc: "Search by name, filter by cuisine, or exclude ingredients you'd rather skip.",
  },
  {
    title: "Post your own",
    desc: "Write up your recipes and share them with everyone on the platform.",
  },
  {
    title: "Track your pantry",
    desc: "Log what's in your fridge and shelves so you always know what you're working with.",
  },
  {
    title: "Cook with what you have",
    desc: "Pantry matches you to recipes based on ingredients you already own.",
  },
  {
    title: "Build a shopping list",
    desc: "Add missing ingredients from any recipe. Check them off as you shop.",
  },
];

function FeaturesPreview() {
  return (
    <section className="w-full py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <FadeIn inView>
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">
              How it works
            </p>
            <h2 className="text-4xl font-serif text-stone-800 mb-4">
              Simple tools, useful every day
            </h2>
            <p className="text-stone-500 max-w-xl mx-auto">
              No complicated setup. Just open Pantry and start cooking.
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-2 gap-5">
          {items.map((item, i) => (
            <FadeIn key={item.title} inView delay={i * 0.08}>
              <div className="flex gap-4 p-6 bg-white rounded-xl border border-amber-100">
                <span className="text-2xl font-serif text-amber-300 select-none w-8 shrink-0">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-stone-800 mb-1">{item.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesPreview;
