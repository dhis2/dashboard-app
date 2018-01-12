import React, { Component } from 'react';

import ItemHeader from './ItemHeader';
import ItemFooter from './ItemFooter';

import { getFavoriteObjectFromItem } from '../../ItemGrid/pluginUtil';

const Fragment = props => props.children;

const style = {
    itemFooter: {
        flex: '0 0 320',
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
            <Fragment>
                <ItemHeader
                    type={item.type}
                    favoriteId={favorite.id}
                    favoriteName={favorite.name}
                    editMode={this.props.editMode}
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
            </Fragment>
        );
    }
}

export default Item;
