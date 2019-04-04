import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import LaunchIcon from '@material-ui/icons/Launch';
import ChartPlugin from 'data-visualizer-plugin';
import i18n from '@dhis2/d2-i18n';
import uniqueId from 'lodash/uniqueId';

import DefaultPlugin from './DefaultPlugin';
import ItemHeader, { HEADER_HEIGHT } from '../ItemHeader';
import ItemFooter from './ItemFooter';
import VisualizationItemHeaderButtons from './ItemHeaderButtons';
import * as pluginManager from './plugin';
import { sGetVisualization } from '../../../reducers/visualizations';
import { sGetItemFilterRoot } from '../../../reducers/itemFilter';
import {
    acReceivedVisualization,
    acReceivedActiveVisualization,
} from '../../../actions/selected';
import { CHART, itemTypeMap } from '../../../modules/itemTypes';
import { colors } from '../../../modules/colors';
import memoizeOne from '../../../modules/memoizeOne';

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
        configLoaded: false,
    };

    constructor(props, context) {
        super(props);

        this.d2 = context.d2;
    }

    async componentDidMount() {
        this.props.onVisualizationLoaded(
            await pluginManager.fetch(this.props.item, this.props.itemFilter)
        );

        this.setState({
            configLoaded: true,
        });
    }

    getUniqueKey = memoizeOne(() => uniqueId());

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

        pluginManager.unmount(this.props.item, this.getActiveType());

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
                        href={pluginManager.getLink(this.props.item, this.d2)}
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

    getConfig = () =>
        pluginManager.getVisualizationConfig(
            this.props.visualization,
            this.props.item.type,
            this.getActiveType()
        );

    getActionButtons = () =>
        pluginManager.pluginIsAvailable(
            this.props.item,
            this.props.visualization
        ) && !this.props.editMode ? (
            <VisualizationItemHeaderButtons
                item={this.props.item}
                activeFooter={this.state.showFooter}
                activeType={this.getActiveType()}
                onSelectVisualization={this.onSelectVisualization}
                onToggleFooter={this.onToggleFooter}
            />
        ) : null;

    getContentStyle = () => {
        const { item, editMode } = this.props;
        const PADDING_BOTTOM = 4;
        return !editMode
            ? {
                  height: item.originalHeight - HEADER_HEIGHT - PADDING_BOTTOM,
              }
            : null;
    };

    getPluginComponent = () => {
        const config = this.getConfig();
        const style = this.getContentStyle();
        const activeType = this.getActiveType();
        const { item, itemFilter, classes } = this.props;

        if (config) {
            return activeType === CHART ? (
                <ChartPlugin
                    d2={this.d2}
                    config={config}
                    filters={itemFilter}
                    style={style}
                />
            ) : (
                <DefaultPlugin
                    activeType={activeType}
                    item={item}
                    style={style}
                    visualization={config}
                    itemFilter={itemFilter}
                />
            );
        }

        return (
            <div className={classes.textDiv}>
                {i18n.t('No data to display')}
            </div>
        );
    };

    render() {
        const { item, editMode, itemFilter } = this.props;
        const { showFooter } = this.state;

        return (
            <Fragment>
                <ItemHeader
                    title={this.getTitle()}
                    actionButtons={this.getActionButtons()}
                    editMode={editMode}
                />
                <div
                    key={this.getUniqueKey(itemFilter)}
                    className="dashboard-item-content"
                >
                    {this.state.configLoaded && this.getPluginComponent()}
                </div>
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
    onVisualizationLoaded: visualization =>
        dispatch(acReceivedVisualization(visualization)),
    onSelectVisualization: (id, type, activeType) =>
        dispatch(acReceivedActiveVisualization(id, type, activeType)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Item));
