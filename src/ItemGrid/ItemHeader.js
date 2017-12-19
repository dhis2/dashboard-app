import React, { Component } from 'react';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';

const getIconButton = (icon, favoriteId, type, targetType, onButtonClick) => (
    <div
        style={{ cursor: 'pointer' }}
        onClick={() =>
            onButtonClick ? onButtonClick(favoriteId, type, targetType) : null
        }
    >
        <SvgIcon icon={icon} />
    </div>
);

class ItemHeader extends Component {
    render() {
        const { type, favoriteId, favoriteName, onButtonClick } = this.props;

        return (
            <div className="dashboard-item-header">
                <div className="dashboard-item-header-title">
                    {favoriteName}
                </div>
                <div style={{ marginRight: 20 }}>
                    {getIconButton('ArrowDownward')}
                </div>
                <div style={{ marginRight: 5 }}>
                    {getIconButton(
                        'ViewList',
                        favoriteId,
                        type,
                        'REPORT_TABLE',
                        onButtonClick
                    )}
                </div>
                <div style={{ marginRight: 5 }}>
                    {getIconButton(
                        'Star',
                        favoriteId,
                        type,
                        'CHART',
                        onButtonClick
                    )}
                </div>
                {getIconButton('Room', favoriteId, type, 'MAP', onButtonClick)}
            </div>
        );
    }
}

export default ItemHeader;
