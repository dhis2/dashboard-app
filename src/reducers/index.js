import { combineReducers } from 'redux'

import dashboards from './dashboards'
import selected from './selected'
import dashboardsFilter from './dashboardsFilter'
import controlBar from './controlBar'
import visualizations from './visualizations'
import editDashboard from './editDashboard'
import printDashboard from './printDashboard'
import messages from './messages'
import itemFilters from './itemFilters'
import dimensions from './dimensions'
import activeModalDimension from './activeModalDimension'
import passiveViewRegistered from './passiveViewRegistered'
import isOnline from './isOnline'
import isRecording from './isRecording'
import showDescription from './showDescription'
import itemActiveTypes from './itemActiveTypes'

export default combineReducers({
    dashboards,
    selected,
    dashboardsFilter,
    controlBar,
    visualizations,
    messages,
    editDashboard,
    printDashboard,
    itemFilters,
    dimensions,
    activeModalDimension,
    passiveViewRegistered,
    isOnline,
    isRecording,
    showDescription,
    itemActiveTypes,
})
