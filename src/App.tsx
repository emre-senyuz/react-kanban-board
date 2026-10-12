import { useState } from 'react';
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Layers2, LayoutGrid, Plus, Search, SlidersHorizontal, RotateCcw, ArrowUpRight, Check, Sparkles } from 'lucide-react';
import { Column } from './Column';
import { TaskEditor } from './TaskEditor';
import { useTasks } from './useTasks';
import { demoTasks, labels, priorities, statuses } from './model';
import type { Priority, Status, Task, TaskDraft } from './model';
export default function App() {
  const { tasks, setTasks, storageError } = useTasks();
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState<Priority | 'All'>('All');
  const [editor, setEditor] = useState<{ task?: Task; status: Status } | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const active = tasks.find(t => t.id === activeId);
  const filtered = !!search.trim() || priority !== 'All';
  const visible = tasks.filter(t => t.title.toLowerCase().includes(search.trim().toLowerCase()) && (priority === 'All' || t.priority === priority));
  const completed = tasks.filter(t => t.status === 'done').length;
  function move(id: string, status: Status) { setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t)); setMessage(`Task moved to ${labels[status]}.`); }
  function dragEnd({ active: dragged, over }: DragEndEvent) {
    setActiveId(null);
    if (!over || dragged.id === over.id) return;
    const destination = tasks.find(t => t.id === over.id);
    const targetStatus = destination?.status ?? statuses.find(s => over.id === `column-${s}`);
    if (!targetStatus) return;
    setTasks(prev => {
      const from = prev.findIndex(t => t.id === dragged.id);
      if (from < 0) return prev;
      const next = prev.map(t => t.id === dragged.id ? { ...t, status: targetStatus } : t);
      const to = destination ? next.findIndex(t => t.id === destination.id) : -1;
      // Use full-list positions so hidden tasks are retained during filtered drags.
      if (to >= 0) return arrayMove(next, from, to);
      const [moved] = next.splice(from, 1);
      next.push(moved);
      return next;
    });
    setMessage(`Task moved to ${labels[targetStatus]}.`);
  }
  function save(draft: TaskDraft) {
    if (editor?.task) { const id = editor.task.id; setTasks(prev => prev.map(t => t.id === id ? { ...draft, id } : t)); setMessage('Task updated.'); }
    else { setTasks(prev => [...prev, { ...draft, id: crypto.randomUUID() }]); setMessage('Task created.'); }
    setEditor(null);
  }
  return <div className="app-shell">
    <aside className="rail"><a href="#main" className="brand-mark" aria-label="Forma home"><Layers2 size={24}/></a><div className="rail-divider"/><a href="#main" className="rail-active" aria-label="My board"><LayoutGrid size={21}/></a><span className="rail-bottom">F</span></aside>
    <div className="workspace"><header className="topbar"><a href="#main" className="wordmark">forma<span>.</span></a><span className="topbar-divider"/><span className="workspace-label">Personal workspace</span><span className="local-badge"><span/> Local workspace</span><span className="avatar">ME</span></header>
    <main id="main"><div className="breadcrumb">Workspace <span>/</span> <span>My board</span></div>
      <section className="page-heading"><div><div className="eyebrow"><span/> A LITTLE STRUCTURE. A LOT OF POSSIBILITY.</div><h1>Make space for progress<span>.</span></h1><p>Your ideas, your pace. Bring a little clarity to what’s next.</p></div><button className="primary new-task" onClick={() => setEditor({ status:'todo' })}><Plus size={18}/> New task</button></section>
      <section className="overview" aria-label="Board overview"><div className="overview-copy"><span className="overview-icon"><Sparkles size={20}/></span><div><h2>A clear plan, a lighter mind.</h2><p>One task at a time is all it takes.</p></div></div><div className="progress-summary"><div><span><strong>{completed}</strong> of {tasks.length} tasks complete</span><strong>{tasks.length ? Math.round(completed / tasks.length * 100) : 0}%</strong></div><progress aria-label="Tasks complete" max={tasks.length || 1} value={completed}/></div><ArrowUpRight className="overview-arrow" size={23}/></section>
      <div className="board-toolbar"><div className="board-tab"><LayoutGrid size={17}/> Board <span>{tasks.length}</span></div><div className="filters"><label className="search"><Search size={16}/><input aria-label="Search tasks by title" placeholder="Search tasks…" value={search} onChange={e => setSearch(e.target.value)}/></label><label className="priority-filter"><SlidersHorizontal size={15}/><select aria-label="Filter by priority" value={priority} onChange={e => setPriority(e.target.value as Priority | 'All')}><option value="All">All priorities</option>{priorities.map(p => <option key={p} value={p}>{p} priority</option>)}</select></label>{filtered && <button className="clear-filter" onClick={() => { setSearch(''); setPriority('All'); }}>Clear</button>}</div></div>
      {storageError && <p role="alert" className="error storage-error">{storageError}</p>}
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={e => setActiveId(String(e.active.id))} onDragCancel={() => setActiveId(null)} onDragEnd={dragEnd}><div className="board">{statuses.map(status => <Column key={status} status={status} tasks={visible.filter(t => t.status === status)} total={tasks.filter(t => t.status === status).length} filtered={filtered} onAdd={s => setEditor({ status:s })} onEdit={task => setEditor({ task, status:task.status })} onMove={move} onDelete={task => { if (window.confirm(`Delete “${task.title}”? This cannot be undone.`)) { setTasks(prev => prev.filter(t => t.id !== task.id)); setMessage('Task deleted.'); } }}/>)}</div><DragOverlay>{active && <div className="drag-preview"><span className="category">{active.category}</span><h3>{active.title}</h3></div>}</DragOverlay></DndContext>
      <footer><span><Check size={14}/> {storageError ? 'Working in this browser' : 'Changes saved on this device'}</span><button onClick={() => { if (window.confirm('Restore the 9 demo tasks? This replaces all your current tasks.')) { setTasks(demoTasks()); setSearch(''); setPriority('All'); setMessage('Demo data restored.'); } }}><RotateCcw size={13}/> Restore demo data</button></footer>
      <div role="status" aria-live="polite" className="feedback">{message}</div>
    </main></div>{editor && <TaskEditor task={editor.task} status={editor.status} onClose={() => setEditor(null)} onSave={save}/>}
  </div>;
}
