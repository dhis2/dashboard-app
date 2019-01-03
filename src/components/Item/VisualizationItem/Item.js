import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';

import * as pluginManager from './plugin';
import { sGetVisualization } from '../../../reducers/visualizations';
import { sGetItemFilterRoot } from '../../../reducers/itemFilter';
import { acReceivedActiveVisualization } from '../../../actions/selected';
import { itemTypeMap, CHART } from '../../../modules/itemTypes';
import ItemHeader from '../ItemHeader';
import ItemFooter from './ItemFooter';
import VisualizationItemHeaderButtons from './ItemHeaderButtons';
import DefaultVisualizationItem from './DefaultVisualizationItem/Item';
import ChartPlugin from 'data-visualizer-plugin';

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

class Item extends Component {
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

    getTitle = () => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
                title={pluginManager.getName(this.props.item)}
                style={style.title}
            >
                {pluginManager.getName(this.props.item)}
            </span>
            {!this.props.editMode &&
            pluginManager.pluginIsAvailable(
                this.props.item,
                this.props.visualization
            ) ? (
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
                    <SvgIcon icon="Launch" style={style.icon} />
                </a>
            ) : null}
        </div>
    );

    getActionButtons = () =>
        pluginManager.pluginIsAvailable(
            this.props.item,
            this.props.visualization
        ) && !this.props.editMode ? (
            <VisualizationItemHeaderButtons
                item={this.props.item}
                activeFooter={this.state.showFooter}
                activeVisualization={
                    this.props.visualization.activeType || this.props.item.type
                }
                onSelectVisualization={this.onSelectVisualization}
                onToggleFooter={this.onToggleFooter}
            />
        ) : null;

    getPluginComponent = () => {
        switch (this.props.item.type) {
            case CHART: {
                return (
                    <div className="dashboard-item-content">
                        <ChartPlugin
                            config={{ id: this.props.visualization.id }}
                            filters={this.props.itemFilter}
                            forDashboard={true}
                        />
                    </div>
                );
            }
            default: {
                return <DefaultVisualizationItem {...this.props} />;
            }
        }
    };

    render() {
        return (
            <Fragment>
                <ItemHeader
                    title={this.getTitle()}
                    actionButtons={this.getActionButtons()}
                    editMode={this.props.editMode}
                />
                {this.getPluginComponent()}
                {!this.props.editMode && this.state.showFooter ? (
                    <ItemFooter item={this.props.item} />
                ) : null}
            </Fragment>
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
)(Item);
