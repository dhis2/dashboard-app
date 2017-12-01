import React from 'react';
import { connect } from 'react-redux';

import { tSetSelectedDashboardById } from '../actions';
import * as fromReducers from '../reducers';
import { getDashboardItemFavorite } from '../util';

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

const DashboardItemBar = ({ title, favoriteId, type }) => (
    <div
        style={{
            height: 50,
            backgroundColor: '#eee',
            padding: 10,
            fontSize: 15,
        }}
    >
        {title}
    </div>
);

const DashboardItemReport = ({ favoriteId }) => (
    <div
        id={'plugin-' + favoriteId}
        style={{
            padding: 10,
            fontSize: 13,
            width: '100%',
            height: '100%',
        }}
    />
);

const DashboardItem = ({ key, className, item }) => (
    <div key={key} className={className}>
        <div
            style={{
                padding: 5,
                fontSize: 11,
                fontWeight: 500,
                color: '#555',
            }}
        >
            {`Item ${item.i}`} {'options'}
        </div>
        <div id={`plugin-${item.id}`} className={'pluginItem'} />
    </div>
);

export default DashboardItem;

// const mapStateToProps = state => {
//     const selected = fromReducers.sGetSelectedDashboard(state) || {};
//     const item = selected.dashboardItems ? selected.dashboardItems[0] : {};
//     const favorite = getDashboardItemFavorite(item) || {};
//
//     console.log('item', item);
//     console.log('favorite', favorite);
//     return {
//         favoriteId: favorite.id,
//         type: item.type,
//         title: favorite.name,
//     };
// };
//
// const mapDispatchToProps = dispatch => ({
//     onc: () => dispatch(tSetSelectedDashboardById('nghVC4wtyzi')),
//     //initPlugin: () => {},
// });
//
// export default connect(mapStateToProps, mapDispatchToProps)(DashboardItem);
