import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import LaunchIcon from '@material-ui/icons/Launch';
import VisualizationPlugin from '@dhis2/data-visualizer-plugin';
import {
    VIS_TYPE_COLUMN,
    VIS_TYPE_STACKED_COLUMN,
    VIS_TYPE_BAR,
    VIS_TYPE_STACKED_BAR,
    VIS_TYPE_LINE,
    VIS_TYPE_AREA,
    VIS_TYPE_PIE,
    VIS_TYPE_RADAR,
    VIS_TYPE_GAUGE,
    VIS_TYPE_BUBBLE,
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
    VIS_TYPE_SINGLE_VALUE,
    VIS_TYPE_PIVOT_TABLE,
} from '@dhis2/analytics';

import i18n from '@dhis2/d2-i18n';
import uniqueId from 'lodash/uniqueId';

import DefaultPlugin from './DefaultPlugin';
import ItemHeader, { HEADER_HEIGHT } from '../ItemHeader';
import ItemFooter from './ItemFooter';
import VisualizationItemHeaderButtons from './ItemHeaderButtons';
import * as pluginManager from './plugin';
import { sGetVisualization } from '../../../reducers/visualizations';
import { sGetItemFiltersRoot } from '../../../reducers/itemFilters';
import {
    acAddVisualization,
    acSetActiveVisualizationView,
} from '../../../actions/visualizations';
import { MAP, itemTypeMap } from '../../../modules/itemTypes';
import {
    VIEW_TYPE_CHART,
    VIEW_TYPE_MAP,
    VIEW_TYPE_TABLE,
} from '../../../modules/visualizationViewTypes';

import { getDefaultView } from '../../../modules/visualizationViewTypes';
import { colors } from '@dhis2/ui-core';
import memoizeOne from '../../../modules/memoizeOne';
import { getVisualizationConfig } from './plugin';

const CHART_TYPES = [
    VIS_TYPE_COLUMN,
    VIS_TYPE_STACKED_COLUMN,
    VIS_TYPE_BAR,
    VIS_TYPE_STACKED_BAR,
    VIS_TYPE_LINE,
    VIS_TYPE_AREA,
    VIS_TYPE_PIE,
    VIS_TYPE_RADAR,
    VIS_TYPE_GAUGE,
    VIS_TYPE_BUBBLE,
    VIS_TYPE_YEAR_OVER_YEAR_LINE,
    VIS_TYPE_YEAR_OVER_YEAR_COLUMN,
    VIS_TYPE_SINGLE_VALUE,
    VIS_TYPE_PIVOT_TABLE,
];

const styles = {
    icon: {
        width: 16,
        height: 16,
        marginLeft: 3,
        cursor: 'pointer',
        fill: colors.grey600,
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

const applyFilters = (visualization, filters) => {
    if (!Object.keys(filters).length) {
        return visualization;
    }

    // deep clone objects in filters to avoid changing the visualization in the Redux store
    const visRows = visualization.rows.map(obj => ({ ...obj }));
    const visColumns = visualization.columns.map(obj => ({ ...obj }));
    const visFilters = visualization.filters.map(obj => ({ ...obj }));

    Object.keys(filters).forEach(dimensionId => {
        if (filters[dimensionId]) {
            let dimensionFound = false;

            [visRows, visColumns, visFilters].forEach(dimensionObjects =>
                dimensionObjects
                    .filter(obj => obj.dimension === dimensionId)
                    .forEach(obj => {
                        dimensionFound = true;
                        obj.items = filters[dimensionId];
                    })
            );

            // add dimension to filters if not already present elsewhere
            if (!dimensionFound) {
                visFilters.push({
                    dimension: dimensionId,
                    items: filters[dimensionId],
                });
            }
        }
    });

    return {
        ...visualization,
        rows: visRows,
        columns: visColumns,
        filters: visFilters,
    };
};

export class Item extends Component {
    state = {
        showFooter: false,
        configLoaded: false,
    };

    constructor(props, context) {
        super(props);

        this.d2 = context.d2;

        this.contentRef = React.createRef();
    }

    async componentDidMount() {
        this.props.onVisualizationLoaded(
            // TODO do not call fetch on the pluginManager, do it here as the manager will eventually be removed...
            await pluginManager.fetch(this.props.item)
        );

        this.setState({
            configLoaded: true,
        });
    }

    getUniqueKey = memoizeOne(() => uniqueId());

    pluginCredentials = null;

    getPluginComponent = () => {
        const visualization = getVisualizationConfig(
            this.props.visualization,
            this.props.item.type,
            this.getActiveView()
        );

        if (!visualization) {
            return (
                <div className={this.props.classes.textDiv}>
                    {i18n.t('No data to display')}
                </div>
            );
        }

        const props = {
            ...this.props,
            visualization,
            style: this.getContentStyle(),
        };

        let vis = props.visualization;
        if (
            props.visualization.type === undefined ||
            props.visualization.type === VIS_TYPE_PIVOT_TABLE
        ) {
            if (this.getActiveView() === VIEW_TYPE_CHART) {
                //a table is being shown as a chart - default to column
                vis = Object.assign({}, props.visualization, {
                    type: VIS_TYPE_COLUMN,
                });
            }
        } else if (
            props.visualization.type !== undefined &&
            props.visualization.type !== VIS_TYPE_PIVOT_TABLE
        ) {
            //originally a chart type
            if (CHART_TYPES.includes(props.visualization.type)) {
                if (this.getActiveView() === VIEW_TYPE_TABLE) {
                    vis = Object.assign({}, props.visualization, {
                        type: VIS_TYPE_PIVOT_TABLE,
                    });
                }
            }
        }

        switch (this.getActiveView()) {
            case VIEW_TYPE_CHART:
            case VIEW_TYPE_TABLE: {
                return (
                    <VisualizationPlugin
                        d2={this.d2}
                        config={applyFilters(vis, props.itemFilters)}
                        forDashboard={true}
                        style={props.style}
                    />
                );
            }
            case VIEW_TYPE_MAP: {
                if (props.item.type === MAP) {
                    // apply filters only to thematic and event layers
                    // for maps AO
                    const mapViews = props.visualization.mapViews.map(obj => {
                        if (
                            obj.layer.includes('thematic') ||
                            obj.layer.includes('event')
                        ) {
                            return applyFilters(obj, props.itemFilters);
                        }

                        return obj;
                    });

                    props.visualization = {
                        ...props.visualization,
                        mapViews,
                    };
                } else {
                    // this is the case of a non map AO passed to the maps plugin
                    // due to a visualization type switch in dashboard item
                    // maps plugin takes care of converting the AO to a suitable format
                    props.visualization = applyFilters(
                        props.visualization,
                        props.itemFilters
                    );
                }

                return <DefaultPlugin {...props} />;
            }
            default: {
                props.visualization = applyFilters(
                    props.visualization,
                    props.itemFilters
                );

                return <DefaultPlugin {...props} />;
            }
        }
    };

    onToggleFooter = () => {
        this.setState(
            { showFooter: !this.state.showFooter },
            this.props.onToggleItemExpanded(this.props.item.id)
        );
    };

    onSelectView = view => {
        // Cancel request if type is already active
        if (view === this.getActiveView()) {
            return;
        }

        pluginManager.unmount(this.props.item, this.getActiveView());

        this.props.onSelectView(this.props.visualization.id, view);
    };

    getActiveView = () => {
        return (
            this.props.visualization.activeType ||
            getDefaultView(this.props.item.type)
        );
    };

    pluginIsAvailable = () =>
        pluginManager.pluginIsAvailable(
            this.props.item,
            this.props.visualization
        );

    getTitle = () => {
        const { item, editMode, classes } = this.props;
        const itemName = pluginManager.getName(item);

        return (
            <div style={{ display: 'flex' }}>
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

    getActionButtons = () =>
        pluginManager.pluginIsAvailable(
            this.props.item,
            this.props.visualization
        ) && !this.props.editMode ? (
            <VisualizationItemHeaderButtons
                item={this.props.item}
                visualization={this.props.visualization}
                activeFooter={this.state.showFooter}
                activeView={this.getActiveView()}
                onSelectView={this.onSelectView}
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
            : { height: this.contentRef.offsetHeight };
    };

    render() {
        const { item, editMode, itemFilters } = this.props;
        const { showFooter } = this.state;

        return (
            <Fragment>
                <ItemHeader
                    title={this.getTitle()}
                    actionButtons={this.getActionButtons()}
                    editMode={editMode}
                />
                <div
                    key={this.getUniqueKey(itemFilters)}
                    className="dashboard-item-content"
                    ref={ref => (this.contentRef = ref)}
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
    classes: PropTypes.object,
    editMode: PropTypes.bool,
    item: PropTypes.object,
    itemFilters: PropTypes.object,
    visualization: PropTypes.object,
    onSelectView: PropTypes.func,
    onToggleItemExpanded: PropTypes.func,
    onVisualizationLoaded: PropTypes.func,
};

Item.defaultProps = {
    item: {},
    editMode: false,
    onToggleItemExpanded: Function.prototype,
    itemFilters: {},
    visualization: {},
};

const mapStateToProps = (state, ownProps) => ({
    itemFilters: sGetItemFiltersRoot(state),
    visualization: sGetVisualization(
        state,
        pluginManager.extractFavorite(ownProps.item).id
    ),
});

const mapDispatchToProps = dispatch => ({
    onVisualizationLoaded: visualization =>
        dispatch(acAddVisualization(visualization)),
    onSelectView: (id, type, activeType) =>
        dispatch(acSetActiveVisualizationView(id, type, activeType)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Item));
