import React, { Component } from 'react';

import ItemHeader from './ItemHeader';
import ItemFooter from './ItemFooter';

import { getFavoriteObjectFromItem } from '../ItemGrid/pluginUtil';

const ReactFragment = props => props.children;

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
                <ItemHeader
                    type={item.type}
                    favoriteId={favorite.id}
                    favoriteName={favorite.name}
                    onButtonClick={this.props.onButtonClick}
                    onInterpretationsClick={this.onToggleInterpretations}
                />
                <div id={pluginId} className="dashboard-item-content" />
                <ItemFooter
                    item={item}
                    show={this.state.showInterpretations}
                    onToggleInterpretations={this.onToggleInterpretations}
                />
            </ReactFragment>
        );
    }
}

export default Item;
