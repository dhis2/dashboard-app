/* eslint-disable no-unused-vars */

import PropTypes from 'prop-types';

const { bool, string, oneOf } = PropTypes;

const storeDesign = {

    // not persisted
    edit: bool.isRequired,

    view: {
        nav: {
            filter: { // loading indicator based on dashboards object
                name: string, // default = ''
                owner: oneOf(['ALL', 'ME', 'OTHERS']),
                order: oneOf(['NAME:ASC', 'NAME:DESC', 'CREATED:ASC', 'CREATED:DESC', 'ITEMS:ASC', 'ITEMS:DESC', 'STARRED:ASC', 'STARRED:DESC']),
            },
            appBar: {
                rows: 1,
                expanded: bool, // false
            },
            style: oneOf(['LIST', 'TABLE']),
        },
        content: {},
        thirdSection: {}
    },

    // not persisted
    dashboards: {
        "id1": {},
        "id2": {},
    }, // see customDashboard below

    // not persisted, set from user interaction
    selectedDashboard: string,

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
    items: "does not exist (show loading indicator if selected) | null on error (hide loading indicator, show error) | [items]"
};
