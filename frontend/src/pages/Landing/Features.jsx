import FadeIn from "../../components/FadeIn";
import FeatureCard from "../../components/FeatureCard";

const cards = [
  {
    title: "Browse Recipes",
    text: "Search a growing collection of dishes — filter by what you don't want.",
    pos: "col-start-1 row-start-1",
  },
  {
    title: "Smart Pantry",
    text: "Track what's on your shelves so nothing goes to waste.",
    pos: "col-start-3 row-start-1",
  },
  {
    title: "Cook Tonight",
    text: "Get recipe ideas based on what you already have at home.",
    pos: "col-start-2 row-start-2",
  },
  {
    title: "Your Cookbook",
    text: "Save favorites and post your own recipes for others to find.",
    pos: "col-start-1 row-start-3",
  },
  {
    title: "Shopping List",
    text: "Plan trips, check items off, and move them straight to the pantry.",
    pos: "col-start-3 row-start-3",
  },
];

function Features() {
  return (
    <section className="relative w-full py-24 px-6 overflow-hidden">
<div className="relative z-10 max-w-5xl mx-auto">
        <FadeIn inView>
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-green-700 mb-3">
              What you can do
            </p>
            <h2 className="text-4xl font-serif text-stone-800">
              Everything for your kitchen
            </h2>
          </div>
        </FadeIn>

        <div className="grid grid-cols-3 grid-rows-3 gap-6">
          {cards.map((c, i) => (
            <FadeIn key={c.title} inView delay={i * 0.1} className={c.pos}>
              <FeatureCard title={c.title} text={c.text} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
