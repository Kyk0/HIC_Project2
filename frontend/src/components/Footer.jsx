import {Link} from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-stone-800 bg-stone-900 px-8 py-4 flex items-center justify-between text-xs text-stone-400">
      <span>© 2026 Pantry</span>
      <Link
        to="/contact"
        onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
        className="hover:text-orange-400 transition-colors"
      >
        Contact
      </Link>
    </footer>
  );
}

export default Footer;
