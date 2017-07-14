import { connect } from 'react-redux';

import { getSelectedDashboard } from '../../reducers';
import DashboardTitle from './DashboardTitle';

// const mapStateToProps = state => {
//     const d = getSelectedDashboard(state);
//     console.log("getSelectedDashboard", d);
//
//     return {
//         name: d && d.name ? d.name : 'no name'
//     };
// };

const mapStateToProps = state => ({
    name: (getSelectedDashboard(state) || {}).name || ''
});

const mapDispatchToProps = dispatch => ({
    onBlur: (e) => console.log(e.target.value)
});

const DashboardTitleCt = connect(mapStateToProps, mapDispatchToProps)(DashboardTitle);

export default DashboardTitleCt;