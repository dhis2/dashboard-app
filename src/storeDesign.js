/* eslint-disable no-unused-vars */

const storeDesign = {
    // not persisted, set on load
    dashboards: {
        id: {},
    }, // see dashboard below

    // not persisted, set from user interaction
    selectedDashboard: {
        id: 'uid', // see selectedDashboard below
    },

    // not persisted, set from user interaction
    dashboardsConfig: {
        isFetching: false,
        selectedId: '',
        textFilter: '',
        showFilter: 'ALL',
        sortFilter: {
            key: 'NAME',
            direction: 'ASC',
        },
        viewFilter: 'LIST',
        ownerFilter: 'ALL',
    },

    // persisted
    defaultDashboardId: '',
};

const dashboard = {
    created: '2013-09-08 21:47',
    description: 'blah',
    id: 'nghVC4wtyzi',
    lastUpdated: '2017-05-29 17:30',
    name: 'Antenatal Care',
    numberOfItems: 10,
    owner: 'Tom Wakiki',
    starred: false,
};

const selectedDashboard = Object.assign({}, dashboard, {
    dashboardItems: [], // see dashboardItem
});

const dashboardItem = {
    id: 'cX2przhv9UC',
    type: 'CHART',
    shape: 'NORMAL',
    // created?
    interpretations: ['xyzpdq123'],
    chart: {
        id: 'VffWmdKFHSq',
        name: 'ANC: ANC IPT 1 Coverage last 12 months districts',
    },
};

const interpretations = {
    id: 'xyzpdq123',
    author: {
        id: 'pgra9g323',
        name: 'Sally Sense',
    },
    created: 'new Date()', //Date type
    text: 'This is the interpretation text',
    likedBy: [
        {
            id: 'pqrm135',
            name: 'Terry Turnbull',
        },
        {
            id: 'defg4632',
            name: 'William Wilcox',
        },
    ],
    comments: [
        {
            id: 'abc123def',
            author: {
                id: '135rgar',
                name: 'Mary Merryweather',
            },
            text: 'This is the comment text',
        },
    ],
};
