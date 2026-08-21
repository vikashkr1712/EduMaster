import { useRef, useState } from 'react'

const ALLOWED = ['pdf', 'doc', 'docx', 'zip']
export default function AssignmentUpload({ busy, onSubmit }) {
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [remarks, setRemarks] = useState('')
  const [validation, setValidation] = useState('')
  const choose = (selected) => {
    setValidation('')
    if (!selected) return
    const extension = selected.name.split('.').pop()?.toLowerCase()
    if (!ALLOWED.includes(extension)) { setValidation('Only PDF, DOC, DOCX, and ZIP files are allowed.'); return }
    if (selected.size > 20 * 1024 * 1024) { setValidation('File size must not exceed 20 MB.'); return }
    setFile(selected)
  }
  return <div className="lms-upload"><input ref={inputRef} type="file" accept=".pdf,.doc,.docx,.zip" onChange={(event) => choose(event.target.files?.[0])} hidden /><button type="button" className="lms-upload-drop" onClick={() => inputRef.current?.click()}><span>↑</span><strong>{file ? file.name : 'Choose your solution file'}</strong><small>PDF, DOC, DOCX or ZIP · Maximum 20 MB</small></button>{validation && <p role="alert">{validation}</p>}<textarea value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="Remarks for your instructor (optional)" maxLength={2000} /><button type="button" className="lms-primary" disabled={!file || busy} onClick={() => onSubmit(file, remarks)}>{busy ? 'Uploading…' : 'Upload Solution'}</button></div>
}
