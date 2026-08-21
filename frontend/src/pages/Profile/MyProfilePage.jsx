import { useEffect, useState } from 'react'
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
import { getAchievements } from '../../api/achievement.js'
import { getUserOrders } from '../../api/order.js'
import { getQuizHistory } from '../../api/quiz.js'
import { getActivities } from '../../api/notification.js'
import {
  PROFILE_STATS,
} from '../../components/Profile/profileData.js'
import '../../components/Profile/Profile.css'

export default function MyProfilePage() {
  const { user, updateUser } = useAuth()
  const [courses, setCourses] = useState([])
  const [achievements, setAchievements] = useState([])
  const [activities, setActivities] = useState([])
  const [activityLoading, setActivityLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.allSettled([getUserOrders(), getAchievements(), getQuizHistory(), getActivities({ limit: 6 })]).then(([ordersResult, achievementsResult, quizResult, activityResult]) => {
      if (!active) return
      if (ordersResult.status === 'fulfilled') {
        const data = ordersResult.value?.data
        if (data?.stats) updateUser({ stats: data.stats })
        setCourses((data?.enrollments || []).slice(0, 3).map((enrollment, index) => {
          const course = enrollment.course || {}
          const progress = Number(enrollment.progress) || 0
          const status = progress >= 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started'
          return {
            id: course._id || enrollment._id,
            title: course.title || 'EduMaster Course',
            status,
            tint: ['blue', 'green', 'purple'][index % 3],
            imageType: course.imageType || 'development',
            cta: status === 'Completed' ? 'View Certificate' : status === 'In Progress' ? 'Continue Learning' : 'Start Learning',
          }
        }))
      }
      if (achievementsResult.status === 'fulfilled') {
        const tints = ['blue', 'green', 'purple']
        setAchievements((achievementsResult.value?.data?.achievements || []).map((achievement, index) => ({
          ...achievement,
          id: achievement._id,
          tint: tints[index % tints.length],
          date: new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(achievement.unlockedAt)),
        })))
      }
      if (quizResult.status === 'fulfilled' && quizResult.value?.data?.stats) updateUser({ stats: quizResult.value.data.stats })
      if (activityResult.status === 'fulfilled') setActivities(activityResult.value?.data?.activities || [])
      setActivityLoading(false)
    })
    return () => { active = false }
  }, [updateUser])
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
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
            {courses.length === 0 && <p className="profile-api-empty">Your enrolled courses will appear here.</p>}
          </div>
        </SectionCard>

        <SectionCard
          title="My Achievements"
          linkLabel="View All Certificates"
          linkTo="/profile/certificates"
        >
          <div className="profile-achievements-grid">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
            {achievements.length === 0 && <p className="profile-api-empty">Complete a course to unlock your first achievement.</p>}
          </div>
        </SectionCard>

        <div className="profile-bottom-grid">
          <RecentActivity activities={activities} loading={activityLoading} />
          <ProfileCompletion />
        </div>
      </DashboardContent>
    </DashboardLayout>
  )
}
