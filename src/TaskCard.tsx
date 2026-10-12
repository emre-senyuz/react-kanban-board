import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CalendarDays, GripVertical, Pencil, Trash2, ArrowRightLeft } from 'lucide-react';
import { labels, statuses } from './model';
import type { Task, Status } from './model';
interface Props { task: Task; onEdit: (task: Task) => void; onDelete: (task: Task) => void; onMove: (id: string, status: Status) => void }
export function TaskCard({ task, onEdit, onDelete, onMove }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id, data: { status: task.status } });
  return <article ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={`task-card ${isDragging ? 'dragging' : ''}`}>
    <div className="card-top"><span className={`category category-${task.category.toLowerCase()}`}>{task.category}</span><button className="drag-handle icon-button" {...attributes} {...listeners} aria-label={`Drag ${task.title}`}><GripVertical size={17} /></button></div>
    <button className="task-title" onClick={() => onEdit(task)}>{task.title}</button><p className="task-description">{task.description || 'No description yet.'}</p>
    <div className="card-meta"><span className={`priority priority-${task.priority.toLowerCase()}`}><span />{task.priority}</span><span className="due-date"><CalendarDays size={13} /><time dateTime={task.dueDate}>{new Date(`${task.dueDate}T12:00:00`).toLocaleDateString('en-US', { month:'short', day:'numeric' })}</time></span></div>
    <div className="card-actions"><label className="move-control"><ArrowRightLeft size={13}/><span className="sr-only">Move {task.title} to</span><select aria-label={`Move ${task.title} to`} value={task.status} onChange={e => onMove(task.id, e.target.value as Status)}>{statuses.map(s => <option value={s} key={s}>Move to {labels[s]}</option>)}</select></label><div className="flex gap-1"><button className="icon-button" aria-label={`Edit ${task.title}`} onClick={() => onEdit(task)}><Pencil size={14}/></button><button className="icon-button delete-button" aria-label={`Delete ${task.title}`} onClick={() => onDelete(task)}><Trash2 size={14}/></button></div></div>
  </article>;
}
