import React, { Component } from 'react';

import ItemHeaderButton from './ItemHeaderButton';

class ItemHeader extends Component {
    render() {
        const { type, favoriteId, favoriteName, onButtonClick } = this.props;

        return (
            <div className="dashboard-item-header">
                <div className="dashboard-item-header-title">
                    {favoriteName}
                </div>
                <ItemHeaderButton
                    text={'I'}
                    style={{
                        marginRight: 10,
                    }}
                />
                <ItemHeaderButton
                    text={'T'}
                    onButtonClick={() =>
                        onButtonClick(favoriteId, type, 'REPORT_TABLE')
                    }
                />
                <ItemHeaderButton
                    text={'C'}
                    onButtonClick={() =>
                        onButtonClick(favoriteId, type, 'CHART')
                    }
                />
                <ItemHeaderButton
                    text={'M'}
                    onButtonClick={() => onButtonClick(favoriteId, type, 'MAP')}
                />
            </div>
        );
    }
}

export default ItemHeader;

// = ({ type, favoriteId, favoriteName, onButtonClick }) => (
