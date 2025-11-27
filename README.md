# Task Management UI

A modern React-based frontend for task management built with Next.js 14, TypeScript, Zustand, and shadcn/ui.

## Quick Start

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm run dev

# Application runs on http://localhost:3000
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **State Management**: Zustand
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **Data Fetching**: SWR
- **Validation**: Zod
- **Icons**: Lucide React

## Project Structure

```bash
app/
  ├── layout.tsx              # Root layout
  ├── page.tsx                # Home page
  └── globals.css             # Global styles

components/
  ├── ui/                     # shadcn/ui components
  │   ├── button.tsx
  │   ├── input.tsx
  │   ├── textarea.tsx
  │   ├── select.tsx
  │   ├── card.tsx
  │   ├── badge.tsx
  │   ├── alert.tsx
  │   └── alert-dialog.tsx
  ├── TaskForm.tsx            # Task creation form
  ├── TaskItem.tsx            # Individual task
  ├── TaskList.tsx            # Task list container
  └── Header.tsx              # Header component

store/
  └── taskStore.ts            # Zustand state management

lib/
  ├── api.ts                  # API client
  ├── schemas.ts              # Zod validation
  └── utils.ts                # Utilities

```

## State Management with Zustand

The application uses Zustand for simple, efficient state management:

### Task Store (`store/taskStore.ts`)

```typescript
interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  notification: { type: 'success' | 'error' | null; message: string };

  // Actions
  setTasks(tasks: Task[]): void;
  addTask(task: Task): void;
  updateTask(id: string, task: Partial<Task>): void;
  deleteTask(id: string): void;
  setNotification(type, message): void;
}
```

### Usage in Components

```typescript
import { useTaskStore } from '@/store/taskStore';

function MyComponent() {
  const { tasks, addTask, notification } = useTaskStore();

  return <>...</>;
}
```

## UI Components (shadcn/ui)

All UI components use shadcn/ui for consistency and accessibility:

- **Button**: Multiple variants with loading states
- **Input/Textarea**: Form inputs with validation styling
- **Select**: Accessible dropdown component
- **Card**: Container with consistent styling
- **Alert**: Notification component
- **AlertDialog**: Confirmation dialogs
- **Badge**: Status displays

## Validation

Zod schemas provide runtime validation:

- **Create Task**: Title required, max 255 characters
- **Update Task**: Partial updates with optional fields
- **Status**: PENDING, IN_PROGRESS, or COMPLETED

## Environment Variables

Create `.env.local\` file:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Components

### TaskForm

Form component for creating new tasks with validation and error display.

### TaskItem

Component for displaying and editing individual tasks with status updates.

### TaskList

Container component that manages task list state and data fetching with SWR.

### Header

Header component with application title and description.

## Features

- Create, read, update, delete tasks
- Real-time status updates
- Form validation with Zod
- Toast notifications
- Responsive design with Tailwind CSS
- Accessible UI with shadcn/ui
- State management with Zustand
- Efficient data fetching with SWR

## Build for Production

```bash
pnpm run build
pnpm start
```
