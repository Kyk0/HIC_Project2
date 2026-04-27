import { useState, useEffect } from "react";
import { getProfile, updateProfile, updatePassword } from "../api/profile";

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

  useEffect(() => {
    getProfile()
      .then(data => {
        setProfile(data);
        setUsername(data.username);
      })
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false));
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

  return (
    <div className="min-h-screen pt-24 pb-16 px-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Account</p>
        <h1 className="text-4xl font-serif text-stone-800">{profile.username}</h1>
        <p className="text-stone-400 text-sm mt-1">{profile.email}</p>
      </div>

      {/* stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-stone-100 p-4 text-center">
            <p className="text-2xl font-serif text-stone-800">{s.value}</p>
            <p className="text-xs text-stone-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* edit username */}
      <div className="bg-white rounded-xl border border-stone-100 p-6 mb-4">
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
      <div className="bg-white rounded-xl border border-stone-100 p-6">
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
  );
}

export default Profile;
