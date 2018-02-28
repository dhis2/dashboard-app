import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import ItemHeader, { HEADER_HEIGHT } from '../ItemHeader';
import ItemFooter from './ItemFooter';
import PluginItemHeaderButtons from './ItemHeaderButtons';

import * as pluginManager from './plugin';
import { getGridItemDomId } from '../../ItemGrid/gridUtil';
import { getBaseUrl } from '../../util';
import { sGetVisualization } from '../../reducers/visualizations';
import { acReceivedActiveVisualization } from '../../actions/selected';
import { fromItemFilter } from '../../reducers';
import { itemTypeMap } from '../../itemTypes';

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
    textDiv: {
        fontSize: '14px',
        fontStretch: 'normal',
        padding: '10px',
        lineHeight: '20px',
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
        activeVisualization: this.props.item.type,
        pluginIsAvailable: !!itemTypeMap[this.props.item.type].plugin,
    };

    pluginCredentials = null;

    shouldPluginLoad = (props, prevProps) => {
        if (!this.state.pluginIsAvailable) {
            return false;
        }

        const item = props.item;
        const filter = props.itemFilter;
        const vis = props.visualization;
        const prevItem = prevProps.item;
        const prevFilter = prevProps.itemFilter;
        const prevVis = prevProps.visualization;

        // item clause
        const itemChanged = item !== prevItem;

        // visualization clause
        const visDidNotChange =
            vis.id === prevVis.id && vis.activeType === prevVis.activeType;

        // filter clause
        const filterDidNotChange = prevFilter === filter;

        return !(itemChanged || (visDidNotChange && filterDidNotChange));
    };

    loadPlugin = (props, prevProps) => {
        if (this.shouldPluginLoad(props, prevProps)) {
            let filterChanged = false;
            let itemFilter = prevProps.itemFilter;
            if (props.itemFilter !== itemFilter) {
                filterChanged = true;
                itemFilter = props.itemFilter;
            }
            let useActiveType = false;
            let activeType = prevProps.visualization.activeType;
            if (
                props.visualization.activeType !== activeType ||
                props.visualization.activeType !== prevProps.item.type
            ) {
                useActiveType = true;
                activeType =
                    props.visualization.activeType || prevProps.item.type;
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
    };

    componentDidMount() {
        this.pluginCredentials = pluginCredentials(this.context.d2);

        if (this.state.pluginIsAvailable) {
            pluginManager.load(
                this.props.item,
                this.pluginCredentials,
                this.props.itemFilter
            );
        }
    }

    componentDidUpdate(prevProps) {
        this.loadPlugin(this.props, prevProps);
    }

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
                {!this.props.editMode && this.state.pluginIsAvailable ? (
                    <a
                        href={pluginManager.getLink(item, this.context.d2)}
                        style={{ height: 16 }}
                    >
                        <SvgIcon icon="Launch" style={style.icon} />
                    </a>
                ) : null}
            </div>
        );

        const actionButtons =
            this.state.pluginIsAvailable && !this.props.editMode ? (
                <PluginItemHeaderButtons
                    item={item}
                    activeFooter={this.state.showFooter}
                    activeVisualization={
                        this.props.visualization.activeType ||
                        this.props.item.type
                    }
                    onSelectVisualization={this.onSelectVisualization}
                    onToggleFooter={this.onToggleFooter}
                />
            ) : null;

        const PADDING_BOTTOM = 4;
        const contentStyle = !this.props.editMode
            ? {
                  height: item.originalHeight - HEADER_HEIGHT - PADDING_BOTTOM,
              }
            : null;

        return (
            <Fragment>
                <ItemHeader
                    title={title}
                    actionButtons={actionButtons}
                    editMode={this.props.editMode}
                />
                <div
                    id={elementId}
                    className="dashboard-item-content"
                    style={contentStyle}
                >
                    {!this.state.pluginIsAvailable ? (
                        <div style={style.textDiv}>
                            Unable to load the plugin for this item
                        </div>
                    ) : null}
                </div>
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
