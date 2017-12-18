import React from 'react';

import ItemHeaderButton from './ItemHeaderButton';

const ItemHeader = ({ type, favoriteId, favoriteName, onButtonClick }) => (
    <div className="dashboard-item-header">
        <div className="dashboard-item-header-title">{favoriteName}</div>
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
            onButtonClick={() => onButtonClick(favoriteId, type, 'CHART')}
        />
        <ItemHeaderButton
            text={'M'}
            onButtonClick={() => onButtonClick(favoriteId, type, 'MAP')}
        />
    </div>
);

export default ItemHeader;
