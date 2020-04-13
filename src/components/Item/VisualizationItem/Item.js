import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import uniqueId from 'lodash/uniqueId';
import VisualizationPlugin from '@dhis2/data-visualizer-plugin';
import i18n from '@dhis2/d2-i18n';

import DefaultPlugin from './DefaultPlugin';
import FatalErrorBoundary from './FatalErrorBoundary';
import ItemHeader, { HEADER_MARGIN_HEIGHT } from '../ItemHeader';
import ItemHeaderButtons from './ItemHeaderButtons';
import ItemFooter from './ItemFooter';
import * as pluginManager from './plugin';
import { sGetVisualization } from '../../../reducers/visualizations';
import { sGetItemFiltersRoot } from '../../../reducers/itemFilters';
import {
    acAddVisualization,
    acSetActiveVisualizationType,
} from '../../../actions/visualizations';
import {
    VISUALIZATION,
    MAP,
    CHART,
    REPORT_TABLE,
} from '../../../modules/itemTypes';
import memoizeOne from '../../../modules/memoizeOne';

import { colors } from '@dhis2/ui-core';
import { getVisualizationConfig } from './plugin';
import LoadingMask from './LoadingMask';

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
    loadingCover: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        left: 0,
        top: 0,
        zIndex: 100,
        background: '#ffffffab',
    },
};

export class Item extends Component {
    state = {
        showFooter: false,
        configLoaded: false,
        pluginIsLoaded: false,
    };

    constructor(props, context) {
        super(props);

        this.d2 = context.d2;

        this.contentRef = React.createRef();
        this.headerRef = React.createRef();

        this.memoizedApplyFilters = memoizeOne(this.applyFilters);

        this.memoizedGetVisualizationConfig = memoizeOne(
            getVisualizationConfig
        );

        this.memoizedGetContentStyle = memoizeOne(this.getContentStyle);
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

    componentDidUpdate(prevProps, prevState) {
        if (
            prevState.pluginIsLoaded &&
            (prevProps.visualization !== this.props.visualization ||
                prevProps.itemFilters !== this.props.itemFilters)
        ) {
            this.setState({
                pluginIsLoaded: false,
            });
        }
    }

    applyFilters = (visualization, filters) => {
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

    getUniqueKey = memoizeOne(() => uniqueId());

    pluginCredentials = null;

    getPluginComponent = () => {
        const activeType = this.getActiveType();
        const visualization = this.memoizedGetVisualizationConfig(
            this.props.visualization,
            this.props.item.type,
            activeType
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
            style: this.memoizedGetContentStyle(
                this.props.item.originalHeight,
                this.headerRef.current.clientHeight,
                this.contentRef ? this.contentRef.offsetHeight : null
            ),
        };

        switch (activeType) {
            case VISUALIZATION:
            case CHART:
            case REPORT_TABLE: {
                return (
                    <Fragment>
                        {!this.state.pluginIsLoaded ? (
                            <div style={styles.loadingCover}>
                                <LoadingMask />
                            </div>
                        ) : null}
                        <VisualizationPlugin
                            d2={this.d2}
                            visualization={this.memoizedApplyFilters(
                                visualization,
                                props.itemFilters
                            )}
                            onLoadingComplete={this.onLoadingComplete}
                            forDashboard={true}
                            style={props.style}
                        />
                    </Fragment>
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
                            return this.memoizedApplyFilters(
                                obj,
                                props.itemFilters
                            );
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
                    props.visualization = this.memoizedApplyFilters(
                        props.visualization,
                        props.itemFilters
                    );
                }

                props.options = {
                    ...props.options,
                    hideTitle: true,
                };

                return <DefaultPlugin {...props} />;
            }
            default: {
                props.visualization = this.memoizedApplyFilters(
                    props.visualization,
                    props.itemFilters
                );

                return <DefaultPlugin {...props} />;
            }
        }
    };

    onLoadingComplete = () => {
        this.setState({
            pluginIsLoaded: true,
        });
    };

    onToggleFooter = () => {
        this.setState(
            { showFooter: !this.state.showFooter },
            this.props.onToggleItemExpanded(this.props.item.id)
        );
    };

    onSelectActiveType = type => {
        if (type === this.getActiveType()) {
            return;
        }

        pluginManager.unmount(this.props.item, this.getActiveType());

        this.props.onSelectActiveType(this.props.visualization.id, type);
    };

    getActiveType = () =>
        this.props.visualization.activeType || this.props.item.type;

    pluginIsAvailable = () =>
        pluginManager.pluginIsAvailable(
            this.props.item,
            this.props.visualization
        );

    getContentStyle = (originalHeight, headerHeight, measuredHeight) => {
        const calculatedHeight =
            originalHeight - headerHeight - HEADER_MARGIN_HEIGHT;

        return {
            height: measuredHeight || calculatedHeight,
        };
    };

    render() {
        const { item, editMode, itemFilters } = this.props;
        const { showFooter } = this.state;

        const actionButtons = (
            <ItemHeaderButtons
                item={item}
                visualization={this.props.visualization}
                onSelectActiveType={this.onSelectActiveType}
                onToggleFooter={this.onToggleFooter}
                d2={this.d2}
                activeType={this.getActiveType()}
                activeFooter={this.state.showFooter}
            />
        );

        return (
            <>
                <ItemHeader
                    title={pluginManager.getName(item)}
                    itemId={item.id}
                    actionButtons={actionButtons}
                    ref={this.headerRef}
                />
                <FatalErrorBoundary>
                    <div
                        key={this.getUniqueKey(itemFilters)}
                        className="dashboard-item-content"
                        ref={ref => (this.contentRef = ref)}
                    >
                        {this.state.configLoaded && this.getPluginComponent()}
                    </div>
                </FatalErrorBoundary>
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
    onSelectActiveType: PropTypes.func,
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
    onSelectActiveType: (id, type, activeType) =>
        dispatch(acSetActiveVisualizationType(id, type, activeType)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(styles)(Item));
