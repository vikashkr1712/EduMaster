function MedalIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="9" r="5.5" />
      <path d="m10.5 9 1 1 2.2-2.2M8.7 13.4 7 20.5l5-2.7 5 2.7-1.7-7.1" />
    </svg>
  )
}

export default function AchievementCard({ achievement }) {
  const { title, date, tint, badge, description } = achievement

  return (
    <article className={`profile-achievement-card profile-achievement-card--${tint}`}>
      <span className={`profile-tile profile-tile--${tint}`}>
        {badge ? <span className="profile-achievement-badge" aria-hidden="true">{badge}</span> : <MedalIcon />}
      </span>
      <h4 className="profile-achievement-title">{title}</h4>
      {description && <p className="profile-achievement-description">{description}</p>}
      <p className="profile-achievement-date">
        Unlocked on
        <br />
        {date}
      </p>
    </article>
  )
}
