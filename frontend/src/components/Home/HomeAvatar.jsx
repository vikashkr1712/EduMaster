import './HomeAvatar.css'
import rohitPhoto from '../../assets/images/home/learner-rohit-sharma.webp'
import priyaPhoto from '../../assets/images/home/learner-priya-mehta.webp'
import amanPhoto from '../../assets/images/home/learner-aman-verma.webp'
import nehaPhoto from '../../assets/images/home/learner-neha-sharma.webp'
import karanPhoto from '../../assets/images/home/learner-karan-malhotra.webp'

export const homeFaces = {
  rohit: rohitPhoto,
  priya: priyaPhoto,
  aman: amanPhoto,
  neha: nehaPhoto,
  karan: karanPhoto,
}

export default function HomeAvatar({ name, src, size = 40 }) {
  return (
    <img
      className="home-profile-photo"
      src={src}
      alt={`${name || 'EduMaster learner'} profile`}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
    />
  )
}
