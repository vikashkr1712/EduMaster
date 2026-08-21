import { useCallback, useEffect, useState } from 'react'
import { createStudentNote, deleteStudentNote, getStudentNotes, updateStudentNote } from '../../../api/lms.js'
import SearchNotes from './SearchNotes.jsx'
import NotesEditor from './NotesEditor.jsx'
import NotesList from './NotesList.jsx'

export default function LessonNotesWorkspace({ courseId, lessonId, updateUser, notify }) {
  const [notes, setNotes] = useState([]); const [search, setSearch] = useState(''); const [editing, setEditing] = useState(null); const [busy, setBusy] = useState(false)
  const load = useCallback(() => getStudentNotes(lessonId, courseId, search).then((response) => setNotes(response.data.notes || [])).catch((error) => notify(error.message, true)), [courseId, lessonId, notify, search])
  useEffect(() => { const timer = window.setTimeout(load, 250); return () => window.clearTimeout(timer) }, [load])
  useEffect(() => { setEditing(null); setSearch('') }, [lessonId])
  const save = async (input) => { setBusy(true); try { const response = editing ? await updateStudentNote(editing._id, input) : await createStudentNote({ courseId, lessonId, ...input }); if (response.data.stats) updateUser({ stats: response.data.stats }); setEditing(null); await load(); notify('Note Saved') } catch (error) { notify(error.message, true) } finally { setBusy(false) } }
  const remove = async (id) => { try { const response = await deleteStudentNote(id); setNotes((value) => value.filter((note) => note._id !== id)); if (response.data.stats) updateUser({ stats: response.data.stats }) } catch (error) { notify(error.message, true) } }
  return <section className="lms-notes-workspace"><div className="lms-workspace-title"><div><h3>Lesson Notes</h3><p>Private notes saved for this lesson.</p></div><SearchNotes value={search} onChange={setSearch} /></div><NotesEditor editing={editing} onSave={save} onCancel={() => setEditing(null)} busy={busy} /><NotesList notes={notes} onEdit={setEditing} onDelete={remove} /></section>
}
