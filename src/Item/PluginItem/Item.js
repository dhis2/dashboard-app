import React, { Component } from 'react';

import ItemHeader from './ItemHeader';
import ItemFooter from './ItemFooter';

import {
    getFavoriteObjectFromItem,
    getPluginItemConfig,
    loadFavorite,
} from './renderPlugin';

const ReactFragment = props => props.children;

const style = {
    itemFooter: {
        flex: '0 0 320',
    },
};

//TODO - do caching differently, does not belong here in Item
let cachedIds = [];
let cachedEdit = false;

const shouldPluginLoad = (item, edit) => {
    if (edit !== cachedEdit) {
        cachedIds = [];
        cachedEdit = edit;
    }

    if (cachedIds.indexOf(item.id) === -1) {
        cachedIds.push(item.id);

        return true;
    }
    return false;
};

class Item extends Component {
    state = {
        showInterpretations: false,
    };

    componentWillMount() {
        const { item, editMode } = this.props;

        if (shouldPluginLoad(item, editMode)) {
            loadFavorite(item);
        }
    }

    onToggleInterpretations = () => {
        this.setState({ showInterpretations: !this.state.showInterpretations });
        this.props.onToggleItemFooter(this.props.item.id);
    };

    render() {
        const item = this.props.item;
        const favorite = getFavoriteObjectFromItem(item);
        const pluginId = getPluginItemConfig.el;

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
                {!this.props.editMode ? (
                    <ItemFooter
                        style={style.itemFooter}
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
