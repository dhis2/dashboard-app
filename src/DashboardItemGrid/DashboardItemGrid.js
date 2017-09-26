import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactGridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';

import './DashboardItemGrid.css';

const runPlugins = (items) => {
    let filteredItems;

    const url = '//localhost:8080';
    const username = 'admin';
    const password = 'district';

    // plugins
    [global.reportTablePlugin, global.chartPlugin].forEach((plugin) => {
        plugin.url = url;
        plugin.username = username;
        plugin.password = password;
        plugin.loadingIndicator = true;
        plugin.dashboard = true;

        filteredItems = items.filter(d => d.type === plugin.type).map(d => ({ id: d.id, el: `plugin-${d.id}`, type: d.type }));

        // add plugin items
        filteredItems.forEach(d => plugin.add(d));

        plugin.load();

        filteredItems.forEach((d) => {
            ((element) => {
                console.log(element);
            })(document.getElementById(d.el));
        });
    });

    // map
    setTimeout(() => {
        filteredItems = items.filter(d => d.type === 'MAP').map(d => ({ id: d.id, el: `plugin-${d.id}`, type: d.type, url, username, password }));
        console.log(filteredItems);

        filteredItems.forEach(d => global.DHIS.getMap(d));
    }, 200);
};

export class DashboardItemGrid extends Component {
    getChildContext() {
        return {
            d2: this.props.d2,
        };
    }
    componentDidUpdate() {
        const { items } = this.props;

        console.log("CONTEXT", this.context, this.props);

        runPlugins(items);
    }

    render() {
        const items = this.props.items || [];

        items.forEach((item, index) => item.i = `${index}`);

        return (
            <div style={{ margin: '10px' }}>
                <ReactGridLayout
                    onLayoutChange={(a, b, c) => console.log(a, b, c)}
                    className="layout"
                    layout={items}
                    cols={30}
                    rowHeight={30}
                    width={window.innerWidth}
                >
                    {items.map(item => (
                        <div key={item.i} className={item.type}>
                            <div style={{ padding: 5, fontSize: 11, fontWeight: 500, color: '#555' }}>{`Item ${item.i}`} {'options'}</div>
                            <div id={`plugin-${item.id}`} className={'pluginItem'} />
                        </div>
                    ))}
                    {}
                </ReactGridLayout>
            </div>
        );
    }
}

DashboardItemGrid.propTypes = {
    d2: PropTypes.object,
};

DashboardItemGrid.defaultProps = {
    d2: {},
};

DashboardItemGrid.contextTypes = {
    store: PropTypes.object,
};

DashboardItemGrid.childContextTypes = {
    d2: PropTypes.object,
};

// Container

class DashboardItemGridCtCmp extends Component {
    render() {
        const { id } = this.props;
        const { d2 } = this.context;

        return (<DashboardItemGrid items={getDashboardItems(id)} d2={d2} />);
    }
}

DashboardItemGridCtCmp.propTypes = {
    id: PropTypes.string,
};

DashboardItemGridCtCmp.defaultProps = {
    id: '',
};

DashboardItemGridCtCmp.contextTypes = {
    d2: PropTypes.object,
};

const mapStateToProps = state => ({
    id: fromReducers.fromDashboardsConfig.sGetSelectedIdFromState(state),
});

const DashboardItemGridCt = connect(mapStateToProps)(DashboardItemGridCtCmp);

export default DashboardItemGridCt;