import { combineReducers } from 'redux'

import dashboards from './dashboards'
import selected from './selected'
import dashboardsFilter from './dashboardsFilter'
import controlBar from './controlBar'
import visualizations from './visualizations'
import editDashboard from './editDashboard'
import printDashboard from './printDashboard'
import messages from './messages'
import username from './username'
import alert from './alert'
import itemFilters from './itemFilters'
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
    username,
    editDashboard,
    printDashboard,
    itemFilters,
    alert,
    dimensions,
    activeModalDimension,
    passiveViewRegistered,
})
