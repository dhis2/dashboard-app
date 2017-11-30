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

const DashboardItemBar = ({ title }) => (
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

const DashboardItemReport = ({ favoriteId, type }) => (
    <div
        style={{
            padding: 10,
            fontSize: 13,
        }}
    >
        favorite
        <br />
        <br />
        id: {favoriteId}
        <br />
        type: {type}
    </div>
);

class DashboardItem extends React.Component {
    componentDidMount() {
        // const { initPlugin } = this.props;
        // initPlugin();
    }

    render() {
        const { favoriteId, type, title, onc } = this.props;

        return (
            <div
                style={{
                    width: 400,
                    height: 300,
                    border: '1px solid #eee',
                }}
            >
                <DashboardItemBar title={title} />
                <DashboardItemReport favoriteId={favoriteId} type={type} />
                <button onClick={onc}>
                    set selected dashboard = nghVC4wtyzi
                </button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const selected = fromReducers.sGetSelectedDashboard(state) || {};
    const item = selected.dashboardItems ? selected.dashboardItems[0] : {};
    const favorite = getDashboardItemFavorite(item) || {};

    console.log('item', item);
    console.log('favorite', favorite);
    return {
        favoriteId: favorite.id,
        type: item.type,
        title: favorite.name,
    };
};

const mapDispatchToProps = dispatch => ({
    onc: () => dispatch(tSetSelectedDashboardById('nghVC4wtyzi')),
    //initPlugin: () => {},
});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardItem);
