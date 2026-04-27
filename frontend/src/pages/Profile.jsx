import { useState, useEffect } from "react";
import { getProfile, updateProfile, updatePassword } from "../api/profile";
import { authFetch } from "../api/index";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#3b82f6", "#ec4899", "#14b8a6", "#f97316"];
const BAR_COLORS = ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"];

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [username, setUsername] = useState("");
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwords, setPasswords] = useState({ old_password: "", new_password: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState(null);
  const [pwLoading, setPwLoading] = useState(false);

  const [cookbook, setCookbook] = useState(null);

  useEffect(() => {
    getProfile()
      .then(data => {
        setProfile(data);
        setUsername(data.username);
      })
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));

    authFetch("/cookbook").then(data => setCookbook(data)).catch(() => {});
  }, []);

  function handleProfileSave(e) {
    e.preventDefault();
    if (!username.trim()) return;
    setProfileMsg(null);
    setProfileLoading(true);
    updateProfile({ username: username.trim() })
      .then(() => {
        setProfile(prev => ({ ...prev, username: username.trim() }));
        setProfileMsg({ ok: true, text: "Username updated." });
      })
      .catch(e => setProfileMsg({ ok: false, text: e.message }))
      .finally(() => setProfileLoading(false));
  }

  function handlePasswordSave(e) {
    e.preventDefault();
    setPwMsg(null);
    if (!passwords.old_password || !passwords.new_password || !passwords.confirm) {
      setPwMsg({ ok: false, text: "All fields are required." });
      return;
    }
    if (passwords.new_password !== passwords.confirm) {
      setPwMsg({ ok: false, text: "New passwords don't match." });
      return;
    }
    if (passwords.new_password.length < 6) {
      setPwMsg({ ok: false, text: "New password must be at least 6 characters." });
      return;
    }
    setPwLoading(true);
    updatePassword({ old_password: passwords.old_password, new_password: passwords.new_password })
      .then(() => {
        setPasswords({ old_password: "", new_password: "", confirm: "" });
        setPwMsg({ ok: true, text: "Password changed successfully." });
      })
      .catch(e => setPwMsg({ ok: false, text: e.message }))
      .finally(() => setPwLoading(false));
  }

  if (loading) return <p className="pt-32 text-center text-stone-400">Loading...</p>;
  if (err) return <p className="pt-32 text-center text-red-500">{err}</p>;

  const cuisineData = cookbook
    ? Object.entries(
        cookbook.saved.reduce((acc, r) => {
          const key = r.cuisine || "Other";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {})
      ).map(([name, value]) => ({ name, value }))
    : [];

  const topIngredients = cookbook?.stats?.top_ingredients_saved || [];

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-orange-50 px-6 pt-24 pb-5 border-b border-stone-200">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif text-stone-800">{profile.username}</h1>
            <p className="text-stone-400 text-sm mt-0.5">{profile.email}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center px-4 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl min-w-16">
              <span className="text-xl font-serif text-indigo-700">{profile.posted_count}</span>
              <span className="text-xs text-indigo-500 mt-0.5">posted</span>
            </div>
            <div className="flex flex-col items-center px-4 py-2.5 bg-amber-50 border border-amber-100 rounded-xl min-w-16">
              <span className="text-xl font-serif text-amber-700">{profile.saved_count}</span>
              <span className="text-xs text-amber-500 mt-0.5">saved</span>
            </div>
            <div className="flex flex-col items-center px-4 py-2.5 bg-emerald-50 border border-emerald-100 rounded-xl min-w-16">
              <span className="text-xl font-serif text-emerald-700">{profile.pantry_count}</span>
              <span className="text-xs text-emerald-500 mt-0.5">pantry</span>
            </div>
            <div className="flex flex-col items-center px-4 py-2.5 bg-rose-50 border border-rose-100 rounded-xl min-w-16">
              <span className="text-xl font-serif text-rose-700">{profile.comments_count}</span>
              <span className="text-xs text-rose-500 mt-0.5">comments</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">Most saved</p>
            <h2 className="font-serif text-xl text-stone-800 mb-5">Top ingredients</h2>
            {topIngredients.length === 0 ? (
              <p className="text-sm text-stone-400">Save some recipes to see your top ingredients.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {topIngredients.map((name, i) => {
                  const widths = ["w-full", "w-4/5", "w-3/5", "w-2/5", "w-1/4"];
                  return (
                    <div key={name}>
                      <p className="text-xs text-stone-600 mb-1.5">{name}</p>
                      <div
                        className={widths[i] || "w-1/4"}
                        style={{ height: "8px", borderRadius: "9999px", backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">Saved recipes</p>
            <h2 className="font-serif text-xl text-stone-800 mb-2">By cuisine</h2>
            {cuisineData.length === 0 ? (
              <p className="text-sm text-stone-400 mt-4">Save some recipes to see cuisine breakdown.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={cuisineData}
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {cuisineData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [v + " recipes"]} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h2 className="font-serif text-xl text-stone-800 mb-5">Edit profile</h2>
            <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-stone-600">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-orange-300 bg-white"
                />
              </div>
              {profileMsg && (
                <p className={"text-sm " + (profileMsg.ok ? "text-green-600" : "text-red-500")}>
                  {profileMsg.text}
                </p>
              )}
              <button
                type="submit"
                disabled={profileLoading || username.trim() === profile.username}
                className="self-start px-5 py-2 bg-stone-800 text-stone-50 rounded-lg text-sm hover:bg-stone-700 disabled:opacity-40"
              >
                {profileLoading ? "Saving..." : "Save changes"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h2 className="font-serif text-xl text-stone-800 mb-5">Change password</h2>
            <form onSubmit={handlePasswordSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-stone-600">Current password</label>
                <input
                  type="password"
                  value={passwords.old_password}
                  onChange={e => setPasswords(p => ({ ...p, old_password: e.target.value }))}
                  className="px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-orange-300 bg-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-stone-600">New password</label>
                <input
                  type="password"
                  value={passwords.new_password}
                  onChange={e => setPasswords(p => ({ ...p, new_password: e.target.value }))}
                  className="px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-orange-300 bg-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-stone-600">Confirm new password</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  className="px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-orange-300 bg-white"
                />
              </div>
              {pwMsg && (
                <p className={"text-sm " + (pwMsg.ok ? "text-green-600" : "text-red-500")}>
                  {pwMsg.text}
                </p>
              )}
              <button
                type="submit"
                disabled={pwLoading}
                className="self-start px-5 py-2 bg-stone-800 text-stone-50 rounded-lg text-sm hover:bg-stone-700 disabled:opacity-40"
              >
                {pwLoading ? "Saving..." : "Update password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
