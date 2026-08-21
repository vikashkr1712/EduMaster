import { client } from './client.js'

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || ''
const verificationCache = new Map()

export const getCertificates = () => client('/certificates')

export const getCertificate = (id) =>
  client(`/certificates/${encodeURIComponent(id)}`)

export const verifyCertificate = (code) => {
  const key = String(code).toUpperCase()
  if (verificationCache.has(key)) return verificationCache.get(key)
  const request = client(`/certificates/verify/${encodeURIComponent(key)}`)
    .catch((error) => { verificationCache.delete(key); throw error })
  verificationCache.set(key, request)
  return request
}

export const generateCertificate = (courseId) =>
  client('/certificates/generate', { method: 'POST', body: { courseId } })

export const getCertificatePdfUrl = (id) =>
  `${API_BASE_URL}/certificates/${encodeURIComponent(id)}/pdf`

export async function downloadCertificatePdf(id, filename = `${id}.pdf`) {
  const response = await fetch(getCertificatePdfUrl(id), { credentials: 'include' })
  if (!response.ok) throw new Error('Could not download this certificate.')
  const blobUrl = URL.createObjectURL(await response.blob())
  const link = document.createElement('a')
  link.href = blobUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
}
