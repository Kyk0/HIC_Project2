import FadeIn from "../../components/FadeIn";

function Hero() {
  const dots = {
    backgroundImage:
      "radial-gradient(circle at 1px 1px, rgba(80, 80, 60, 0.1) 1px, transparent 0)",
    backgroundSize: "22px 22px",
  };

  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={dots}
    >
<div className="relative z-10 max-w-2xl px-6 text-center">
        <FadeIn>
          <p className="text-xs uppercase tracking-widest text-stone-500 mb-4">
            For home cooks
          </p>
          <h1 className="text-7xl font-serif font-bold text-stone-800 mb-5">
            Pantry
          </h1>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p className="text-lg text-stone-500 mb-8">
            Your cozy kitchen companion. Browse recipes, track what's in your fridge,
            and discover what you can cook tonight.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="flex items-center justify-center gap-3">
            <a
              href="/signup"
              className="px-6 py-3 bg-stone-800 text-stone-50 rounded-lg font-medium hover:bg-stone-700"
            >
              Get started
            </a>
            <a
              href="/browse"
              className="px-6 py-3 bg-white text-stone-700 rounded-lg font-medium border border-stone-200 hover:bg-stone-50"
            >
              Browse recipes
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export default Hero;
