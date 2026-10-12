import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, Check, Circle, CircleDashed } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { labels } from './model';
import type { Status, Task } from './model';
interface Props { status: Status; tasks: Task[]; total: number; filtered: boolean; onAdd: (status: Status) => void; onEdit: (task: Task) => void; onDelete: (task: Task) => void; onMove: (id: string, status: Status) => void }
export function Column({ status, tasks, total, filtered, onAdd, onEdit, onDelete, onMove }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: `column-${status}`, data: { status } });
  return <section ref={setNodeRef} className={`board-column column-${status} ${isOver ? 'column-over' : ''}`} aria-label={labels[status]}>
    <div className="column-heading"><div className="flex items-center gap-2.5"><span className="status-icon">{status === 'done' ? <Check size={15}/> : status === 'progress' ? <CircleDashed size={16}/> : <Circle size={14}/>}</span><h2>{labels[status]}</h2><span className="count">{filtered ? `${tasks.length}/${total}` : total}</span></div><button className="icon-button" onClick={() => onAdd(status)} aria-label={`Add task to ${labels[status]}`}><Plus size={18}/></button></div>
    <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}><div className="task-list">{tasks.map(task => <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} onMove={onMove}/>)}</div></SortableContext>
    {tasks.length === 0 && <div className="empty-column"><CircleDashed size={26}/><p>{filtered ? 'No matching tasks' : 'A little room to make progress'}</p><span>{filtered ? 'Try another search or priority.' : 'Drop a task here or add a new one.'}</span></div>}
    <button className="add-column" onClick={() => onAdd(status)}><Plus size={16}/> Add task</button>
  </section>;
}
