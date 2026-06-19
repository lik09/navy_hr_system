# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A personnel records system for the Royal Cambodian Navy (`APP_NAME="Royal Cambodian Navy"`). A Laravel 11 API backend serves a separate React SPA that captures a multi-section personnel form (personal info, military service history, education, training, missions, health) plus auth and settings.

## Architecture

This is a Laravel API backend with a React SPA frontend, served through a single Blade entry view via `laravel-vite-plugin` — not two separate npm projects, and not a plain static-HTML Vite SPA:

- **`app/`, `routes/api.php`, `database/`** — Laravel 11 API backend. All real routes live under `/api/*` in `routes/api.php`. Auth is token-based via Laravel Sanctum (`auth:sanctum` middleware, Bearer tokens — not session cookies). `withRouting()` registers the `api` group before `web`, so `routes/web.php`'s catch-all never shadows `/api/*`.
- **`resources/js/`** — the React 18 SPA source (antd UI, zustand for state, react-router-dom, i18next for EN/KM bilingual support). Entry point is `resources/js/main.jsx`, which mounts to `<div id="root">` in `resources/views/welcome.blade.php`.
- **`vite.config.js`** uses `laravel-vite-plugin` (`input: ['resources/css/app.css', 'resources/js/main.jsx']`, `refresh: true`) + `@vitejs/plugin-react`. `npm run build` produces `public/build/manifest.json` + hashed assets, which `resources/views/welcome.blade.php`'s `@vite(...)`/`@viteReactRefresh` directives resolve via Laravel's `Illuminate\Foundation\Vite`. **Use `laravel-vite-plugin@^1.3.0`** — v2/v3 require Vite 7/8, incompatible with the installed `vite@^5.2.0`.
- **`routes/web.php`** — `Route::view('/{any}', 'welcome')->where('any', '.*')`, so `resources/views/welcome.blade.php` is the SPA catch-all root, not a hand-built `index.html`.
- **Tailwind v3** (`tailwind.config.js` + `postcss.config.js`, classic `@tailwind base/components/utilities` in `resources/css/app.css`) is wired into the build via `laravel-vite-plugin`'s `input` array and Vite's automatic PostCSS loading. Do **not** add `@tailwindcss/vite` — that's the Tailwind v4 plugin and conflicts with this v3 setup.
- The root **`index.html`** (old plain-Vite-SPA entry) and `public/build/index.html` are leftover/unused now that Blade is the entry point — `laravel-vite-plugin` sets `build.rollupOptions.input` itself, so they're ignored by `vite build`, not a conflict. Dead weight, safe to ignore.

Frontend auth flow: `resources/js/store/authStore.js` (zustand, persisted to localStorage as `rcn-auth`) holds the bearer token; `resources/js/api/axios.js` attaches it to every request via an interceptor and force-logs-out + redirects to `/login` on a 401.

### Backend data model

`User` (`app/Models/User.php`) has one `PersonalInfo` (`personal_info` table, one row per user). `PersonalInfo` in turn has one `MilitaryInfo` and one `FamilyInfo`, and many rows in each of: `military_service_histories`, `education`, `specialized_trainings`, `missions`, `health` — these are the multi-record sections (Section II–VI) exposed as standard `Route::apiResource` controllers. Section I (`personnel-info`, `military-info`, `family-info`) instead uses `index`/`store`/`update` with `updateOrCreate` semantics keyed on `user_id`/`personal_info_id`, since each user has exactly one record there.

`PersonalInfoController::store` handles photo upload (`photo` file field) to the `public` disk under `personnel_photos/`, deleting the previous photo on replace.

## Common commands

Everything runs from the repo root now (no separate frontend folder/package.json):
```
php artisan serve              # dev server (http://localhost:8000)
php artisan migrate            # run migrations (MySQL, db: royal_navy_db)
php artisan test               # run PHPUnit tests
php artisan test --filter=Name # run a single test
vendor/bin/pint                # format PHP (Laravel Pint)
npm install
npm run dev                    # Vite dev server on :5173; welcome.blade.php's @vite directive picks it up automatically (writes public/hot)
npm run build                  # builds public/build/manifest.json + hashed assets (what welcome.blade.php's @vite reads in production)
composer dev                   # runs serve + queue:listen + pail logs + vite dev concurrently
```

When testing the full app end-to-end, either run `npm run build` then hit `php artisan serve` directly, or run `composer dev` (or `php artisan serve` + `npm run dev` separately) — `@viteReactRefresh`/`@vite` in `resources/views/welcome.blade.php` automatically point at the Vite dev server while it's running. If `npm run dev` is killed abnormally, delete the stale `public/hot` file it leaves behind, or the app will keep trying to load assets from the dead dev server instead of falling back to the built manifest.
