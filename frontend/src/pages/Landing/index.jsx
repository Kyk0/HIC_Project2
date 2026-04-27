import Hero from "./Hero";
import Features from "./Features";
import FeaturesPreview from "./FeaturesPreview";

function Landing() {
  return (
    <div className="bg-stone-50">
      {/* fixed corner glows — pinned to viewport, visible across all sections */}
      <div className="fixed -top-32 -left-32 w-96 h-96 rounded-full bg-green-200/40 blur-3xl pointer-events-none z-0" />
      <div className="fixed -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-200/50 blur-3xl pointer-events-none z-0" />

      <Hero />
      <Features />
      <FeaturesPreview />
      {/* TODO: section 4 */}
    </div>
  );
}

export default Landing;
