import { combineReducers } from 'redux'

import dashboards from './dashboards'
import selected from './selected'
import dashboardsFilter from './dashboardsFilter'
import controlBar from './controlBar'
import visualizations from './visualizations'
import editDashboard from './editDashboard'
import printDashboard from './printDashboard'
import messages from './messages'
import user from './user'
import alert from './alert'
import itemFilters from './itemFilters'
import style from './style'
import dimensions from './dimensions'
import settings from './settings'
import activeModalDimension from './activeModalDimension'
import windowHeight from './windowHeight'

export default combineReducers({
    dashboards,
    selected,
    dashboardsFilter,
    controlBar,
    visualizations,
    messages,
    user,
    editDashboard,
    printDashboard,
    itemFilters,
    style,
    alert,
    dimensions,
    settings,
    activeModalDimension,
    windowHeight,
})
