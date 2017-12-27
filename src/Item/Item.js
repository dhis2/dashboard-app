import React, { Component } from 'react';

import ItemHeader from '../Item/ItemHeader';
import ItemFooter from '../Item/ItemFooter';

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
    render() {
        const item = this.props.item;
        const favorite = getFavoriteObjectFromItem(item);
        const pluginId = `plugin-${getFavoriteObjectFromItem(item).id}`;

        return (
            <div key={item.i} className={item.type}>
                <ItemHeader
                    type={item.type}
                    favoriteId={favorite.id}
                    favoriteName={favorite.name}
                    onButtonClick={onButtonClick}
                    onInterpretationsClick={() =>
                        this.onInterpretationsClick(item.id)
                    }
                />
                <div id={pluginId} className="dashboard-item-content" />
                <ItemFooter
                    interpretations={extractInterpretations(item)}
                    show={showInterpretations}
                    onToggleInterpretations={this.onInterpretationsClick}
                />
            </div>
        );
    }
}
