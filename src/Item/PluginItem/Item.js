import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import ItemHeader from '../ItemHeader';
import ItemFooter from './ItemFooter';
import PluginItemHeaderButtons from './ItemHeaderButtons';

import * as pluginManager from './plugin';
import { getGridItemDomId } from '../../ItemGrid/gridUtil';
import { getBaseUrl } from '../../util';
import { sGetVisualization } from '../../reducers/visualizations';
import { acReceivedActiveVisualization } from '../../actions/selected';
import { fromItemFilter } from '../../reducers';

const style = {
    icon: {
        width: 16,
        height: 16,
        marginLeft: 3,
        cursor: 'pointer',
    },
    title: {
        overflow: 'hidden',
        maxWidth: '85%',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
};

const pluginCredentials = d2 => {
    return {
        baseUrl: getBaseUrl(d2),
        auth: d2.Api.getApi().defaultHeaders.Authorization,
    };
};

class Item extends Component {
    state = {
        showFooter: false,
    };

    pluginCredentials = null;

    componentDidMount() {
        this.pluginCredentials = pluginCredentials(this.context.d2);

        console.log('componentDidMount');

        pluginManager.load(
            this.props.item,
            this.pluginCredentials,
            this.props.itemFilter
        );
    }
    componentWillUnmount() {
        console.log('componentWillUnmount');
    }

    componentDidUpdate(prevProps) {
        let itemChanged = prevProps.item !== this.props.item;
        let visDidNotChange =
            prevProps.visualization.id === this.props.visualization.id &&
            prevProps.visualization.id.activeType ===
                this.props.visualization.activeType;
        let itemFilterDidNotChange =
            prevProps.itemFilter === this.props.itemFilter;

        if (itemChanged || (visDidNotChange && itemFilterDidNotChange)) {
            return;
        }

        let filterChanged = false;
        let itemFilter = prevProps.itemFilter;
        if (this.props.itemFilter !== itemFilter) {
            filterChanged = true;
            itemFilter = this.props.itemFilter;
        }
        let useActiveType = false;
        let activeType = prevProps.visualization.activeType;
        if (
            this.props.visualization.activeType !== activeType ||
            this.props.visualization.activeType !== prevProps.item.type
        ) {
            useActiveType = true;
            activeType =
                this.props.visualization.activeType || prevProps.item.type;
        }
        // load plugin if
        if (useActiveType) {
            pluginManager.reload(
                prevProps.item,
                activeType,
                this.pluginCredentials,
                itemFilter
            );
        } else if (filterChanged) {
            pluginManager.load(
                prevProps.item,
                this.pluginCredentials,
                itemFilter
            );
        }
    }

    fn = nextProps => {
        //TODO remove
        console.log('--CWRP--');
        if (nextProps.item !== this.props.item) {
            console.log('CHANGED: item', nextProps.item, this.props.item);
        }
        if (nextProps.itemFilter !== this.props.itemFilter) {
            console.log(
                'CHANGED: itemFilter',
                nextProps.itemFilter,
                this.props.itemFilter
            );
        }
        if (nextProps.visualization !== this.props.visualization) {
            console.log(
                'CHANGED: visualization',
                nextProps.visualization,
                this.props.visualization
            );
        }
        console.log('componentWillReceiveProps');
    };

    onToggleFooter = () => {
        this.setState(
            { showFooter: !this.state.showFooter },
            this.props.onToggleItemExpanded(this.props.item.id)
        );
    };

    onSelectVisualization = activeType => {
        pluginManager.unmount(
            this.props.item,
            this.props.visualization.activeType || this.props.item.type
        );

        this.props.onSelectVisualization(
            this.props.visualization.id,
            this.props.item.type,
            activeType
        );
    };

    render() {
        const item = this.props.item;
        const elementId = getGridItemDomId(item.id);
        const title = (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span title={pluginManager.getName(item)} style={style.title}>
                    {pluginManager.getName(item)}
                </span>
                {!this.props.editMode ? (
                    <a
                        href={pluginManager.getLink(item, this.context.d2)}
                        style={{ height: 16 }}
                    >
                        <SvgIcon icon="Launch" style={style.icon} />
                    </a>
                ) : null}
            </div>
        );

        const actionButtons = !this.props.editMode ? (
            <PluginItemHeaderButtons
                item={item}
                activeFooter={this.state.showFooter}
                activeVisualization={
                    this.props.visualization.activeType || this.props.item.type
                }
                onSelectVisualization={this.onSelectVisualization}
                onToggleFooter={this.onToggleFooter}
            />
        ) : null;

        return (
            <Fragment>
                <ItemHeader
                    title={title}
                    actionButtons={actionButtons}
                    editMode={this.props.editMode}
                />
                <div id={elementId} className="dashboard-item-content" />
                {!this.props.editMode && this.state.showFooter ? (
                    <ItemFooter item={item} />
                ) : null}
            </Fragment>
        );
    }
}

Item.contextTypes = {
    d2: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => ({
    itemFilter: fromItemFilter.sGetFromState(state),
    visualization: sGetVisualization(
        state,
        pluginManager.extractFavorite(ownProps.item).id
    ),
});

const mapDispatchToProps = dispatch => ({
    onSelectVisualization: (id, type, activeType) =>
        dispatch(acReceivedActiveVisualization(id, type, activeType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Item);
