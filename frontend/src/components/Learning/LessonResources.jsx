const RESOURCE_COLORS = { PDF: 'red', ZIP: 'orange', 'Source Code': 'blue', Slides: 'purple', Assignment: 'green' }

function ResourceIcon({ type }) {
  return <span className={`learn-resource-icon is-${RESOURCE_COLORS[type] || 'blue'}`} aria-hidden="true">{type === 'ZIP' ? 'ZIP' : type === 'Source Code' ? '</>' : type.slice(0, 3).toUpperCase()}</span>
}

export default function LessonResources({ resources = [], courseId, lessonId, updateUser, notify }) {
  const download = async (resource) => {
    if (!courseId) return
    try { const response = await trackResourceDownload({ courseId, lessonId, resourceId: resource.resourceId }); if (response.data.stats) updateUser?.({ stats: response.data.stats }) } catch (error) { notify?.(error.message, true) }
  }
  return (
    <section className="learn-resources-card">
      <h3><span aria-hidden="true">▣</span> Resources <small>{resources.length}</small></h3>
      {resources.length === 0 ? <p className="learn-empty-copy">No resources for this lesson.</p> : (
        <div className="learn-resource-list">
          {resources.map((resource) => (
            <a key={resource.resourceId} href={resource.url} target="_blank" rel="noreferrer" download={resource.type === 'ZIP' ? '' : undefined} onClick={() => download(resource)}>
              <ResourceIcon type={resource.type} />
              <span><strong>{resource.title}</strong><small>{resource.type} · {resource.size || 'Resource'}</small></span>
              <b aria-label="Download resource">↓</b>
            </a>
          ))}
        </div>
      )}
    </section>
  )
}
import { trackResourceDownload } from '../../api/lms.js'
