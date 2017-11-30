import React from 'react';
import { connect } from 'react-redux';

import { acSetSelected } from '../actions';
import * as fromReducers from '../reducers';

// {pluginItems.map(item => (
//     <div key={item.i} className={item.type}>
//         <div
//             style={{
//                 padding: 5,
//                 fontSize: 11,
//                 fontWeight: 500,
//                 color: '#555',
//             }}
//         >
//             {`Item ${item.i}`} / {item.type} /{' '}
//             {getReportId(item)}
//         </div>
//         <div
//             id={`plugin-${getReportId(item)}`}
//             className={'pluginItem'}
//         />
//     </div>
// ))}

const DashboardItemBar = ({ title }) => <div>{title}</div>;

const DashboardItemReport = ({ favoriteId, type }) => (
    <div>
        {favoriteId}
        {type}
    </div>
);

export const DashboardItem = ({ favoriteId, type, title, onc }) => (
    <div>
        <button onClick={onc}>set selected = 'nghVC4wtyzi'</button>
        <br />
        <br />
        <br />
        <DashboardItemBar title={title} />
        <DashboardItemReport favoriteId={favoriteId} type={type} />
    </div>
);

const mapStateToProps = state => {
    const selected = fromReducers.sGetSelectedDashboard(state) || {};
    console.log('selected', selected);
    return {
        favoriteId: selected.id,
        type: selected.id ? 'PIVOT / CHART' : '',
        title: selected.name,
    };
};

const mapDispatchToProps = dispatch => ({
    onc: () => dispatch(acSetSelected('nghVC4wtyzi')),
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardItem);
