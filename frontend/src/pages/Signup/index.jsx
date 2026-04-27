import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { signup, login as apiLogin } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";

function Signup() {
  const { token, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  if (token) return <Navigate to="/" replace />;

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const created = await signup(form.username, form.email, form.password);
      if (created.id) {
        const data = await apiLogin(form.email, form.password);
        if (data.access_token) {
          login(data.access_token);
          navigate("/");
        }
      } else {
        setErr(created.detail || "Could not create account.");
      }
    } catch {
      setErr("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="w-full max-w-sm px-8 py-10 bg-white rounded-2xl border-4 border-stone-300">
        <h1 className="text-2xl font-serif text-stone-800 mb-6">Create an account</h1>

        {err && <p className="text-sm text-red-500 mb-4">{err}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-stone-600 mb-1">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
            />
          </div>
          <div>
            <label className="block text-sm text-stone-600 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
            />
          </div>
          <div>
            <label className="block text-sm text-stone-600 mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 py-2 bg-stone-800 text-stone-50 rounded-lg text-sm font-medium hover:bg-stone-700 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="mt-5 text-sm text-stone-500 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-stone-800 underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
