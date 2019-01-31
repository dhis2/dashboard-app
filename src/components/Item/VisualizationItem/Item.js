import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import LaunchIcon from '@material-ui/icons/Launch';

import * as pluginManager from './plugin';
import { getGridItemDomId } from '../../ItemGrid/gridUtil';
import { sGetVisualization } from '../../../reducers/visualizations';
import { sGetItemFilterRoot } from '../../../reducers/itemFilter';
import { acReceivedActiveVisualization } from '../../../actions/selected';
import { itemTypeMap, CHART } from '../../../modules/itemTypes';
import ItemHeader, { HEADER_HEIGHT } from '../ItemHeader';
import ItemFooter from './ItemFooter';
import VisualizationItemHeaderButtons from './ItemHeaderButtons';
import DefaultPlugin from './DefaultPlugin';
import { colors } from '../../../modules/colors';
import ChartPlugin from 'data-visualizer-plugin';

const styles = {
    icon: {
        width: 16,
        height: 16,
        marginLeft: 3,
        cursor: 'pointer',
        fill: colors.muiDefaultGrey,
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

export class Item extends Component {
    state = {
        showFooter: false,
    };

    pluginCredentials = null;

    onToggleFooter = () => {
        this.setState(
            { showFooter: !this.state.showFooter },
            this.props.onToggleItemExpanded(this.props.item.id)
        );
    };

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

    getActiveType = () =>
        this.props.visualization.activeType || this.props.item.type;

    pluginIsAvailable = () =>
        pluginManager.pluginIsAvailable(
            this.props.item,
            this.props.visualization
        );

    getTitle = () => {
        const { item, editMode, classes } = this.props;
        const itemName = pluginManager.getName(item);

        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span className={classes.title} title={itemName}>
                    {itemName}
                </span>
                {!editMode && this.pluginIsAvailable() ? (
                    <a
                        href={pluginManager.getLink(
                            this.props.item,
                            this.context.d2
                        )}
                        style={{ height: 16 }}
                        title={`View in ${
                            itemTypeMap[this.props.item.type].appName
                        } app`}
                    >
                        <LaunchIcon className={classes.icon} />
                    </a>
                ) : null}
            </div>
        );
    };

    getActionButtons = () =>
        pluginManager.pluginIsAvailable(
            this.props.item,
            this.props.visualization
        ) && !this.props.editMode ? (
            <VisualizationItemHeaderButtons
                item={this.props.item}
                activeFooter={this.state.showFooter}
                activeType={
                    this.props.visualization.activeType || this.props.item.type
                }
                onSelectVisualization={this.onSelectVisualization}
                onToggleFooter={this.onToggleFooter}
            />
        ) : null;

    getPluginComponent = () => {
        const { item } = this.props;
        const elementId = getGridItemDomId(item.id);

        const PADDING_BOTTOM = 4;
        const contentStyle = !this.props.editMode
            ? {
                  height: item.originalHeight - HEADER_HEIGHT - PADDING_BOTTOM,
              }
            : null;

        switch (item.type) {
            case CHART: {
                return (
                    <div id={elementId} className="dashboard-item-content">
                        <ChartPlugin
                            config={this.props.visualization}
                            filters={this.props.itemFilter}
                            forDashboard={true}
                            style={contentStyle}
                        />
                    </div>
                );
            }
            default: {
                return (
                    <div
                        id={elementId}
                        className="dashboard-item-content"
                        style={contentStyle}
                    >
                        <DefaultPlugin {...this.props} />
                    </div>
                );
            }
        }
    };

    render() {
        const { item, editMode } = this.props;
        const { showFooter } = this.state;

        return (
            <Fragment>
                <ItemHeader
                    title={this.getTitle()}
                    actionButtons={this.getActionButtons()}
                    editMode={editMode}
                />
                {this.getPluginComponent()}
                {!editMode && showFooter ? <ItemFooter item={item} /> : null}
            </Fragment>
        );
    }
}

Item.contextTypes = {
    d2: PropTypes.object,
};

Item.propTypes = {
    item: PropTypes.object,
    editMode: PropTypes.bool,
    onToggleItemExpanded: PropTypes.func,
    itemFilter: PropTypes.object,
    visualization: PropTypes.object,
};

Item.defaultProps = {
    item: {},
    editMode: false,
    onToggleItemExpanded: Function.prototype,
    itemFilter: {},
    visualization: {},
};

const mapStateToProps = (state, ownProps) => ({
    itemFilter: sGetItemFilterRoot(state),
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
)(withStyles(styles)(Item));
