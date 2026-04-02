# RoomPulse

Modern task and board management for small teams, creators, and freelancers.

RoomPulse is a clean SaaS-style project management app designed to help users organize work visually with Kanban boards, smart task tracking, and a polished dashboard experience.

## Overview

RoomPulse was built around a simple idea: many project management tools feel either too complex or too limited. This project aims to sit in the middle — offering a modern, user-friendly experience with enough structure for real workflows while staying simple and approachable.

The app includes boards, task management, dashboard analytics, comments, filters, dark mode, and responsive layouts, all presented in a clean product-style interface.

## Features

- Kanban-style board management
- Drag-and-drop task organization
- Task priorities, due dates, and tags
- Dashboard with progress and activity insights
- Comments and collaboration flow
- Search and filtering
- Dark mode support
- Skeleton loading states
- Error handling states
- Responsive design for desktop, tablet, and mobile
- Human-readable relative dates

## Tech Stack

- **Frontend:** React, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **State Management:** Zustand
- **Server State / Data Fetching:** TanStack React Query
- **Routing:** React Router
- **Charts:** Recharts
- **Drag and Drop:** @hello-pangea/dnd
- **Animations:** Framer Motion
- **Date Utilities:** date-fns
- **Build Tool:** Vite

## Screenshots

![RoomPulse Screenshot 1](Screenshot%202026-04-01%20192311.png)
![RoomPulse Screenshot 2](Screenshot%202026-04-01%20192546.png)
![RoomPulse Screenshot 3](Screenshot%202026-04-01%20192649.png)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, pnpm, or bun

### Installation

    git clone https://github.com/lazarbukeljovic-dotcom/pulse-board-flow.git
    cd pulse-board-flow
    npm install

### Run Locally

    npm run dev

### Build for Production

    npm run build
    npm run preview

## Project Structure

    src/
    ├── components/
    ├── hooks/
    ├── lib/
    ├── pages/
    ├── store/
    ├── types/
    └── main.tsx

## What I Focused On

While building RoomPulse, I mainly focused on:

- creating a clean and modern SaaS-style UI
- improving UX with better spacing, hierarchy, and readability
- making the dashboard feel more complete and useful
- building reusable components
- adding polished product details such as skeleton loaders, error states, and relative dates
- keeping the project responsive across screen sizes

## Future Improvements

Possible future improvements include:

- backend integration with persistent data storage
- authentication with real user accounts
- real-time collaboration
- command palette for faster navigation
- global search across boards and tasks
- activity log and audit trail
- role-based access control

## Lessons Learned

This project helped me improve my skills in:

- building a multi-page React application
- structuring components more clearly
- improving UI consistency
- creating better loading and error states
- balancing clean design with practical functionality
- thinking more about product quality, not just features

## Live Demo

[View Live Demo](https://roompulse.lovable.app/)

## Repository

[GitHub Repository](https://github.com/lazarbukejlovic-dotcom/roompulse)

## Author

Built by Lazar Bukejlovic

- GitHub: [lazarbukeljovic-dotcom](https://github.com/lazarbukeljovic-dotcom)
