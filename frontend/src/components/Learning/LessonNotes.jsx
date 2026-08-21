import { useEffect, useState } from 'react'

export default function LessonNotes({ lessonId, notes, onCreate, onUpdate, onDelete }) {
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingContent, setEditingContent] = useState('')
  const [busy, setBusy] = useState(false)
  const lessonNotes = notes.filter((note) => note.lessonId === lessonId)

  useEffect(() => { setEditingId(null); setEditingContent(''); setContent('') }, [lessonId])

  const addNote = async () => {
    if (!content.trim() || busy) return
    setBusy(true)
    try { await onCreate(content.trim()); setContent('') } catch { /* Parent shows the API error. */ } finally { setBusy(false) }
  }

  const saveEdit = async () => {
    if (!editingContent.trim() || busy) return
    setBusy(true)
    try { await onUpdate(editingId, editingContent.trim()); setEditingId(null); setEditingContent('') } catch { /* Parent shows the API error. */ } finally { setBusy(false) }
  }

  return (
    <div className="learn-notes-panel">
      <div className="learn-note-compose">
        <textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Add a note for this lesson…" maxLength={3000} />
        <button type="button" onClick={addNote} disabled={!content.trim() || busy}>Add Note</button>
      </div>
      <div className="learn-notes-list">
        {lessonNotes.length === 0 && <p className="learn-empty-copy">Your lesson notes will appear here.</p>}
        {lessonNotes.map((note) => (
          <article key={note._id} className="learn-note">
            {editingId === note._id ? (
              <>
                <textarea value={editingContent} onChange={(event) => setEditingContent(event.target.value)} maxLength={3000} />
                <div><button type="button" onClick={saveEdit} disabled={busy}>Save</button><button type="button" onClick={() => setEditingId(null)}>Cancel</button></div>
              </>
            ) : (
              <>
                <p>{note.content}</p>
                <small>{new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(note.updatedAt || note.createdAt))}</small>
                <div>
                  <button type="button" onClick={() => { setEditingId(note._id); setEditingContent(note.content) }}>Edit</button>
                  <button type="button" className="is-delete" onClick={() => window.confirm('Delete this note?') && onDelete(note._id)}>Delete</button>
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
