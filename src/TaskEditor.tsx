import { useEffect, useRef, useState } from 'react';
import { X, Plus, Pencil } from 'lucide-react';
import { categories, labels, priorities, statuses, validDate } from './model';
import type { Task, TaskDraft, Status } from './model';
interface Props { task?: Task; status: Status; onClose: () => void; onSave: (draft: TaskDraft) => void }
export function TaskEditor({ task, status, onClose, onSave }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState<TaskDraft>(task ?? { title: '', description: '', priority: 'Medium', category: 'Design', status, dueDate: '' });
  const [error, setError] = useState('');
  useEffect(() => { const node = dialog.current!; node.showModal(); return () => node.close(); }, []);
  function update<K extends keyof TaskDraft>(key: K, value: TaskDraft[K]) { setDraft(d => ({ ...d, [key]: value })); }
  return <dialog ref={dialog} className="editor" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }} aria-labelledby="editor-title">
    <form onSubmit={e => { e.preventDefault(); if (!draft.title.trim()) { setError('Give your task a title.'); return; } if (!validDate(draft.dueDate)) { setError('Choose a valid due date.'); return; } onSave({ ...draft, title: draft.title.trim(), description: draft.description.trim() }); }}>
      <div className="dialog-heading"><div className="dialog-icon">{task ? <Pencil size={21} /> : <Plus size={23} />}</div><button type="button" className="icon-button" onClick={onClose} aria-label="Close editor"><X size={20} /></button></div>
      <h2 id="editor-title">{task ? 'Edit task' : 'Make room for a new idea'}</h2><p className="muted">{task ? 'A little refinement goes a long way.' : 'Big things start with one small task.'}</p>
      <label>Task title <span className="required">*</span><input autoFocus required maxLength={100} value={draft.title} onChange={e => update('title', e.target.value)} placeholder="What would you like to work on?" /></label>
      <label>Description<textarea rows={3} maxLength={1000} value={draft.description} onChange={e => update('description', e.target.value)} placeholder="Add a little context…" /></label>
      <div className="form-grid"><label>Priority<select value={draft.priority} onChange={e => update('priority', e.target.value as TaskDraft['priority'])}>{priorities.map(p => <option key={p}>{p}</option>)}</select></label><label>Category<select value={draft.category} onChange={e => update('category', e.target.value as TaskDraft['category'])}>{categories.map(c => <option key={c}>{c}</option>)}</select></label><label>Due date <span className="required">*</span><input type="date" required value={draft.dueDate} onChange={e => update('dueDate', e.target.value)} /></label><label>Status<select value={draft.status} onChange={e => update('status', e.target.value as Status)}>{statuses.map(s => <option key={s} value={s}>{labels[s]}</option>)}</select></label></div>
      {error && <p role="alert" className="error">{error}</p>}
      <div className="dialog-actions"><button type="button" className="secondary" onClick={onClose}>Cancel</button><button className="primary" type="submit">{task ? 'Save changes' : 'Create task'}</button></div>
    </form>
  </dialog>;
}
