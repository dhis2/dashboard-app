/* eslint-disable no-unused-vars */

import PropTypes from 'prop-types';

const { bool, string, oneOf, oneOfType } = PropTypes;

const storeDesign = {
    // default: null, has not been set, show loading indicator
    // normal: object with keys=dashboard id and value=customDashboard, empty object means there was no dashboards
    // extend selected dashboard with full dashboard spec
    // oneOfType([null, object]).isRequired
    dashboards: {
        id1: {},
        id2: {},
    },

    // default: null
    // normal: selected dashboard id
    // oneOfType([null, string]).isRequired
    selected: {
        id: null, // oneOfType([null, string]).isRequired
        edit: false, // bool.isRequired
        isLoading: false, // bool.isRequired
        showDescription: false,
    },

    // filter list of available dashboards
    // object
    filter: {
        name: null, // oneOfType([null, string]).isRequired
        owner: 'ALL', // oneOf(['ALL', 'ME', 'OTHERS']),
        order: 'NAME:ASC', // oneOf(['NAME:ASC', 'NAME:DESC', 'CREATED:ASC', 'CREATED:DESC', 'ITEMS:ASC', 'ITEMS:DESC', 'STARRED:ASC', 'STARRED:DESC']),
    },

    // render dashboards as list or table
    style: oneOf(['LIST', 'TABLE']),

    // persisted
    // rows: default height (number of rows)
    // expanded: show full height
    // object
    controlBar: {
        rows: 1,
        expanded: bool, // default: false
    },
};

const customDashboard = {
    created: '2013-09-08 21:47',
    description: 'blah',
    id: 'nghVC4wtyzi',
    lastUpdated: '2017-05-29 17:30',
    name: 'Antenatal Care',
    numberOfItems: 10,
    owner: 'Tom Wakiki',
    starred: false,
    dashboardItems: [
        // 'undefined ("loading" if defined) | error: null (hide "loading", show error) | [items]',
    ],
};

const visualizations = {
    abc12345: {
        id: 'abc12345',
        interpretations: ['xyzpdq123', 'defghi346'],
    },
};

const interpretations = {
    xyzpdq123: {
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
                created: 'new Date()', //Date type
                author: {
                    id: '135rgar',
                    name: 'Mary Merryweather',
                },
                text: 'This is the comment text',
            },
        ],
    },
};
