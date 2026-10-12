export const statuses = ['todo', 'progress', 'done'] as const;
export type Status = typeof statuses[number];
export const labels: Record<Status, string> = { todo: 'To Do', progress: 'In Progress', done: 'Done' };
export const priorities = ['Low', 'Medium', 'High'] as const;
export type Priority = typeof priorities[number];
export const categories = ['Design', 'Development', 'Research', 'Personal'] as const;
export type Category = typeof categories[number];
export interface Task { id: string; title: string; description: string; priority: Priority; dueDate: string; category: Category; status: Status }
export type TaskDraft = Omit<Task, 'id'>;
export function validDate(value: string): boolean { return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value; }
export function isTask(value: unknown): value is Task {
  if (!value || typeof value !== 'object') return false;
  const t = value as Record<string, unknown>;
  return typeof t.id === 'string' && !!t.id && typeof t.title === 'string' && !!t.title.trim() && typeof t.description === 'string' && typeof t.dueDate === 'string' && validDate(t.dueDate) && priorities.includes(t.priority as Priority) && categories.includes(t.category as Category) && statuses.includes(t.status as Status);
}
export function demoTasks(): Task[] {
  const date = (offset: number) => { const d = new Date(); d.setDate(d.getDate() + offset); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  return [
    { id:'demo-1', title:'Explore homepage concepts', description:'Collect inspiration and sketch a few directions for the portfolio refresh.', priority:'High', category:'Design', status:'todo', dueDate:date(2) },
    { id:'demo-2', title:'Research accessible color palettes', description:'Find a palette that feels fresh and meets WCAG contrast requirements.', priority:'Medium', category:'Research', status:'todo', dueDate:date(3) },
    { id:'demo-3', title:'Plan next week’s priorities', description:'Make a little space to reflect, then choose three things that matter.', priority:'Low', category:'Personal', status:'todo', dueDate:date(5) },
    { id:'demo-4', title:'Build the component library', description:'Create reusable buttons, inputs, and cards with consistent states.', priority:'High', category:'Development', status:'progress', dueDate:date(1) },
    { id:'demo-5', title:'Design the project detail page', description:'Bring the story to life with clear typography and a thoughtful layout.', priority:'Medium', category:'Design', status:'progress', dueDate:date(3) },
    { id:'demo-6', title:'Write my about page', description:'Turn a collection of notes into a short, honest introduction.', priority:'Low', category:'Personal', status:'progress', dueDate:date(4) },
    { id:'demo-7', title:'Set up the project workspace', description:'Get the development environment, repository, and folder structure ready.', priority:'High', category:'Development', status:'done', dueDate:date(-2) },
    { id:'demo-8', title:'Gather portfolio references', description:'Save a few inspiring portfolios and note what makes them work.', priority:'Medium', category:'Research', status:'done', dueDate:date(-1) },
    { id:'demo-9', title:'Define the visual direction', description:'Establish a calm, minimal foundation for the new personal brand.', priority:'Medium', category:'Design', status:'done', dueDate:date(0) },
  ];
}
