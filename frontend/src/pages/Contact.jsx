import { useState } from "react";

const SUBJECTS = ["Bug report", "Feature request", "Recipe suggestion", "Other"];

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErr(null);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErr("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-orange-50/60 pt-24 pb-16 px-8 flex flex-col items-center justify-center text-center">
        <div className="bg-white rounded-xl border border-stone-200 p-12 w-full max-w-lg">
          <p className="text-xs uppercase tracking-widest text-orange-700 mb-3">Message sent</p>
          <h2 className="font-serif text-3xl text-stone-800 mb-4">Thanks, {form.name.split(" ")[0]}!</h2>
          <p className="text-stone-500 leading-relaxed">
            We got your message and will get back to you at <span className="text-stone-700">{form.email}</span> soon.
          </p>
          <button
            onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
            className="mt-8 px-5 py-2 border border-stone-200 rounded-lg text-sm text-stone-600 hover:bg-stone-50"
          >
            Send another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50/60 flex flex-col justify-center items-center px-8 py-24">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-stone-200 p-8 flex flex-col gap-5 w-full max-w-lg">
        <h1 className="text-4xl font-serif text-stone-800 text-center mb-2">Contact</h1>

        <div className="flex gap-4">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-sm text-stone-600">Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-orange-300 bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-sm text-stone-600">Email <span className="text-red-400">*</span></label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-orange-300 bg-white"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-stone-600">Subject</label>
          <select
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-600 bg-white focus:outline-none focus:border-orange-300"
          >
            <option value="">What is this about?</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-stone-600">Message <span className="text-red-400">*</span></label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            rows={6}
            className="px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-orange-300 bg-white resize-none"
          />
        </div>

        {err && <p className="text-sm text-red-500">{err}</p>}

        <button
          type="submit"
          disabled={loading}
          className="self-center px-6 py-2.5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send message"}
        </button>
      </form>
    </div>
  );
}

export default Contact;
