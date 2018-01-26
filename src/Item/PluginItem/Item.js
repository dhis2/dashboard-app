import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import ItemHeader from '../ItemHeader';
import ItemFooter from './ItemFooter';
import PluginItemHeaderButtons from './ItemHeaderButtons';

import * as favorite from './plugin';
import { getGridItemDomId } from '../../ItemGrid/gridUtil';

const style = {
    itemFooter: {
        flex: '0 0 320',
    },
};

class Item extends Component {
    state = {
        showInterpretations: false,
    };

    componentDidMount() {
        favorite.load(this.props.item, this.context.baseUrl);
    }

    onToggleInterpretations = () => {
        this.setState({ showInterpretations: !this.state.showInterpretations });
        this.props.onToggleItemExpanded(this.props.item.id);
    };

    onSelectVisualization = targetType => {
        favorite.reload(this.props.item, targetType, this.context.baseUrl);
    };

    render() {
        const item = this.props.item;
        const title = favorite.getName(item);
        const elementId = getGridItemDomId(item.id);

        const actionButtons = !this.props.editMode ? (
            <PluginItemHeaderButtons
                onSelectVisualization={this.onSelectVisualization}
                onInterpretationsClick={this.onToggleInterpretations}
            />
        ) : null;

        return (
            <Fragment>
                <ItemHeader title={title} actionButtons={actionButtons} />
                <div id={elementId} className="dashboard-item-content" />
                {!this.props.editMode ? (
                    <ItemFooter
                        style={style.itemFooter}
                        item={item}
                        showInterpretations={this.state.showInterpretations}
                        onToggleInterpretations={this.onToggleInterpretations}
                    />
                ) : null}
            </Fragment>
        );
    }
}

Item.contextTypes = {
    baseUrl: PropTypes.string,
};

export default Item;
