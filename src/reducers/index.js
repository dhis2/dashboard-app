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
import activeModalDimension from './activeModalDimension'
import passiveViewRegistered from './passiveViewRegistered'

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
    activeModalDimension,
    passiveViewRegistered,
})
