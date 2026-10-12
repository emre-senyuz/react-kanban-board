import { useEffect, useState } from 'react';
import { demoTasks, isTask } from './model';
import type { Task } from './model';
const KEY = 'forma-kanban:v1';
function read(): { tasks: Task[]; error: string } {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return { tasks: demoTasks(), error: '' };
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data) || !data.every(isTask) || new Set(data.map(t => t.id)).size !== data.length) throw new Error('Invalid data');
    return { tasks: data, error: '' };
  } catch { return { tasks: demoTasks(), error: 'Saved data could not be loaded. Demo tasks have been restored.' }; }
}
export function useTasks() {
  const [initial] = useState(read);
  const [tasks, setTasks] = useState(initial.tasks);
  const [storageError, setStorageError] = useState(initial.error);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch { setStorageError('Storage is unavailable. Changes will only last for this session.'); } }, [tasks]);
  return { tasks, setTasks, storageError };
}
