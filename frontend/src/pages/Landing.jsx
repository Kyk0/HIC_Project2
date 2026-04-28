import {Link, useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import {motion, AnimatePresence} from "framer-motion";
import FadeIn from "../components/FadeIn";
import {getRecipes, getRecipe} from "../api/recipes";
import {useAuth} from "../context/AuthContext";
import collectionImg from "../assets/collection.png";
import statsImg from "../assets/satts.png";
import shoplistImg from "../assets/shoplist.png";

const featureCards = [
    {title: "Smart Inventory", text: "Keep track of what you have so nothing goes to waste."},
    {title: "Recipe Match", text: "Find recipes based on what's already in your kitchen."},
    {title: "Community Cookbook", text: "Save and share recipes with the whole community."},
    {title: "Personal Stats", text: "See what ingredients you use most and how you cook."},
];

const tabs = [
    {title: "Recipe Hub", label: "Browse and search recipes", img: collectionImg},
    {title: "Profile Stats", label: "Track what you cook", img: statsImg},
    {title: "Kitchen Sync", label: "Your fridge and shopping list", img: shoplistImg},
];

function Landing() {
    const [activeTab, setActiveTab] = useState(0);
    const [marquee, setMarquee] = useState([]);
    const [heroImgs, setHeroImgs] = useState([]);
    const nav = useNavigate();
    const {token} = useAuth();

    useEffect(() => {
        const ids = [];
        while (ids.length < 4) {
            const id = Math.floor(Math.random() * 47) + 2;
            if (!ids.includes(id)) ids.push(id);
        }
        Promise.all(ids.map(id => getRecipe(id).catch(() => null))).then(res => {
            const valid = res.filter(r => r && r.image_url);
            if (valid.length >= 2) setHeroImgs(valid.slice(0, 4));
        });

        getRecipes().then(data => {
            if (Array.isArray(data) && data.length > 0) setMarquee(data);
        });

        const t = setInterval(() => {
            setActiveTab(cur => (cur + 1) % tabs.length);
        }, 4000);
        return () => clearInterval(t);
    }, []);

    const duped = [...marquee, ...marquee, ...marquee, ...marquee];

    function onRecipeClick(id) {
        if (!token) {
            nav("/signup");
        } else if (id) {
            nav("/recipe/" + id);
        }
    }

    return (
        <>
            <section className="bg-orange-50 px-6 pt-20 pb-24">
                <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-10 lg:gap-16 items-center">
                    <div className="md:col-span-6">
                        <FadeIn>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-800 leading-tight mb-6">
                                What can you cook tonight?
                            </h1>
                        </FadeIn>
                        <FadeIn delay={0.1}>
                            <p className="text-base md:text-lg text-stone-600 leading-relaxed mb-8 max-w-md">
                                Add what's in your fridge and we'll show you what to cook. No
                                shopping needed.
                            </p>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <div className="flex items-center gap-5">
                                <Link
                                    to="/cookbook"
                                    className="px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition"
                                >
                                    Get started
                                </Link>
                            </div>
                        </FadeIn>
                    </div>

                    <FadeIn delay={0.2} className="md:col-span-6">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-3">
                                {heroImgs[0] && (
                                    <div className="h-56 rounded-2xl overflow-hidden bg-amber-100">
                                        <img
                                            src={heroImgs[0].image_url}
                                            alt={heroImgs[0].name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                {heroImgs[1] && (
                                    <div className="h-36 rounded-2xl overflow-hidden bg-amber-100">
                                        <img
                                            src={heroImgs[1].image_url}
                                            alt={heroImgs[1].name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-3 mt-10">
                                {heroImgs[2] && (
                                    <div className="h-36 rounded-2xl overflow-hidden bg-amber-100">
                                        <img
                                            src={heroImgs[2].image_url}
                                            alt={heroImgs[2].name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                {heroImgs[3] && (
                                    <div className="h-56 rounded-2xl overflow-hidden bg-amber-100">
                                        <img
                                            src={heroImgs[3].image_url}
                                            alt={heroImgs[3].name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            <section className="bg-white py-16 border-y border-stone-100">
                <FadeIn inView>
                    <div className="text-center mb-10 px-6">
                        <h2 className="text-3xl md:text-4xl font-serif text-stone-800">
                            From our collection
                        </h2>
                    </div>
                </FadeIn>
                <div className="overflow-hidden">
                    <div className="animate-marquee flex gap-6 px-3 whitespace-nowrap">
                        {duped.map((r, i) => (
                            <button
                                key={i}
                                onClick={() => onRecipeClick(r.id)}
                                className="relative w-72 h-72 flex-shrink-0 rounded-2xl overflow-hidden bg-amber-50 group cursor-pointer text-left"
                            >
                                <img
                                    src={r.img || r.image_url}
                                    alt={r.title || r.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-transparent flex items-end p-4">
                                    <span className="text-white font-serif text-lg whitespace-normal leading-tight line-clamp-2">
                                        {r.title || r.name}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-orange-50 px-6 py-24">
                <div className="max-w-5xl mx-auto">
                    <FadeIn inView>
                        <div className="text-center mb-14">
                            <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-4">
                                Everything in one place
                            </h2>
                        </div>
                    </FadeIn>

                    <div className="grid grid-cols-2 gap-6">
                        {featureCards.map((card, i) => (
                            <FadeIn key={i} inView delay={i * 0.1}>
                                <motion.div
                                    whileHover={{y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.08)"}}
                                    className="bg-white border border-stone-200 rounded-2xl p-8"
                                >
                                    <h3 className="text-xl font-serif mb-2 text-stone-800">
                                        {card.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-stone-500">
                                        {card.text}
                                    </p>
                                </motion.div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white px-6 py-24 border-t border-stone-100">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
                    <FadeIn inView>
                        <h2 className="text-3xl md:text-4xl font-serif text-stone-800 mb-3">
                            A look inside
                        </h2>
                        <p className="text-stone-500 mb-8 text-sm">
                            See how the app looks before signing up.
                        </p>
                        <div className="flex flex-col gap-3">
                            {tabs.map((tab, i) => {
                                const active = activeTab === i;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setActiveTab(i)}
                                        className={
                                            "text-left p-5 rounded-xl border " +
                                            (active
                                                ? "bg-orange-50 border-orange-200"
                                                : "bg-white border-transparent hover:bg-stone-50")
                                        }
                                    >
                                        <h3
                                            className={
                                                "text-lg font-serif mb-0.5 " +
                                                (active ? "text-orange-700" : "text-stone-700")
                                            }
                                        >
                                            {tab.title}
                                        </h3>
                                        <p className="text-sm text-stone-400">{tab.label}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </FadeIn>

                    <FadeIn inView delay={0.2}>
                        <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-md">
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeTab}
                                    src={tabs[activeTab].img}
                                    alt={tabs[activeTab].title}
                                    initial={{opacity: 0, y: 10}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -10}}
                                    transition={{duration: 0.3}}
                                    className="w-full object-cover object-top"
                                />
                            </AnimatePresence>
                        </div>
                    </FadeIn>
                </div>
            </section>
        </>
    );
}

export default Landing;
