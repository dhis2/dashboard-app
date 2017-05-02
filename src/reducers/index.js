import { combineReducers } from 'redux';

const DEFAULT_DASHBOARD = {
    "id": "nghVC4wtyzi",
    "displayName": "Antenatal Care",
    "dashboardItems": [{
        "id": "cX2przhv9UC",
        "shape": "NORMAL",
        "type": "CHART",
        "x": 0,
        "y": 0,
        "width": 2,
        "height": 2
    }, {
        "id": "JcO7yJlKIa3",
        "shape": "NORMAL",
        "type": "CHART",
        "x": 2,
        "y": 0,
        "width": 2,
        "height": 2
    }, {
        "id": "OiyMNoXzSdY",
        "shape": "NORMAL",
        "type": "MAP",
        "x": 4,
        "y": 0,
        "width": 2,
        "height": 2
    }, {
        "id": "i6NTSuDsk6l",
        "shape": "NORMAL",
        "type": "MAP",
        "x": 6,
        "y": 0,
        "width": 2,
        "height": 2
    }] };

const dashboard = (state = DEFAULT_DASHBOARD, action) => {
    switch (action.type) {
        case 'SELECT_DASHBOARD':
            return action.dashboard;
        default:
            return state;
    }
};

export default combineReducers({
    dashboard
});

// pointers

export const getDashboardFromState = (state) => state.dashboard;