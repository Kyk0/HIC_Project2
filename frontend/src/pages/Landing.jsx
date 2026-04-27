import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FadeIn from "../components/FadeIn";
import { getRecipes } from "../api/recipes";
import { useAuth } from "../context/AuthContext";

const heroImages = [
  { src: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80", alt: "Roasted vegetables", aspect: "aspect-square", offset: "" },
  { src: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80", alt: "Fresh salad bowl", aspect: "aspect-[4/5]", offset: "mt-8" },
  { src: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&q=80", alt: "Pasta plate", aspect: "aspect-[4/5]", offset: "" },
  { src: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80", alt: "Stack of pancakes", aspect: "aspect-square", offset: "mt-8" },
];

const featuredRecipes = [
  { title: "Roasted Butternut Bowl", time: "45 min", tag: "Vegetarian", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80" },
  { title: "Lemon Herb Linguine", time: "20 min", tag: "Quick & easy", img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80" },
  { title: "Garden Crunch Salad", time: "10 min", tag: "Fresh", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80" },
];

const featureCards = [
  { title: "Smart Inventory", text: "Track ingredients efficiently without hassle." },
  { title: "Recipe Match", text: "Instantly find dishes based on what you have." },
  { title: "Dynamic Shopping", text: "Automatically build your shopping list." },
  { title: "Community Cookbook", text: "Save and share recipes with everyone." },
  { title: "Personal Stats", text: "Watch your cooking journey evolve." },
];

const tabs = [
  { title: "Recipe Hub", label: "Browse beautiful recipes", ui: "recipe" },
  { title: "Profile Stats", label: "Track your progress", ui: "profile" },
  { title: "Kitchen Sync", label: "Manage your fridge", ui: "kitchen" }
];

function Landing() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [marqueeRecipes, setMarqueeRecipes] = useState([]);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    getRecipes().then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setMarqueeRecipes(data);
      } else {
        setMarqueeRecipes(featuredRecipes);
      }
    }).catch(() => {
      setMarqueeRecipes(featuredRecipes);
    });

    const interval = setInterval(() => {
      setActiveIndex(current => (current + 1) % tabs.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const duplicatedMarquee = [...marqueeRecipes, ...marqueeRecipes, ...marqueeRecipes, ...marqueeRecipes];

  const handleRecipeClick = (id) => {
    if (!token) {
      navigate("/signup");
    } else if (id) {
      navigate(`/recipe/${id}`);
    }
  };

  return (
    <>
      {/* Hero — split, content-dense */}
      <section className="bg-orange-50 px-6 pt-20 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="md:col-span-6">
            <FadeIn>
              <p className="text-xs uppercase tracking-[0.25em] text-orange-700 mb-5">For the home cook</p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-800 leading-[1.1] mb-6">
                Cook with what you <span className="italic text-orange-700">already have</span>.
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-base md:text-lg text-stone-600 leading-relaxed mb-8 max-w-md">
                Pantry tracks your ingredients, suggests recipes you can make tonight, and remembers everything for next time.
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="flex items-center gap-5">
                <Link to="/signup" className="px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition">
                  Get started
                </Link>
                <Link to="/browse" className="text-stone-700 font-medium hover:text-orange-700 transition">
                  Browse recipes →
                </Link>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.2} className="md:col-span-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                {heroImages.slice(0, 2).map((img) => (
                  <div key={img.src} className={`${img.aspect} ${img.offset} rounded-2xl overflow-hidden bg-amber-100`}>
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                {heroImages.slice(2, 4).map((img) => (
                  <div key={img.src} className={`${img.aspect} ${img.offset} rounded-2xl overflow-hidden bg-amber-100`}>
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Marquee Spinning Section */}
      <section className="overflow-hidden bg-white py-12 border-b border-stone-100 flex whitespace-nowrap">
        <div className="animate-marquee flex gap-6 px-3">
          {duplicatedMarquee.map((r, i) => (
            <button 
              key={i} 
              onClick={() => handleRecipeClick(r.id)}
              className="relative w-48 h-48 sm:w-64 sm:h-64 flex-shrink-0 rounded-2xl overflow-hidden bg-amber-50 group cursor-pointer text-left block"
            >
              <img src={r.img || r.image_url} alt={r.title || r.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent flex items-end p-4">
                <span className="text-white font-serif font-medium text-lg whitespace-normal leading-tight line-clamp-2">{r.title || r.name}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 5-Card Feature Grid */}
      <section className="bg-stone-50 px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <FadeIn inView>
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.25em] text-orange-700 mb-2">Capabilities</p>
              <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">Discover the Possibilities</h2>
              <p className="text-stone-500 max-w-lg mx-auto">Explore the powerful tools designed to make your home cooking experience seamless and enjoyable.</p>
            </div>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-fr">
            {featureCards.map((card, i) => (
              <FadeIn key={i} inView delay={i * 0.1} className={`
                  ${i === 0 ? "md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-2" : ""}
                  ${i === 1 ? "md:col-start-3 md:col-end-4 md:row-start-1 md:row-end-2" : ""}
                  ${i === 2 ? "md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-3" : ""}
                  ${i === 3 ? "md:col-start-1 md:col-end-2 md:row-start-2 md:row-end-3" : ""}
                  ${i === 4 ? "md:col-start-3 md:col-end-4 md:row-start-2 md:row-end-3" : ""}
                `}>
                <motion.div 
                  whileHover={{ scale: 1.03, y: -5 }}
                  className={`bg-white h-full border border-stone-200 rounded-3xl p-8 shadow-sm flex flex-col justify-center text-center
                    ${i === 2 ? "bg-orange-600 border-orange-500 shadow-orange-100/50" : ""}
                  `}
                >
                  <h3 className={`text-xl font-serif mb-3 ${i === 2 ? "text-white text-2xl" : "text-stone-800"}`}>{card.title}</h3>
                  <p className={`text-sm leading-relaxed ${i === 2 ? "text-orange-100" : "text-stone-500"}`}>{card.text}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Auto-Rotating UI Showcase */}
      <section className="bg-white px-6 py-24 border-t border-stone-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <FadeIn inView>
            <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-8">A Look Inside</h2>
            <div className="flex flex-col gap-4">
              {tabs.map((tab, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveIndex(i)}
                  className={`text-left p-6 rounded-2xl transition-all duration-300 border ${activeIndex === i ? "bg-orange-50 border-orange-200 shadow-sm" : "bg-white border-transparent hover:bg-stone-50"}`}
                >
                  <h3 className={`text-xl font-serif mb-1 ${activeIndex === i ? "text-orange-700" : "text-stone-700"}`}>{tab.title}</h3>
                  <p className={`text-sm ${activeIndex === i ? "text-orange-600/80" : "text-stone-400"}`}>{tab.label}</p>
                </button>
              ))}
            </div>
          </FadeIn>
          
          <FadeIn inView delay={0.2}>
            <div className="h-[450px] bg-stone-100 rounded-3xl p-6 shadow-inner relative overflow-hidden flex flex-col">
              {/* Mock Browser UI Header */}
              <div className="w-full h-8 bg-white/50 backdrop-blur rounded-full mb-6 flex items-center px-4 gap-2 border border-white/60">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="mx-auto w-32 h-2 rounded-full bg-stone-300/50"></div>
              </div>
              
              <div className="flex-1 bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 p-8 flex flex-col"
                  >
                    {activeIndex === 0 && (
                      <>
                        <div className="w-3/4 h-8 bg-stone-200 rounded-lg mb-6"></div>
                        <div className="w-full h-40 bg-amber-50 rounded-xl mb-6 flex items-center justify-center text-amber-300 text-lg font-bold">Image</div>
                        <div className="w-full h-4 bg-stone-100 rounded mb-3"></div>
                        <div className="w-5/6 h-4 bg-stone-100 rounded"></div>
                      </>
                    )}
                    {activeIndex === 1 && (
                      <>
                        <div className="flex items-center gap-5 mb-10">
                          <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-orange-400 font-bold">U</div>
                          <div>
                            <div className="w-32 h-6 bg-stone-200 rounded mb-3"></div>
                            <div className="w-24 h-4 bg-stone-100 rounded"></div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <div className="h-28 bg-stone-50 border border-stone-100 rounded-2xl"></div>
                          <div className="h-28 bg-stone-50 border border-stone-100 rounded-2xl"></div>
                        </div>
                      </>
                    )}
                    {activeIndex === 2 && (
                      <>
                        <div className="flex gap-3 mb-8">
                          <div className="w-24 h-10 bg-stone-800 rounded-lg"></div>
                          <div className="w-32 h-10 bg-stone-100 rounded-lg"></div>
                        </div>
                        <div className="flex flex-col gap-4">
                          <div className="w-full h-14 bg-stone-50 border border-stone-100 rounded-xl flex items-center px-5"><div className="w-5 h-5 bg-green-400 rounded-full"></div></div>
                          <div className="w-full h-14 bg-stone-50 border border-stone-100 rounded-xl flex items-center px-5"><div className="w-5 h-5 bg-amber-400 rounded-full"></div></div>
                          <div className="w-full h-14 bg-stone-50 border border-stone-100 rounded-xl flex items-center px-5"><div className="w-5 h-5 bg-green-400 rounded-full"></div></div>
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}

export default Landing;