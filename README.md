# react-kanban-board

Forma is a responsive personal Kanban board built with Vite, React, strict TypeScript, Tailwind CSS, dnd-kit, and Lucide icons. No backend, accounts, or API keys.

## Run locally

Requires Node.js 20.19+ or 22.12+ and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. For a production build:

```sh
npm run build
npm run preview
```

## Features

- Nine realistic demo tasks across To Do, In Progress, and Done.
- Create, edit, and delete tasks with title, description, priority, category, and required due date.
- Drag tasks between columns or reorder within a column. Dragging a filtered board preserves hidden tasks.
- Keyboard dragging: focus a drag handle, press Space, use arrow keys, then Space to drop or Escape to cancel. Each card also has a native “Move to” select for reliable keyboard movement.
- Case-insensitive title search combined with priority filtering. Filtered counts show visible/total tasks.
- Modal editor with required-field validation, Escape dismissal, focus trapping, and focus restoration through the native dialog.
- Browser-local persistence, validated saved data, visible storage errors, and confirmed demo restoration/deletion.
- Three desktop columns and horizontally scrolling mobile columns.

Data is stored under `forma-kanban:v1` in localStorage for this origin. Clearing browser data removes it; there is no device or tab synchronization. Demo due dates are relative to the day they are seeded. Task descriptions are optional. Opening a title lets you read its full description.

## Screenshot

_Screenshot placeholder: add a desktop board screenshot here._

## Source

`src/model.ts` defines the task model and demo data. `useTasks.ts` owns persistence. `App.tsx` coordinates filtering and movement; `Column`, `TaskCard`, and `TaskEditor` contain the UI. Styling uses Tailwind utilities alongside component CSS.
