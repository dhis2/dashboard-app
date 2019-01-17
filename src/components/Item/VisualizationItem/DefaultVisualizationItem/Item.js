import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18n from 'd2-i18n';

import * as pluginManager from '../plugin';
import { getGridItemDomId } from '../../../ItemGrid/gridUtil';
import { getBaseUrl, orObject } from '../../../../util';
import { sGetVisualization } from '../../../../reducers/visualizations';
import { acReceivedActiveVisualization } from '../../../../actions/selected';
import { fromItemFilter } from '../../../../reducers';
import { HEADER_HEIGHT } from '../../ItemHeader';

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
    };

    pluginCredentials = null;

    shouldPluginReload = prevProps => {
        // TODO - fix this hack, to handle bug with multiple
        // rerendering while switching between dashboards.
        //
        // To determine if the rendering is happening because of a
        // dashboard switch, check if the item reference has changed.
        const reloadAllowed = this.props.item === prevProps.item;

        const filterChanged = prevProps.itemFilter !== this.props.itemFilter;
        const vis = orObject(this.props.visualization);
        const prevVis = orObject(prevProps.visualization);
        const visChanged =
            vis.id !== prevVis.id || vis.activeType !== prevVis.activeType;

        return reloadAllowed && (visChanged || filterChanged);
    };

    reloadPlugin = prevProps => {
        if (
            pluginManager.pluginIsAvailable(
                this.props.item,
                this.props.visualization
            ) &&
            this.shouldPluginReload(prevProps)
        ) {
            const prevVis = orObject(prevProps.visualization);
            const currentVis = this.props.visualization;

            const useActiveType =
                currentVis.activeType !== prevVis.activeType ||
                currentVis.activeType !== this.props.item.type
                    ? true
                    : false;

            if (
                useActiveType ||
                this.props.itemFilter !== prevProps.itemFilter
            ) {
                pluginManager.unmount(
                    this.props.item,
                    prevVis.activeType || this.props.item.type
                );

                pluginManager.load(
                    this.props.item,
                    this.pluginCredentials,
                    useActiveType ? currentVis.activeType : null,
                    this.props.itemFilter
                );
            }
        }
    };

    componentDidMount() {
        this.pluginCredentials = pluginCredentials(this.context.d2);

        if (
            pluginManager.pluginIsAvailable(
                this.props.item,
                this.props.visualization
            )
        ) {
            pluginManager.load(
                this.props.item,
                this.pluginCredentials,
                !this.props.editMode
                    ? orObject(this.props.visualization).activeType
                    : null,
                this.props.itemFilter
            );
        }
    }

    componentDidUpdate(prevProps) {
        this.reloadPlugin(prevProps);
    }

    onToggleFooter = () => {
        this.setState(
            { showFooter: !this.state.showFooter },
            this.props.onToggleItemExpanded(this.props.item.id)
        );
    };

    getActiveType = () =>
        this.props.visualization.activeType || this.props.item.type;

    onSelectVisualization = activeType => {
        // Cancel request if type is already active
        if (activeType === this.getActiveType()) {
            return;
        }

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
        const { item, classes } = this.props;
        const elementId = getGridItemDomId(item.id);
        const pluginIsAvailable = pluginManager.pluginIsAvailable(
            item,
            this.props.visualization
        );

        const PADDING_BOTTOM = 4;
        const contentStyle = !this.props.editMode
            ? {
                  height: item.originalHeight - HEADER_HEIGHT - PADDING_BOTTOM,
              }
            : null;

        return (
            <div
                id={elementId}
                className="dashboard-item-content"
                style={contentStyle}
            >
                {!pluginIsAvailable ? (
                    <div className={classes.textDiv}>
                        {i18n.t('Unable to load the plugin for this item')}
                    </div>
                ) : null}
            </div>
        );
    }
}

Item.contextTypes = {
    d2: PropTypes.object,
};

Item.propTypes = {
    itemFilter: PropTypes.object,
    visualization: PropTypes.object,
};

Item.defaultProps = {
    itemFilter: {},
    visualization: {},
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Item);
