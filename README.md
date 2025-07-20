# Bullet Train

**Purposeful productivity for the directionally-challenged.**

_Bullet Train_ combines the rapid focus of the Bullet Journal with the relentless pace of a Shinkansen to help neurodivergent makers—and anyone who struggles with follow-through—turn intention into momentum.

---

## Why Bullet Train?

- **Executive-Function Friendly** — bite-sized actions, clear visual feedback, gentle nudges.
- **CBT-Informed** - supports habit stacking and positive reinforcement.
- **Minimal By Design** - minimal packages, maximum focus. Only essential UI and tooling.

---

## Tech Stack

| Layer     | Choice                    | Notes                                                            |
| --------- | ------------------------- | ---------------------------------------------------------------- |
| Front-end | React + TypeScript (Vite) | Hot reload via `@vitejs/plugin-react-swc`; Radix UI Slider       |
| Back-end  | Express.js                | Simple REST API divided organized by controllers and routes      |
| Data      | Local JSON                | Currently only local storage; future plans for Prisma + Supabase |

---

## Getting Started

1. Unzip the project archive
2. Navigate to the root directory

```zsh
cd bullet-train
npm install
npm run app # Starts both client (5173) and server (3001)
```

Your app runs at [**http://localhost:5173**](http://localhost:5173) with API requests proxied to [**http://localhost:3001**](http://localhost:3001).

---

## Feature Modules

### Routines

Daily habit checklist that resets each day.

```ts
interface RoutineProps {
  id: string;
  name: string;
  complete: boolean;
  timestamp: number;
  onComplete?: (id: string) => void;
}
```

## Errands

One-time tasks not tied to a calendar.

```ts
interface ErrandProps {
  id: string;
  edit?: boolean;
  name: string;
  complete: boolean;
  timeAssigned?: number;
  timeExecuted?: number;
  showDelete?: boolean;
  onDelete?: (id: string) => void;
  onComplete?: (id: string) => void;
}
```

### Hydration

Custom slider interface for daily water tracking (default goal: 128 oz).

```ts
interface BottleProps {
  dateKey?: string;
  id: string;
  ounces: number[];
  setOunces: (oz: number[]) => void;
}
```

### Calendar / Scheduling _(coming soon)_

Block out your day, visualize structure, and optionally sync with external calendars (Proton, iCal, Google, Outlook, etc).

---

## Roadmap

- [ ] Calendar and Scheduling Component
- [ ] Editable routines (CRUD + history)
- [x] API for hydration tracking
- [ ] Migrate local JSON storage to a database
  - [ ] Evaluate Prisma or a schema-first approach
  - [ ] Optional cloud sync (e.g. Supabase)
  - [ ] Unified storage for same-day data (routines + hydration)
- [x] Github Repository Intro
- Build Contribution Guidelines and usage examples
- Add screenshot images and a logo

---

## License

MIT
