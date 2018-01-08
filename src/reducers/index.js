import { combineReducers } from 'redux';
import arraySort from 'd2-utilizr/lib/arraySort';
import dashboards, * as fromDashboards from './dashboards';
import selected, * as fromSelected from './selected';
import filter, * as fromFilter from './filter';
import controlBar, * as fromControlBar from './controlBar';
import interpretations, * as fromInterpretations from './interpretations';
import visualizations, * as fromVisualizations from './visualizations';
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
    fromStyle,
};

export const sApplyNameFilter = (dashboards, filter) =>
    dashboards.filter(
        d => d.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1
    );

export const sApplyOwnerFilter = (dashboards, filter) => {
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

export const sApplyOrderFilter = (dashboards, filter) => {
    const filterValues = filter.split(':');

    const key = filterValues[0];
    const direction = filterValues[1];

    return arraySort(dashboards, direction, mapConstToData[key]);
};

// selector dependency level 2

export const sGetSelectedDashboard = state =>
    fromDashboards.sGetById(state, fromSelected.sGetSelectedId(state));

export const sGetFilteredDashboards = state => {
    const dashboards = fromDashboards.sGetFromState(state);

    const nameFilter = fromFilter.sGetName(state);
    const ownerFilter = fromFilter.sGetOwner(state);
    const orderFilter = fromFilter.sGetOrder(state);

    return sApplyOrderFilter(
        sApplyNameFilter(
            sApplyOwnerFilter(dashboards, ownerFilter),
            nameFilter
        ),
        orderFilter
    );
};
