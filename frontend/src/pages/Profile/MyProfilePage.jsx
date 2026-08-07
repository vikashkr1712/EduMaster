import DashboardLayout from '../../components/Dashboard/DashboardLayout.jsx'
import DashboardContent from '../../components/Dashboard/DashboardContent.jsx'
import ProfileHero from '../../components/Profile/ProfileHero.jsx'
import StatsCard from '../../components/Profile/StatsCard.jsx'
import SectionCard from '../../components/Profile/SectionCard.jsx'
import CourseCard from '../../components/Profile/CourseCard.jsx'
import AchievementCard from '../../components/Profile/AchievementCard.jsx'
import RecentActivity from '../../components/Profile/RecentActivity.jsx'
import ProfileCompletion from '../../components/Profile/ProfileCompletion.jsx'
import { useAuth } from '../../components/Auth/AuthProvider.jsx'
import {
  PROFILE_STATS,
  PROFILE_COURSES,
  PROFILE_ACHIEVEMENTS,
} from '../../components/Profile/profileData.js'
import '../../components/Profile/Profile.css'

export default function MyProfilePage() {
  const { user } = useAuth()
  const stats = PROFILE_STATS.map((stat) => ({
    ...stat,
    // These values are optional in the current API. Never substitute design
    // placeholders when the authenticated user does not have them yet.
    value: Number.isFinite(Number(user?.stats?.[stat.valueKey]))
      ? Number(user.stats[stat.valueKey])
      : 0,
  }))

  return (
    <DashboardLayout>
      <DashboardContent>
        <ProfileHero />

        <div className="profile-stats-grid">
          {stats.map((stat) => (
            <StatsCard key={stat.id} {...stat} />
          ))}
        </div>

        <SectionCard title="My Courses" linkLabel="View All Courses" linkTo="/profile/courses">
          <div className="profile-courses-grid">
            {PROFILE_COURSES.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="My Achievements"
          linkLabel="View All Certificates"
          linkTo="/profile/certificates"
        >
          <div className="profile-achievements-grid">
            {PROFILE_ACHIEVEMENTS.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </SectionCard>

        <div className="profile-bottom-grid">
          <RecentActivity />
          <ProfileCompletion />
        </div>
      </DashboardContent>
    </DashboardLayout>
  )
}
