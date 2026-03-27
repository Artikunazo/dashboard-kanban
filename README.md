# Kanban Dashboard

> A real-time Kanban board built with modern Angular, Supabase, and an architecture designed to scale.

---

## 🌐 Live Demo

<!-- TODO: add deployed URL -->
🔗 **[View live demo](#)** *(coming soon)*

---

## 📌 What does this project do?

Kanban Dashboard is a web application for managing tasks using *To Do / In Progress / Done* columns. No sign-up required — every visitor automatically gets an anonymous session and their own private board.

**Key features:**
- 🗂️ Multiple boards per session with quick switching from the header
- ↕️ Drag & drop tasks between columns (persistent ordering with LexoRank)
- ✏️ Inline editing for board titles and task fields
- 👤 Assign a team member to each task
- 🚦 Client-side rate limiting to prevent write abuse
- 🔔 Instant feedback via toast notifications
- 🔒 Basic security: input sanitization and Angular Forms validation

---

## 🛠️ Tech stack

| Technology | Role | Why |
|---|---|---|
| ![Angular](https://img.shields.io/badge/Angular_21-DD0031?logo=angular&logoColor=white) | UI Framework | Native Signals (no RxJS overhead), standalone components, and CDK keep things simple and performant |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) | Language | Compile-time type safety reduces bugs and improves developer experience |
| ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white) | Backend as a Service | PostgreSQL + Auth + PostgREST out of the box; `maybeSingle()` and RPCs make the data layer predictable |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind_4-38BDF8?logo=tailwindcss&logoColor=white) | Styling | Utility-first approach allows fast UI iteration without context-switching |
| ![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white) | E2E Testing | Modern API, auto-wait, and solid support for complex UI flows |
| ![Vitest](https://img.shields.io/badge/Vitest-6E9F18?logo=vitest&logoColor=white) | Unit Testing | Fast, native ESM, shares config with Vite |

---

## 🏗️ Architecture

The project follows a **Hexagonal Architecture (Ports & Adapters)** pattern adapted to Angular, organized by feature:

```
src/app/
├── core/               # Global services (Supabase, Toast, Rate Limiter, Validation)
├── features/
│   └── board/
│       ├── domain/     # Abstract contracts (Ports) — no dependency on Supabase
│       │   └── repositories/
│       ├── infrastructure/ # Concrete implementations (Adapters) — Supabase
│       │   └── repositories/
│       ├── facades/    # Application layer — orchestrates repos, state, and side effects
│       ├── components/ # Purely presentational components
│       └── models/     # Domain interfaces (DTOs)
└── shared/             # Reusable components (icons, assignee picker)
```

### Why this architecture?

| Decision | Reason |
|---|---|
| **Hexagonal** | The abstractions (`BoardRepository`, `TaskRepository`) decouple the domain from Supabase. Swapping to Firebase or a custom REST API only requires changing the `infrastructure/` folder |
| **Facade pattern** | `BoardFacade` centralizes all state as Angular Signals. Components read signals and call methods here — never repositories directly |
| **Signals over RxJS** | No subscriptions to clean up; reactive templates are straightforward and easier to follow for any team member |
| **Standalone components** | No `NgModule` overhead; each component explicitly declares what it imports |
| **CDK Drag & Drop** | Avoids manually implementing drag logic; `transferArrayItem` + LexoRank handles persistent, collision-free ordering |
| **LexoRank** | Allows reordering tasks with a single UPDATE instead of recalculating all indexes; resistant to concurrent inserts |

---

## 🧪 Testing

```
e2e/
├── boards.spec.ts    # Create, rename, delete, and switch boards
├── columns.spec.ts   # Column verification and board state
└── tasks.spec.ts     # Full task CRUD + drag & drop
```

```bash
# Unit tests
npm test

# E2E tests (requires the app to be running)
npm run e2e

# E2E with interactive UI
npm run e2e:ui
```

---

## 🚀 Running locally

### Prerequisites

- Node ≥ 18
- A Supabase account with the schema applied (`supabase/` contains the migrations)

### Setup

```bash
git clone https://github.com/<your-username>/dashboard-kanban.git
cd dashboard-kanban
npm install
```

Create a `.env` file in the root:

```env
NG_APP_SUPABASE_URL=https://xxxx.supabase.co
NG_APP_SUPABASE_KEY=your-anon-key
```

```bash
npm start
# → http://localhost:4200
```

---

## 📁 Notable technical decisions

- **Client-side rate limiting** — Not a replacement for backend validation, but provides immediate feedback and prevents accidental spam. Configured in `RateLimiterService` with per-session or time-based windows.
- **Anonymous session** — On first visit, the user automatically gets a Supabase anonymous session. This enables Row Level Security by `visitor_id` without forcing a sign-up.
- **Input sanitization** — `InputValidationService` strips HTML tags before persisting any string, acting as a second line of defense against XSS.

---

## 🗺️ Roadmap

- [ ] Dark / light mode
- [ ] Real-time collaboration (Supabase Realtime)
- [ ] Account-based authentication (migrate anonymous session)
- [ ] Column drag & drop
- [ ] Task filtering and search

---

<div align="center">
  <sub>Built with ☕ and Angular Signals</sub>
</div>
