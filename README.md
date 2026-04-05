# Finio — Personal Finance Dashboard

A clean, interactive finance dashboard for tracking income, expenses, budgets and financial health — built with Next.js, Tailwind CSS, shadcn/ui and Recharts.

## Live Demo
https://finio-nprq.vercel.app/

## Setup
```bash
git clone <your-repo-url>
cd finance-dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> Requires Node.js 20+. No environment variables or backend setup needed — runs entirely on mock data with localStorage persistence.

---

## Approach

The goal was to build a dashboard that feels like a real product — not just a data table with charts. Every section has a deliberate purpose and the architecture reflects that.

**State Management** — Rather than reaching for Redux or Zustand, I split state into three focused React Contexts (Theme, Role, Transactions, Budget) each backed by `useReducer` where mutation logic exists. This keeps each context small, testable and easy to reason about. The separation also means a theme change never triggers a re-render in the transaction tree — which matters as the dataset grows.

**Role-Based UI** — Simulated entirely on the frontend using a `RoleContext` that exposes an `isAdmin` boolean. Components consume this directly and either render or omit admin-only UI — buttons are not just disabled, they are removed from the DOM entirely. This is the correct pattern for RBAC even in production.

**Data Design** — All amounts are stored as positive numbers with a `type` field (`income` | `expense`) determining sign. This keeps arithmetic clean — no negative values scattered through the codebase — and makes filtering and aggregation straightforward.

**Mock Data** — 75 transactions spanning 7 months (Oct 2025 – Apr 2026) with realistic Indian amounts, seasonal variation (Diwali spike in October, year-end bonus in December) and multiple income streams to make the charts and insights feel meaningful rather than flat.

---

## Features

### Dashboard
- Summary cards — Total Balance, Income, Expenses with % trend vs last month. Trend color is context-aware — rising expenses shows red, falling expenses shows green.
- **Financial Health Score** — A 0–100 composite score derived from three weighted metrics: savings rate (40%), expense ratio (40%) and income consistency across months (20%). Rendered as an SVG arc gauge with color-coded zones. No library used — built with raw SVG path math.
- Area chart — Income vs Expenses trend over time so you can see the gap (your savings) at a glance
- Donut chart — Spending by category for the latest month with a center total label
- Recent transactions — Last 5 with relative timestamps ("2 days ago") and income/expense color coding

### Transactions
- Full transaction table — date, description, category, type, amount
- Unified filter bar — search by description or category, filter by type, filter by category, sort by date or amount in either direction. All filters compose — they stack on top of each other.
- Pagination — 10 rows per page. Page resets automatically when filters change.
- Export — Downloads the currently filtered view (not all data) as CSV or JSON. CSV includes a UTF-8 BOM so ₹ renders correctly in Excel.
- Admin only — Add, Edit, Delete with a modal form, client-side validation and a confirm dialog before any destructive action. These controls are not rendered at all for Viewer role.

### Insights
- Monthly savings card with savings rate percentage and a contextual observation that changes based on whether you are above/below 30% savings threshold
- Highest spending category with its share of total monthly expenses
- Month-over-month expense change with dynamic messaging — the tone shifts based on whether spending rose sharply, stayed stable, or dropped
- Income vs expenses card showing surplus or deficit with an appropriate warning state
- Horizontal bar chart — categories ranked by spending, bars sized relative to the highest spender for easy comparison
- Grouped bar chart — last 3 months income vs expenses side by side

### Budget Tracker
- Per-category monthly budget setting stored in localStorage and tied to the latest month's actual spending
- Progress bar changes color dynamically — green under 80%, amber from 80-99%, red at 100%+
- Cards are sorted by urgency — over budget cards surface first, then nearing limit, then under budget, then unset
- Admin sets, edits and removes budgets via a modal. Viewer sees read-only progress.
- This page is the clearest demonstration of RBAC in the app — the same page looks and behaves differently based on role with zero code duplication in the UI layer.

### Global
- Role switcher — Viewer / Admin pill toggle in the header. Switching role instantly changes what is visible across the entire app.
- Dark / Light theme — applied via a `dark` class on the `<html>` element, compatible with Tailwind's dark mode strategy. Persisted in localStorage so your preference survives refresh.
- Staggered fade-in animations — implemented with plain JavaScript and inline styles, no animation library. Each section animates in with a 100ms delay between elements.
- Toast notifications — every meaningful action (add, edit, delete, role switch, theme toggle) gives instant feedback via Sonner toasts
- Empty states — every chart and page has a graceful fallback with a relevant icon and message rather than a broken or blank UI
- Fully responsive — sidebar collapses to icon-only on desktop, slides in as a drawer on mobile and closes automatically on navigation



