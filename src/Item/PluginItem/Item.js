import React, { Component } from 'react';

import ItemHeader from './ItemHeader';
import ItemFooter from './ItemFooter';

import {
    getPluginByType,
    getFavoriteObjectFromItem,
    getPluginItemConfig,
    onPluginItemResize,
    renderFavorite,
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

const shouldPluginRender = (item, edit) => {
    // console.log('jj shouldpluginrender edit', edit);
    // console.log('jj cachedEdit', cachedEdit);

    if (cachedIds.indexOf(item.id) === -1 || edit !== cachedEdit) {
        cachedIds.push(item.id);
        cachedEdit = edit;

        return true;
    }
    return false;
};

class Item extends Component {
    constructor(props) {
        super(props);
        console.log('jj Item constructor', props.item.id);
    }
    state = {
        showInterpretations: false,
    };

    componentDidUpdate() {
        console.log('jj Item componentDidUpdate');

        const { item, editMode } = this.props;

        if (shouldPluginRender(item, editMode)) {
            renderFavorite(item);
        }
    }

    shouldComponentUpdate = nextProps => {
        // console.log('jj nextProps', nextProps);
        // console.log('jj currentProps', this.props);

        console.log('jj Item shouldComponentUpdate');

        return true;
    };

    componentDidMount() {
        console.log('jj Item componentDidMount');
    }

    onToggleInterpretations = () => {
        this.setState({ showInterpretations: !this.state.showInterpretations });
        this.props.onToggleItemFooter(this.props.item.id);
    };

    render() {
        console.log('jj Item Render');

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
