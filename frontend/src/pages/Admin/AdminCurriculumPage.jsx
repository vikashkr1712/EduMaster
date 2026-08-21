import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  createAdminLesson, createAdminModule, deleteAdminLesson, deleteAdminModule,
  getAdminCurriculum, reorderAdminLessons, reorderAdminModules, updateAdminLesson, updateAdminModule,
} from '../../api/admin.js'
import AdminConfirmModal from '../../components/Admin/AdminConfirmModal.jsx'
import AdminCurriculumFormModal from '../../components/Admin/AdminCurriculumFormModal.jsx'
import AdminIcon from '../../components/Admin/AdminIcons.jsx'
import { useNotifications } from '../../components/Notifications/NotificationProvider.jsx'
import './AdminCourses.css'
import './AdminCurriculum.css'

const errorCopy = (error) => {
  if (error?.status === 401) return 'Your Admin session has expired. Please sign in again.'
  if (error?.status === 403) return 'Administrator permission is required to manage curriculum.'
  if (error?.status === 404) return error.message || 'The requested course or curriculum item was not found.'
  if (error?.status === 409) return error.message || 'This item is linked to learner data and cannot be deleted.'
  if (error?.code === 'NETWORK' || error?.code === 'OFFLINE') return 'Unable to reach the server. Check your connection and retry.'
  return error?.message || 'Unable to complete the curriculum request.'
}

const swap = (items, index, direction, getId) => {
  const target = index + direction
  if (target < 0 || target >= items.length) return null
  const next = [...items]; [next[index], next[target]] = [next[target], next[index]]
  return next.map(getId)
}

export default function AdminCurriculumPage() {
  const { courseId } = useParams()
  const notifications = useNotifications()
  const [curriculum, setCurriculum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState(null)
  const [confirmation, setConfirmation] = useState(null)
  const [pending, setPending] = useState('')

  const loadCurriculum = useCallback(async () => {
    setLoading(true); setError(null)
    try { const response = await getAdminCurriculum(courseId); setCurriculum(response?.data ?? null) }
    catch (requestError) { setError(requestError) }
    finally { setLoading(false) }
  }, [courseId])

  useEffect(() => { loadCurriculum() }, [loadCurriculum])
  const closeForm = useCallback(() => { if (!pending) setForm(null) }, [pending])

  const applyMutation = (response) => {
    const next = response?.data?.curriculum || response?.data
    if (next?.course && Array.isArray(next.modules)) setCurriculum(next)
  }

  const submitForm = async (payload) => {
    if (!form) return
    const action = `${form.mode}-${form.kind}`
    setPending(action)
    try {
      let response
      if (form.kind === 'module') response = form.mode === 'create'
        ? await createAdminModule(courseId, payload)
        : await updateAdminModule(courseId, form.item.moduleId, payload)
      else response = form.mode === 'create'
        ? await createAdminLesson(courseId, form.moduleId, payload)
        : await updateAdminLesson(courseId, form.moduleId, form.item.lessonId, payload)
      applyMutation(response)
      notifications.success(`${form.kind === 'module' ? 'Module' : 'Lesson'} ${form.mode === 'create' ? 'added' : 'updated'}.`)
      setForm(null)
    } catch (requestError) { notifications.error(errorCopy(requestError)) }
    finally { setPending('') }
  }

  const confirmDelete = async () => {
    if (!confirmation) return
    setPending(`delete-${confirmation.kind}`)
    try {
      const response = confirmation.kind === 'module'
        ? await deleteAdminModule(courseId, confirmation.moduleId)
        : await deleteAdminLesson(courseId, confirmation.moduleId, confirmation.item.lessonId)
      applyMutation(response)
      notifications.success(`${confirmation.kind === 'module' ? 'Module' : 'Lesson'} deleted.`)
      setConfirmation(null)
    } catch (requestError) {
      notifications.error(errorCopy(requestError))
      setConfirmation(null)
    } finally { setPending('') }
  }

  const moveModule = async (index, direction) => {
    const ids = swap(curriculum.modules, index, direction, (courseModule) => courseModule.moduleId)
    if (!ids) return
    setPending('reorder-modules')
    try { const response = await reorderAdminModules(courseId, ids); applyMutation(response); notifications.success('Module reordered.') }
    catch (requestError) { notifications.error(errorCopy(requestError)) }
    finally { setPending('') }
  }

  const moveLesson = async (courseModule, index, direction) => {
    const ids = swap(courseModule.lessons, index, direction, (lesson) => lesson.lessonId)
    if (!ids) return
    setPending(`reorder-lessons-${courseModule.moduleId}`)
    try { const response = await reorderAdminLessons(courseId, courseModule.moduleId, ids); applyMutation(response); notifications.success('Lesson reordered.') }
    catch (requestError) { notifications.error(errorCopy(requestError)) }
    finally { setPending('') }
  }

  if (loading) return <div className="admin-curriculum-loading" aria-busy="true" aria-label="Loading curriculum"><span /><span /><span /></div>
  if (error || !curriculum?.course) return <div className="admin-curriculum-state" role="alert"><AdminIcon name="curriculum" size={32} /><h1>Unable to load curriculum</h1><p>{errorCopy(error)}</p><button type="button" className="admin-button admin-button--primary" onClick={loadCurriculum}>Retry</button></div>

  const { course, modules = [], summary = {} } = curriculum
  const globallyPending = Boolean(pending)
  return (
    <div className="admin-curriculum">
      <div className="admin-curriculum-heading">
        <div><Link to="/admin/courses"><AdminIcon name="arrowLeft" size={17} />Back to courses</Link><h1>Course Curriculum</h1><p>Manage the module and lesson structure consumed by the student player.</p></div>
        <button type="button" className="admin-button admin-button--primary" onClick={() => setForm({ kind: 'module', mode: 'create' })} disabled={globallyPending}><AdminIcon name="plus" size={18} />Add Module</button>
      </div>

      <section className="admin-curriculum-course" aria-label="Course curriculum summary">
        <div><span className={`admin-course-status admin-course-status--${course.isPublished ? 'published' : 'draft'}`}>{course.isPublished ? 'Published' : 'Draft'}</span><h2>{course.title}</h2><p>/{course.slug}</p></div>
        <dl><div><dt>Modules</dt><dd>{summary.modules || 0}</dd></div><div><dt>Lessons</dt><dd>{summary.lessons || 0}</dd></div></dl>
      </section>

      {modules.length === 0 ? <section className="admin-curriculum-empty"><AdminIcon name="curriculum" size={38} /><h2>No curriculum has been created yet.</h2><p>Start with a module, then add its lessons and resources.</p><button type="button" className="admin-button admin-button--primary" onClick={() => setForm({ kind: 'module', mode: 'create' })}><AdminIcon name="plus" size={18} />Add First Module</button></section>
        : <div className="admin-module-list">{modules.map((courseModule, moduleIndex) => {
          const moduleReordering = pending === 'reorder-modules'
          const lessonReordering = pending === `reorder-lessons-${courseModule.moduleId}`
          return <section className="admin-module-card" key={courseModule.moduleId}>
            <header className="admin-module-card__header">
              <div className="admin-module-card__identity"><span>Module {moduleIndex + 1}</span><h2>{courseModule.title}</h2><p>{courseModule.lessons.length} lesson{courseModule.lessons.length === 1 ? '' : 's'}</p></div>
              <div className="admin-module-card__actions">
                <button type="button" onClick={() => moveModule(moduleIndex, -1)} disabled={globallyPending || moduleIndex === 0} aria-label={`Move module ${courseModule.title} up`}><AdminIcon name="up" size={17} />Up</button>
                <button type="button" onClick={() => moveModule(moduleIndex, 1)} disabled={globallyPending || moduleIndex === modules.length - 1} aria-label={`Move module ${courseModule.title} down`}><AdminIcon name="down" size={17} />Down</button>
                <button type="button" onClick={() => setForm({ kind: 'module', mode: 'edit', item: courseModule })} disabled={globallyPending}><AdminIcon name="edit" size={16} />Edit</button>
                <button type="button" className="is-danger" onClick={() => setConfirmation({ kind: 'module', moduleId: courseModule.moduleId, item: courseModule })} disabled={globallyPending}><AdminIcon name="trash" size={16} />Delete</button>
              </div>
            </header>
            <div className="admin-lesson-list">
              {courseModule.lessons.length === 0 ? <div className="admin-lessons-empty"><p>No lessons in this module.</p><button type="button" onClick={() => setForm({ kind: 'lesson', mode: 'create', moduleId: courseModule.moduleId })}><AdminIcon name="plus" size={16} />Add Lesson</button></div>
                : courseModule.lessons.map((lesson, lessonIndex) => <article className="admin-lesson-row" key={lesson.lessonId}>
                  <div className="admin-lesson-row__number">{moduleIndex + 1}.{lessonIndex + 1}</div>
                  <div className="admin-lesson-row__content"><h3>{lesson.title}</h3><p><span><AdminIcon name="video" size={15} />{lesson.videoProvider || 'YouTube'}</span><span><AdminIcon name="clock" size={15} />{lesson.duration || 'No duration'}</span><span><AdminIcon name="link" size={15} />{lesson.resources?.length || 0} resource{lesson.resources?.length === 1 ? '' : 's'}</span></p></div>
                  <div className="admin-lesson-row__actions">
                    <button type="button" onClick={() => moveLesson(courseModule, lessonIndex, -1)} disabled={globallyPending || lessonIndex === 0} aria-label={`Move lesson ${lesson.title} up`}><AdminIcon name="up" size={16} /><span>Up</span></button>
                    <button type="button" onClick={() => moveLesson(courseModule, lessonIndex, 1)} disabled={globallyPending || lessonIndex === courseModule.lessons.length - 1} aria-label={`Move lesson ${lesson.title} down`}><AdminIcon name="down" size={16} /><span>Down</span></button>
                    <button type="button" aria-label={`Edit lesson ${lesson.title}`} onClick={() => setForm({ kind: 'lesson', mode: 'edit', moduleId: courseModule.moduleId, item: lesson })} disabled={globallyPending}><AdminIcon name="edit" size={16} /><span>Edit</span></button>
                    <button type="button" className="is-danger" aria-label={`Delete lesson ${lesson.title}`} onClick={() => setConfirmation({ kind: 'lesson', moduleId: courseModule.moduleId, item: lesson })} disabled={globallyPending}><AdminIcon name="trash" size={16} /><span>Delete</span></button>
                  </div>
                  {(moduleReordering || lessonReordering) && <span className="admin-lesson-row__saving" role="status">Saving order…</span>}
                </article>)}
              {courseModule.lessons.length > 0 && <button type="button" className="admin-add-lesson" onClick={() => setForm({ kind: 'lesson', mode: 'create', moduleId: courseModule.moduleId })} disabled={globallyPending}><AdminIcon name="plus" size={17} />Add Lesson</button>}
            </div>
          </section>
        })}</div>}

      <AdminCurriculumFormModal open={Boolean(form)} kind={form?.kind} item={form?.item} pending={pending.startsWith('create') || pending.startsWith('edit')} onClose={closeForm} onSubmit={submitForm} />
      <AdminConfirmModal open={Boolean(confirmation)} title={`Delete ${confirmation?.kind === 'module' ? 'Module' : 'Lesson'}?`} confirmLabel={`Delete ${confirmation?.kind || 'item'}`} pending={pending.startsWith('delete')} onCancel={() => !pending && setConfirmation(null)} onConfirm={confirmDelete}>
        <p><strong>{confirmation?.item?.title}</strong> will be permanently removed.</p><p>Deletion is blocked automatically when learner progress or other learning records reference this {confirmation?.kind}.</p>
      </AdminConfirmModal>
    </div>
  )
}
