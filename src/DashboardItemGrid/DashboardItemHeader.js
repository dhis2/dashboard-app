import React from 'react';

import DashboardItemHeaderButton from './DashboardItemHeaderButton';

// export const DashboardItemHeader = ({ item, onButtonClick }) => {

const DashboardItemHeader = ({
    type,
    favoriteId,
    favoriteName,
    onButtonClick,
}) => (
    <div className="dashboard-item-header">
        <div className="dashboard-item-header-title">{favoriteName}</div>
        <DashboardItemHeaderButton
            text={'T'}
            onButtonClick={() =>
                onButtonClick(favoriteId, type, 'REPORT_TABLE')
            }
        />
        <DashboardItemHeaderButton
            text={'C'}
            onButtonClick={() => onButtonClick(favoriteId, type, 'CHART')}
        />
        <DashboardItemHeaderButton
            text={'M'}
            onButtonClick={() => onButtonClick(favoriteId, type, 'MAP')}
        />
    </div>
);

export default DashboardItemHeader;
