import React, { Component } from 'react';

import ItemHeader from './ItemHeader';
import ItemFooter from './ItemFooter';

import { getFavoriteObjectFromItem } from '../ItemGrid/pluginUtil';

const ReactFragment = props => props.children;

const style = {
    flexContainer: {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden !important',
    },
    flexItem: {
        flex: 1,
    },
};

class Item extends Component {
    state = {
        showInterpretations: false,
    };

    onToggleInterpretations = () => {
        this.setState({ showInterpretations: !this.state.showInterpretations });
        this.props.onToggleItemFooter(this.props.item.id);
    };

    render() {
        const item = this.props.item;
        const favorite = getFavoriteObjectFromItem(item);
        const pluginId = `plugin-${getFavoriteObjectFromItem(item).id}`;

        return (
            <ReactFragment>
                <div style={style.flexContainer}>
                    <ItemHeader
                        type={item.type}
                        favoriteId={favorite.id}
                        favoriteName={favorite.name}
                        onButtonClick={this.props.onButtonClick}
                        onInterpretationsClick={this.onToggleInterpretations}
                    />
                    <div id={pluginId} className="dashboard-item-content" />
                </div>
                {!this.props.editMode ? (
                    <ItemFooter
                        item={item}
                        showInterpretations={this.state.showInterpretations}
                        onToggleInterpretations={this.onToggleInterpretations}
                    />
                ) : null}
            </ReactFragment>
        );
    }
}

export default Item;
