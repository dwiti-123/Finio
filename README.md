# FinanceIQ — Personal Finance Dashboard

A clean, interactive finance dashboard built with Next.js 14, Tailwind CSS, shadcn/ui, and Recharts.

## Live Demo
[Add your deployment URL here]

## Setup
```bash
git clone <your-repo-url>
cd finance-dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

### Dashboard
- Summary cards — Total Balance, Income, Expenses with % trend vs last month
- Area chart — Balance and income trend over time
- Donut chart — Spending breakdown by category
- Recent transactions — Last 5 with relative timestamps

### Transactions
- Full transaction table with date, description, category, type, amount
- Unified filter bar — search, type filter, sort by date or amount
- Pagination — 10 per page with page numbers
- Export — Download filtered transactions as CSV or JSON
- Admin only — Add, Edit, Delete transactions with confirm dialog

### Insights
- Monthly savings with savings rate and contextual observation
- Highest spending category with % of total expenses
- Month-over-month expense change with smart messaging
- Income vs expenses surplus/deficit card
- Horizontal bar chart — spending ranked by category
- Grouped bar chart — last 3 months income vs expenses comparison

### Global
- Role switcher — Viewer (read-only) / Admin (full access) toggle in header
- Dark / Light theme toggle — persisted in localStorage
- Fully responsive — mobile drawer sidebar, stacked cards on small screens
- localStorage persistence — transactions, role, and theme survive page refresh

## Tech Decisions

| Decision | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | File-based routing, RSC support |
| Styling | Tailwind CSS | Utility-first, fast iteration |
| Components | shadcn/ui | Accessible, unstyled base, easy to customize |
| Charts | Recharts | Composable, React-native, good defaults |
| State | React Context + useReducer | Right fit for this scale — no external dependency needed |
| Persistence | localStorage | Meets optional enhancement requirement cleanly |

## Project Structure