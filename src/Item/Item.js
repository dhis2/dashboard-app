import React, { Component } from 'react';

import ItemHeader from './ItemHeader';
import ItemFooter from './ItemFooter';

import { getFavoriteObjectFromItem } from '../ItemGrid/pluginUtil';

const extractInterpretations = item => {
    switch (item.type) {
        case 'CHART':
            return item.chart.interpretations;
            break;
        case 'REPORT_TABLE':
            return item.reportTable.interpretations;
            break;
        default:
            return [];
            break;
    }
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
        const onButtonClick = () => console.log('yo');

        return (
            <div>
                <ItemHeader
                    type={item.type}
                    favoriteId={favorite.id}
                    favoriteName={favorite.name}
                    onButtonClick={onButtonClick}
                    onInterpretationsClick={this.onToggleInterpretations}
                />
                <div id={pluginId} className="dashboard-item-content" />
                <ItemFooter
                    interpretations={extractInterpretations(item)}
                    show={this.state.showInterpretations}
                    onToggleInterpretations={this.onToggleInterpretations}
                />
            </div>
        );
    }
}

export default Item;
