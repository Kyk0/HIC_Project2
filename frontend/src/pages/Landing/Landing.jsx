import { Link } from "react-router-dom";
import FadeIn from "../../components/FadeIn";

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80",
    alt: "Roasted vegetables",
    aspect: "aspect-square",
    offset: "",
  },
  {
    src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80",
    alt: "Fresh salad bowl",
    aspect: "aspect-[4/5]",
    offset: "mt-8",
  },
  {
    src: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=80",
    alt: "Pasta plate",
    aspect: "aspect-[4/5]",
    offset: "",
  },
  {
    src: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80",
    alt: "Stack of pancakes",
    aspect: "aspect-square",
    offset: "mt-8",
  },
];

const featuredRecipes = [
  {
    title: "Roasted Butternut Bowl",
    time: "45 min",
    tag: "Vegetarian",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
  },
  {
    title: "Lemon Herb Linguine",
    time: "20 min",
    tag: "Quick & easy",
    img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80",
  },
  {
    title: "Garden Crunch Salad",
    time: "10 min",
    tag: "Fresh",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  },
];

const features = [
  {
    icon: "🥬",
    title: "Smart pantry",
    text: "Track what's on your shelves so nothing goes to waste.",
  },
  {
    icon: "📖",
    title: "Your cookbook",
    text: "Save favorites and post recipes others can find.",
  },
  {
    icon: "🛒",
    title: "Shopping lists",
    text: "Plan trips, check off items, send straight to the pantry.",
  },
  {
    icon: "🍳",
    title: "Cook tonight",
    text: "Get matched to recipes from ingredients you already have.",
  },
];

const steps = [
  {
    n: "01",
    title: "Stock your pantry",
    text: "Tell Pantry what's in your fridge and shelves — takes a minute.",
  },
  {
    n: "02",
    title: "Browse or get matched",
    text: "Search recipes by name, or let us suggest dishes you can cook now.",
  },
  {
    n: "03",
    title: "Cook, save, repeat",
    text: "Bookmark what works, post your own, build your shopping list.",
  },
];

function Landing() {
  return (
    <>
      {/* Hero — split, content-dense */}
      <section className="bg-orange-50 px-6 pt-20 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="md:col-span-6">
            <FadeIn>
              <p className="text-xs uppercase tracking-[0.25em] text-orange-700 mb-5">
                For the home cook
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-800 leading-[1.1] mb-6">
                Cook with what you{" "}
                <span className="italic text-orange-700">already have</span>.
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-base md:text-lg text-stone-600 leading-relaxed mb-8 max-w-md">
                Pantry tracks your ingredients, suggests recipes you can make
                tonight, and remembers everything for next time.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="flex items-center gap-5">
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition"
                >
                  Get started
                </Link>
                <Link
                  to="/browse"
                  className="text-stone-700 font-medium hover:text-orange-700 transition"
                >
                  Browse recipes →
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Image collage */}
          <FadeIn delay={0.2} className="md:col-span-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                {heroImages.slice(0, 2).map((img) => (
                  <div
                    key={img.src}
                    className={`${img.aspect} ${img.offset} rounded-2xl overflow-hidden bg-amber-100`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {heroImages.slice(2, 4).map((img) => (
                  <div
                    key={img.src}
                    className={`${img.aspect} ${img.offset} rounded-2xl overflow-hidden bg-amber-100`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Featured recipes — looks like the product */}
      <section className="bg-white px-6 py-20 border-y border-stone-100">
        <div className="max-w-6xl mx-auto">
          <FadeIn inView>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-orange-700 mb-2">
                  On the menu
                </p>
                <h2 className="text-3xl md:text-4xl font-serif text-stone-800">
                  A taste of what's inside
                </h2>
              </div>
              <Link
                to="/browse"
                className="hidden md:block text-sm text-stone-600 hover:text-orange-700 transition"
              >
                See all recipes →
              </Link>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredRecipes.map((r, i) => (
              <FadeIn key={r.title} inView delay={i * 0.1}>
                <article className="group cursor-pointer">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-amber-100 mb-4">
                    <img
                      src={r.img}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5">
                    <span>{r.time}</span>
                    <span>·</span>
                    <span className="text-orange-700">{r.tag}</span>
                  </div>
                  <h3 className="font-serif text-lg text-stone-800">{r.title}</h3>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Features — compact 4-up */}
      <section className="bg-orange-50/60 px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <FadeIn inView>
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.25em] text-orange-700 mb-2">
                What's inside
              </p>
              <h2 className="text-3xl md:text-4xl font-serif text-stone-800">
                Everything for your kitchen
              </h2>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <FadeIn key={f.title} inView delay={i * 0.08}>
                <div className="bg-white rounded-xl p-6 border border-amber-100 h-full">
                  <div className="w-11 h-11 rounded-lg bg-amber-100 flex items-center justify-center text-2xl mb-4">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-stone-800 mb-1.5">{f.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{f.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — three lean steps */}
      <section className="bg-white px-6 py-20 border-t border-stone-100">
        <div className="max-w-5xl mx-auto">
          <FadeIn inView>
            <div className="text-center mb-14">
              <p className="text-xs uppercase tracking-[0.25em] text-orange-700 mb-2">
                How it works
              </p>
              <h2 className="text-3xl md:text-4xl font-serif text-stone-800">
                Three steps to dinner
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <FadeIn key={s.n} inView delay={i * 0.1}>
                <div className="border-l-2 border-orange-300 pl-5">
                  <span className="text-xs font-mono text-orange-600 tracking-wider">
                    {s.n}
                  </span>
                  <h3 className="font-serif text-xl text-stone-800 mt-1 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{s.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Landing;