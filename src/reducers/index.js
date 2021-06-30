import { combineReducers } from 'redux'
import activeModalDimension from './activeModalDimension'
import controlBar from './controlBar'
import dashboards from './dashboards'
import dashboardsFilter from './dashboardsFilter'
import dimensions from './dimensions'
import editDashboard from './editDashboard'
import itemActiveTypes from './itemActiveTypes'
import itemFilters from './itemFilters'
import messages from './messages'
import passiveViewRegistered from './passiveViewRegistered'
import printDashboard from './printDashboard'
import selected from './selected'
import showDescription from './showDescription'
import visualizations from './visualizations'

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
    showDescription,
    itemActiveTypes,
})
