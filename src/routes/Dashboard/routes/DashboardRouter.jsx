import { Navigate } from 'react-router-dom'
import DashboardV2Page from '../v2'
import { TopicHubRoute } from '../../TopicHub/routes'

export function DashboardPageRouter() {
  return <Navigate to={TopicHubRoute.moduleRoute} />
}
