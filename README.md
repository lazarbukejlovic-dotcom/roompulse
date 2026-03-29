# RoomPulse

**Modern task & board management for small teams, creators, and freelancers.**

RoomPulse is a clean, SaaS-style project management app that helps you organize work visually with Kanban boards, smart task tracking, and a real-time dashboard — all wrapped in a polished, premium UI.

---

## Overview

RoomPulse was built to solve a simple problem: most project management tools are either too complex or too basic. RoomPulse sits in the sweet spot — powerful enough for real workflows, simple enough to start using in seconds.

It features drag-and-drop Kanban boards, priority-based task management, team collaboration tools, and a live analytics dashboard — all designed with the polish and attention to detail you'd expect from a modern SaaS product.

---

## Features

- **Visual Kanban Boards** — Drag-and-drop columns with real-time status tracking
- **Smart Task Management** — Priorities, due dates, tags, and inline editing
- **Live Dashboard** — Completion stats, activity feed, and overdue task alerts
- **Team Collaboration** — Threaded comments and shared boards
- **Dark Mode** — A carefully crafted dark theme, not just inverted colors
- **Skeleton Loaders** — Smooth loading states across all pages
- **Error Boundaries** — Graceful error handling with retry actions
- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile
- **Relative Date Formatting** — Human-readable dates like "2 days ago" and "Tomorrow"

---

## Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Framework    | React 18 + TypeScript               |
| Styling      | Tailwind CSS + shadcn/ui            |
| State        | Zustand                             |
| Data         | TanStack React Query                |
| Routing      | React Router v6                     |
| Charts       | Recharts                            |
| Drag & Drop  | @hello-pangea/dnd                   |
| Animations   | Framer Motion                       |
| Dates        | date-fns                            |
| Build        | Vite                                |

---

## Screenshots

> Add screenshots of the landing page, dashboard, board view, and task modal here.

| Landing Page | Dashboard | Board View |
| :---: | :---: | :---: |
| ![Landing](screenshots/landing.png) | ![Dashboard](screenshots/dashboard.png) | ![Board](screenshots/board.png) |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm**, **pnpm**, or **bun**

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/roompulse.git
cd roompulse

# Install dependencies
npm install
```

### Run Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── layout/          # App shell, sidebar, navigation
│   └── ui/              # Reusable UI primitives (shadcn/ui)
├── hooks/               # Custom React hooks
├── lib/                 # Utilities, date helpers
├── pages/               # Route-level page components
├── store/               # Zustand state management
├── types/               # TypeScript type definitions
└── main.tsx             # App entry point
```

---

## What I Focused On

- **Visual polish** — Consistent spacing, typography, and color system across light and dark modes
- **Product thinking** — Real UX patterns like skeleton loaders, empty states, error boundaries, and relative dates
- **Component architecture** — Small, reusable components with clear separation of concerns
- **Credibility** — The app looks and feels like a real product, not a tutorial exercise
- **Accessibility** — Semantic HTML, keyboard navigation, proper contrast ratios

---

## Future Improvements

- [ ] Backend integration with authentication and persistent storage
- [ ] Real-time collaboration with WebSocket support
- [ ] Command palette (`Cmd+K`) for quick navigation
- [ ] Global search across boards and tasks
- [ ] Email notifications and task reminders
- [ ] Activity log and audit trail
- [ ] Role-based access control

---

## Lessons Learned

- Building loading and error states from the start makes the product feel significantly more polished
- A well-defined design system (semantic tokens, consistent spacing) saves time and prevents visual inconsistency
- Zustand paired with React Query provides a clean separation between client state and server state
- Small details like relative dates, hover states, and micro-interactions have an outsized impact on perceived quality

---

## Live Demo

🔗 [View Live Demo](https://pulse-board-flow.lovable.app)

---

## Author

Built by **Your Name** — [GitHub](https://github.com/your-username) · [LinkedIn](https://linkedin.com/in/your-profile)

---

<p align="center">
  <sub>© 2025 RoomPulse. All rights reserved.</sub>
</p>
