import { client } from './client.js'

export const getAchievements = () => client('/achievements')
