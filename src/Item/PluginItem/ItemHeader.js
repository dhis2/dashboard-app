import React, { Component, Fragment } from 'react';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';

const style = {
    title: {
        paddingRight: 10,
        borderRight: '1px solid #ddd',
    },
};

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
    renderButtons() {
        const {
            type,
            favoriteId,
            onButtonClick,
            onInterpretationsClick,
        } = this.props;

        return (
            <Fragment>
                <div style={style.title}>
                    <div
                        style={{ cursor: 'pointer' }}
                        onClick={onInterpretationsClick}
                    >
                        <SvgIcon icon="Message" />
                    </div>
                </div>
                <div style={{ paddingLeft: 10, marginRight: 4 }}>
                    {getIconButton({
                        icon: 'ViewList',
                        favoriteId,
                        type,
                        targetType: 'REPORT_TABLE',
                        onButtonClick,
                        //style: { width: 25, height: 25 },
                    })}
                </div>
                <div style={{ marginRight: 4 }}>
                    {getIconButton({
                        icon: 'InsertChart',
                        favoriteId,
                        type,
                        targetType: 'CHART',
                        onButtonClick,
                        //style: { width: 22, height: 22 },
                    })}
                </div>
                {getIconButton({
                    icon: 'Public',
                    //style: { width: 20, height: 20 },
                })}
            </Fragment>
        );
    }

    render() {
        const { favoriteName } = this.props;

        return (
            <div className="dashboard-item-header">
                <div className="dashboard-item-header-title">
                    {favoriteName}
                </div>
                {!this.props.editMode ? this.renderButtons() : null}
            </div>
        );
    }
}

export default ItemHeader;
