import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import LaunchIcon from '@material-ui/icons/Launch';
import VisualizationPlugin from '@dhis2/data-visualizer-plugin';

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
    acReceivedVisualization,
    acReceivedActiveVisualization,
} from '../../../actions/selected';
import {
    VISUALIZATION,
    CHART,
    MAP,
    itemTypeMap,
} from '../../../modules/itemTypes';
import { colors } from '@dhis2/ui-core';
import memoizeOne from '../../../modules/memoizeOne';
import { getVisualizationConfig } from './plugin';

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
            this.getActiveType()
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

        switch (this.getActiveType()) {
            case VISUALIZATION:
            case CHART: {
                return (
                    <VisualizationPlugin
                        d2={this.d2}
                        config={applyFilters(
                            props.visualization,
                            props.itemFilters
                        )}
                        // filters={visFilters}
                        // onChartGenerated={this.onChartGenerated}
                        // onResponsesReceived={this.onResponsesReceived}
                        // onError={this.onError}
                        forDashboard={true}
                        style={props.style}
                    />
                );
            }
            case MAP: {
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
            : { height: this.contentRef.offsetHeight };
    };

    render() {
        const { item, editMode, itemFilters } = this.props;
        const { showFooter } = this.state;

        return (
            <>
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
            </>
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
    onSelectVisualization: PropTypes.func,
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
        dispatch(acReceivedVisualization(visualization)),
    onSelectVisualization: (id, type, activeType) =>
        dispatch(acReceivedActiveVisualization(id, type, activeType)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Item));
