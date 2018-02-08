import { combineReducers } from 'redux';
import arraySort from 'd2-utilizr/lib/arraySort';
import dashboards, * as fromDashboards from './dashboards';
import selected, * as fromSelected from './selected';
import filter, * as fromFilter from './filter';
import controlBar, * as fromControlBar from './controlBar';
import interpretations, * as fromInterpretations from './interpretations';
import visualizations, * as fromVisualizations from './visualizations';
import editDashboard, * as fromEditDashboard from './editDashboard';
import messages, * as fromMessages from './messages';
import user, * as fromUser from './user';
import style, * as fromStyle from './style';

const USER = 'system';

// action types

export const actionTypes = Object.assign(
    {},
    fromDashboards.actionTypes,
    fromSelected.actionTypes,
    fromFilter.actionTypes,
    fromControlBar.actionTypes,
    fromInterpretations.actionTypes,
    fromVisualizations.actionTypes,
    fromMessages.actionTypes,
    fromUser.actionTypes,
    fromEditDashboard.actionTypes,
    fromStyle.actionTypes
);

// reducers

export default combineReducers({
    dashboards,
    selected,
    filter,
    controlBar,
    interpretations,
    visualizations,
    messages,
    user,
    editDashboard,
    style,
});

// map constants to data

const mapConstToData = {
    NAME: 'name',
    ITEMS: 'numberOfItems',
    CREATED: 'created',
    OWNER: 'owner',
};

// selectors

export {
    fromDashboards,
    fromSelected,
    fromFilter,
    fromControlBar,
    fromInterpretations,
    fromVisualizations,
    fromMessages,
    fromEditDashboard,
    fromUser,
    fromStyle,
};

// selected dashboard
export const sGetSelectedDashboard = state =>
    fromEditDashboard.sGetIsEditing(state)
        ? fromEditDashboard.sGetEditDashboard(state)
        : fromDashboards.sGetById(state, fromSelected.sGetSelectedId(state));

// filter dashboards by name
export const sFilterDashboardsByName = (dashboards, filter) =>
    dashboards.filter(d => d.name.toLowerCase().includes(filter.toLowerCase()));

// filter dashboards by owner
export const sFilterDashboardsByOwner = (dashboards, filter) => {
    const ME = fromFilter.ownerData[1]; // TODO
    const OTHERS = fromFilter.ownerData[2]; // TODO

    switch (filter) {
        case ME:
            return dashboards.filter(d => d.owner === USER);
        case OTHERS:
            return dashboards.filter(d => d.owner !== USER);
        default:
            return dashboards;
    }
};

// filter dashboards by order
export const sFilterDashboardsByOrder = (dashboards, filter) => {
    const filterValues = filter.split(':');

    const key = filterValues[0];
    const direction = filterValues[1];

    return arraySort(dashboards, direction, mapConstToData[key]);
};

// selectors dependency level 2

// get filtered dashboards
export const sGetFilteredDashboards = state => {
    const dashboards = fromDashboards.sGetFromState(state);

    const nameFilter = fromFilter.sGetFilterName(state);
    const ownerFilter = fromFilter.sGetFilterOwner(state);
    const orderFilter = fromFilter.sGetFilterOrder(state);

    return sFilterDashboardsByOrder(
        sFilterDashboardsByName(
            sFilterDashboardsByOwner(dashboards, ownerFilter),
            nameFilter
        ),
        orderFilter
    );
};
