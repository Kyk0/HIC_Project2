import { useState, useEffect } from "react";
import { getProfile, updateProfile, updatePassword } from "../api/profile";
import { authFetch } from "../api/index";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// orange-700 → orange-200 ramp
const COLORS = ["#c2410c", "#ea580c", "#f97316", "#fb923c", "#fdba74", "#fed7aa"];

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // edit profile form
  const [username, setUsername] = useState("");
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // change password form
  const [passwords, setPasswords] = useState({ old_password: "", new_password: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState(null);
  const [pwLoading, setPwLoading] = useState(false);

  // chart data
  const [cookbook, setCookbook] = useState(null);
  const [kitchen, setKitchen] = useState([]);

  useEffect(() => {
    getProfile()
      .then(data => {
        setProfile(data);
        setUsername(data.username);
      })
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));

    authFetch("/cookbook").then(data => setCookbook(data)).catch(() => {});
    authFetch("/kitchen").then(data => setKitchen(data)).catch(() => {});
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

  const stats = [
    { label: "Recipes posted", value: profile.posted_count },
    { label: "Recipes saved", value: profile.saved_count },
    { label: "Pantry items", value: profile.pantry_count },
    { label: "Comments", value: profile.comments_count },
  ];

  // chart data: cuisine donut
  const cuisineData = cookbook
    ? Object.entries(
        cookbook.saved.reduce((acc, r) => {
          const key = r.cuisine || "Other";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {})
      ).map(([name, value]) => ({ name, value }))
    : [];

  // chart data: pantry by category
  const pantryData = Object.entries(
    kitchen
      .filter(i => i.status === "have")
      .reduce((acc, i) => {
        const key = i.ingredient.category || "Other";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {})
  ).map(([name, value]) => ({ name, value }));

  // chart data: top ingredients (ranked list, no counts from backend)
  const topIngredients = cookbook?.stats?.top_ingredients_saved || [];

  return (
    <div className="min-h-screen bg-orange-50/60 pt-20 pb-16 px-24">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">Account</p>
        <h1 className="text-4xl font-serif text-stone-800">{profile.username}</h1>
        <p className="text-stone-400 text-sm mt-0.5">{profile.email}</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* left: stats */}
        <div className="col-span-1 flex flex-col gap-3 self-center">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-stone-300 p-4 flex items-center justify-between">
              <p className="text-sm text-stone-500">{s.label}</p>
              <p className="text-2xl font-serif text-stone-800">{s.value}</p>
            </div>
          ))}
        </div>

        {/* right: forms */}
        <div className="col-start-3 col-span-2 flex flex-col gap-4">
          {/* edit username */}
          <div className="bg-white rounded-xl border border-stone-300 p-5">
            <h2 className="font-serif text-xl text-stone-800 mb-4">Edit profile</h2>
            <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-stone-600">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="px-4 py-2 border-4 border-stone-300 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-stone-500 bg-white"
                />
              </div>

              {profileMsg && (
                <p className={`text-sm ${profileMsg.ok ? "text-green-600" : "text-red-500"}`}>
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

          {/* change password */}
          <div className="bg-white rounded-xl border border-stone-300 p-5">
            <h2 className="font-serif text-xl text-stone-800 mb-4">Change password</h2>
            <form onSubmit={handlePasswordSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-stone-600">Current password</label>
                <input
                  type="password"
                  value={passwords.old_password}
                  onChange={e => setPasswords(p => ({ ...p, old_password: e.target.value }))}
                  className="px-4 py-2 border-4 border-stone-300 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-stone-500 bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-stone-600">New password</label>
                <input
                  type="password"
                  value={passwords.new_password}
                  onChange={e => setPasswords(p => ({ ...p, new_password: e.target.value }))}
                  className="px-4 py-2 border-4 border-stone-300 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-stone-500 bg-white"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm text-stone-600">Confirm new password</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                  className="px-4 py-2 border-4 border-stone-300 rounded-lg text-sm text-stone-800 focus:outline-none focus:border-stone-500 bg-white"
                />
              </div>

              {pwMsg && (
                <p className={`text-sm ${pwMsg.ok ? "text-green-600" : "text-red-500"}`}>
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

      {/* charts section */}
      <div className="mt-10 grid grid-cols-3 gap-6">
        {/* top saved ingredients */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
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
                    <p className="text-xs text-stone-500 mb-1">{name}</p>
                    <div
                      className={`${widths[i] || "w-1/4"} h-2 rounded-full`}
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* saved recipes by cuisine */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
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
                  label={({ name }) => name}
                >
                  {cuisineData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v} recipes`]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* pantry by category */}
        <div className="bg-white rounded-xl border border-stone-200 p-5">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">Pantry</p>
          <h2 className="font-serif text-xl text-stone-800 mb-2">By category</h2>
          {pantryData.length === 0 ? (
            <p className="text-sm text-stone-400 mt-4">Add items to your pantry to see category breakdown.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pantryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name }) => name}
                >
                  {pantryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v} items`]} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
