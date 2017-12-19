import React, { Component } from 'react';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';

const getIconButton = ({
    icon,
    favoriteId,
    type,
    targetType,
    onButtonClick,
    style = {},
}) => (
    <div
        style={{ cursor: 'pointer' }}
        onClick={() =>
            onButtonClick ? onButtonClick(favoriteId, type, targetType) : null
        }
    >
        <SvgIcon icon={icon} style={style} />
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
                <div
                    style={{
                        paddingRight: 10,
                        borderRight: '1px solid #ddd',
                    }}
                >
                    {getIconButton({
                        icon: 'Message',
                        style: { width: 20, height: 20 },
                    })}
                </div>
                <div style={{ paddingLeft: 10, marginRight: 4 }}>
                    {getIconButton({
                        icon: 'GridOn',
                        favoriteId,
                        type,
                        targetType: 'REPORT_TABLE',
                        onButtonClick,
                        style: { width: 20, height: 20 },
                    })}
                </div>
                <div style={{ marginRight: 4 }}>
                    {getIconButton({
                        icon: 'InsertChart',
                        favoriteId,
                        type,
                        targetType: 'CHART',
                        onButtonClick,
                        style: { width: 22, height: 22 },
                    })}
                </div>
                {getIconButton({
                    icon: 'Public',
                    style: { width: 20, height: 20 },
                })}
            </div>
        );
    }
}

export default ItemHeader;
