# CLAUDE.md

This file gives guidance to Claude Code when working on this project.

## Project Overview

A recipe app where users can browse recipes, save them, manage their kitchen pantry, and get suggestions for what they can cook based on what they already have. The backend is already built and working — we are only working on the **frontend**.

## Tech Stack (strict)

- **React (JS, not TypeScript)** — plain JSX only
- **Tailwind CSS** for all styling
- **React Router** for routing
- `fetch` for API calls (no axios, no react-query, no swr)

**Do NOT add:**
- TypeScript
- Component libraries (no shadcn, MUI, Chakra, Ant, Radix, Headless UI, etc.)
- State libraries (no Redux, Zustand, Jotai, Recoil)
- Form libraries (no react-hook-form, Formik)
- CSS-in-JS, styled-components, CSS modules, or plain CSS files (Tailwind only, except `index.css` for Tailwind directives)
- Icon libraries unless asked (if needed, use simple inline SVG or emoji)

If you think you need a library, don't — write it by hand instead.

## Code Style

This is a student project. Code should look like a real student wrote it — readable and working, but not over-engineered or "enterprise."

**Do this:**
- Plain functional components with hooks (`useState`, `useEffect`, `useNavigate`, etc.)
- `fetch` calls written directly inside `useEffect` or event handlers — fine to repeat patterns instead of abstracting
- Inline event handlers (`onClick={() => ...}`) when they're short
- Variable names that are clear but casual (`recipes`, `loading`, `err`, `formData`)
- Tailwind classes directly on elements, even if the className string gets a bit long
- A little duplication is OK — don't extract every two-line repeat into a helper
- Simple loading/error states like `if (loading) return <p>Loading...</p>`
- Comments occasionally, like a student would: short, sometimes obvious (`// fetch recipes on load`)

**Don't do this:**
- Custom hooks for everything (e.g. don't make `useFetch`, `useAuth` abstractions unless it really makes sense — auth context is fine, but keep it simple)
- Generic wrapper components (`<Button variant="primary" size="md" />` — just write `<button className="...">`)
- Over-componentization (one giant 200-line page component is fine for now; split only when it's clearly painful)
- Render-prop patterns, HOCs, compound components
- Premature optimization (`useMemo`, `useCallback`, `React.memo` — don't bother unless something is actually slow)
- Perfectly DRY code — student code repeats a bit
- Heavy JSDoc comments or formal documentation blocks

**A bit of mess is OK** — slightly inconsistent spacing in Tailwind classes, a `console.log` left in during dev, mixing arrow functions and regular functions. Don't fake mess on purpose, but don't polish it to a mirror shine either.

## Project Structure

Each page lives in its **own folder** under `src/pages/`. The main page component is named `index.jsx` (so imports stay clean: `import Browse from "./pages/Browse"`). Page-specific subcomponents live in the same folder — they don't go in the global `components/` folder.

```
src/
  pages/
    Login/
      index.jsx
    Signup/
      index.jsx
    Landing/
      index.jsx
      Hero.jsx              // example: page-specific subcomponent
      FeatureSection.jsx
    Profile/
      index.jsx
    Browse/
      index.jsx
      Filters.jsx           // example: only used by Browse, lives here
    RecipeDetail/
      index.jsx
      Comments.jsx          // example
    Cookbook/
      index.jsx
    RecipeForm/             // used for both /recipe/new and /recipe/:id/edit
      index.jsx
    Kitchen/
      index.jsx
      HaveTab.jsx           // example
      ShoppingListTab.jsx   // example
  components/
    Navbar.jsx              // shared across pages only
    RecipeCard.jsx          // shared across pages only
    ProtectedRoute.jsx
  context/
    AuthContext.jsx
  api.js                    // base URL + small fetch helper
  App.jsx
  main.jsx
  index.css
```

**Rule of thumb:** if a component is used on only one page, it goes in that page's folder. If it's used on two or more pages, move it to `src/components/`. Don't pre-emptively move things to `components/` "in case" they get reused.

For very small pages (Login, Signup, Profile), `index.jsx` alone is fine — the folder might only have one file, that's OK. Consistency matters more than file count.

## Pages

1. **Login** — `/login` — not accessible when logged in
2. **Signup** — `/signup` — not accessible when logged in
3. **Landing** — `/` — first page users see; explains features. This page should look the nicest of all the pages.
4. **Profile** — `/profile` — change password, change name, list user's comments, counters (e.g. "5 recipes, 12 saved, 23 pantry items")
5. **Browse** — `/browse` — search recipes plus negative-filter toggles like "no dairy," "no meat"
6. **Recipe Detail** — `/recipe/:id` — recipe info, ingredients, description. Save/unsave button. If the recipe belongs to the current user, show edit/delete buttons. Comments section: flat (no replies); user can edit/delete their own.
7. **Cookbook** — `/cookbook` — user's posted recipes, saved recipes, link to create. Plus stats: most-used ingredients across the user's saved recipes and across their posted recipes (shown separately, same layout, different sources).
8. **Create / Edit Recipe** — `/recipe/new` and `/recipe/:id/edit` — same layout for both, both routes render `pages/RecipeForm`
9. **Kitchen** — `/kitchen` — two tabs:
   - **Have** (virtual fridge) — ingredients the user owns; feeds "what can I cook" matching on Browse and Recipe Detail
   - **Shopping List** — items to buy; can be added manually or auto-added from Recipe Detail ("add missing ingredients" button); checkbox per item; "Move checked to Have" button transfers them
   - Both tabs share an autocomplete input (master ingredients from seed recipes), support optional quantity notes ("2 cups", "500g"), grouping/filtering by category (produce, dairy, meat, pantry staples, spices), and "Clear all" / "Clear checked" actions with undo toast. Empty states prompt the user to start adding ingredients.

## Navbar

- **Logged out:** Home | Login / Sign up
- **Logged in:** Home | Browse | Kitchen | Cookbook | New Recipe | Profile (dropdown → Profile / Logout)

## Routing & Auth

- Use `react-router-dom`
- Wrap protected routes (`/profile`, `/kitchen`, `/cookbook`, `/recipe/new`, `/recipe/:id/edit`) with a `ProtectedRoute` component that redirects to `/login` if not authed
- `/login` and `/signup` should redirect to `/` if already logged in
- Store auth state in a small `AuthContext` — keep the token in `localStorage` and read it on app load
- Auth token goes in the `Authorization: Bearer <token>` header on protected endpoints

## API Reference

Base URL lives in `src/api.js`. Endpoints marked 🔒 require the auth token. `*` = required field.

### Auth
```
POST /auth/signup       Body: { username, email, password }
POST /auth/login        Body: { email, password }
GET  /auth/me           🔒
```

### Recipes
```
GET    /recipes         ?q= &cuisine= &difficulty=
POST   /recipes         🔒  Body: RecipeIn
GET    /recipes/{id}
PUT    /recipes/{id}    🔒  Body: RecipeIn
DELETE /recipes/{id}    🔒
```

`RecipeIn`:
```
name*, ingredients*[], instructions*[],
image_url, cuisine, difficulty,
prep_time_minutes, cook_time_minutes,
servings, calories_per_serving,
tags[], meal_types[]
```

### Cookbook
```
GET    /cookbook              🔒  → { saved[], posted[], stats }
POST   /cookbook/{recipe_id}  🔒  (save)
DELETE /cookbook/{recipe_id}  🔒  (unsave)
```

### Kitchen
```
GET    /kitchen                  🔒
POST   /kitchen                  🔒  Body: { ingredient_id*, status*, quantity_text }
PUT    /kitchen/{id}             🔒  Body: { quantity_text, is_checked, status }
DELETE /kitchen/{id}             🔒
POST   /kitchen/move-checked     🔒  (move checked → "have")
DELETE /kitchen/clear            🔒  ?status= &only_checked=false
```

`status` corresponds to the Kitchen tabs (`"have"` for the fridge, `"shopping"` for the shopping list).

### Comments
```
GET    /recipes/{recipe_id}/comments
POST   /recipes/{recipe_id}/comments  🔒  Body: { body* }
PUT    /comments/{id}                 🔒  Body: { body* }
DELETE /comments/{id}                 🔒
```

### Profile
```
GET  /profile                🔒
PUT  /profile                🔒  Body: { username, avatar_url }
PUT  /profile/password       🔒  Body: { old_password*, new_password* }
```

## API Calls

- Keep it simple — `fetch` directly in components is fine
- Centralize the base URL in `src/api.js`
- It's OK to have one tiny helper there that attaches the auth header so we're not rewriting that on every call — but anything fancier than that, skip
- Basic error handling: catch the error, set an `err` state, show a message. Don't build a global error system.

Example pattern (fine to copy this style around the app):

```jsx
const [recipes, setRecipes] = useState([]);
const [loading, setLoading] = useState(true);
const [err, setErr] = useState(null);

useEffect(() => {
  fetch(`${API_URL}/recipes`)
    .then(r => r.json())
    .then(data => setRecipes(data))
    .catch(e => setErr(e.message))
    .finally(() => setLoading(false));
}, []);
```

## Styling Notes

- Tailwind only. Use utility classes directly.
- **Desktop-only.** Don't add mobile breakpoints, don't worry about small screens, don't sprinkle responsive `sm:` / `md:` prefixes around. Assume a normal desktop viewport. Use `md:` / `lg:` only if it actually helps the desktop layout itself.
- Don't make a design system. If a button shows up a lot and the classes get annoying, *then* make a `<Button>` component — but not before.
- The Landing page is the one place to put extra effort into looking good.

## Things to Skip Unless Asked

- Tests
- Storybook
- Mobile / responsive design
- Accessibility audits beyond basic semantic HTML and labels on inputs
- i18n
- Dark mode
- Any PWA / service worker stuff

## When in Doubt

Pick the simpler option. If two approaches both work and one needs a new dependency or a fancy abstraction, pick the other one.
