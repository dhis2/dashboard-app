import { createContext } from 'react'
import { VIEW } from '../modules/dashboardModes'

export const DashboardModeContext = createContext(VIEW)
export const { Provider, Consumer } = DashboardModeContext
