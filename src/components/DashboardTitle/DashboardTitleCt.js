import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as fromReducers from '../../reducers';

import DashboardTitle from './DashboardTitle';

// const mapStateToProps = state => {
//     const d = getSelectedDashboard(state);
//     console.log("getSelectedDashboard", d);
//
//     return {
//         name: d && d.name ? d.name : 'no name'
//     };
// };

const mapStateToProps = (state) => {
    const selectedDashboard = fromReducers.sGetSelectedDashboard(state) || {};

    return {
        name: selectedDashboard.name || '',
        description: selectedDashboard.description || '',
    };
};

const mapDispatchToProps = dispatch => ({
    onBlur: e => console.log('dashboard name: ', e.target.value),
});

const DashboardTitleCt = connect(mapStateToProps, mapDispatchToProps)(DashboardTitle);

DashboardTitleCt.propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
};

export default DashboardTitleCt;
