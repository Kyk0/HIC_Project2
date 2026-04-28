import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function Navbar() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [dropdownOpen, setDropdownOpen] = useState(false);

    function handleLogout() {
        logout();
        navigate("/");
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3 bg-white border-b border-stone-200">

            <Link
                to="/"
                onClick={() => window.scrollTo({top: 0, behavior: "smooth"})}
                className="text-lg font-serif font-bold text-stone-800"
            >
                Pantry
            </Link>

            <div className="flex items-center gap-5 text-sm text-stone-600">

                {user ? (
                    <>
                        <Link to="/collection" className="hover:text-stone-900">Collection</Link>
                        <Link to="/kitchen" className="hover:text-stone-900">Kitchen</Link>
                        <Link to="/cookbook" className="hover:text-stone-900">Cookbook</Link>
                        <Link to="/recipe/new" className="hover:text-stone-900">New Recipe</Link>

                        <div className="relative">

                            <button
                                onClick={() => setDropdownOpen(o => !o)}
                                className="hover:text-stone-900"
                            >
                                {user.username} ▾
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-36 bg-white border border-orange-100 rounded-lg shadow-md py-1 text-sm">

                                    <Link
                                        to="/profile"
                                        onClick={() => setDropdownOpen(false)}
                                        className="block px-4 py-2 hover:bg-orange-50"
                                    >
                                        Profile
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 hover:bg-orange-50 text-red-600"
                                    >
                                        Logout
                                    </button>

                                </div>
                            )}

                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="hover:text-stone-900">Login</Link>
                        <Link
                            to="/signup"
                            className="px-4 py-1.5 bg-stone-800 text-stone-50 rounded-lg hover:bg-stone-700"
                        >
                            Sign up
                        </Link>
                    </>
                )}

            </div>
        </nav>
    );
}

export default Navbar;