import React from 'react';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';

const ItemHeaderButton = ({ icon, onClick, style = {} }) => {
    const containerStyle = Object.assign(
        {},
        { cursor: 'pointer' },
        style.container
    );

    return (
        <div style={containerStyle} onClick={onClick}>
            <SvgIcon icon={icon} style={style.icon} />
        </div>
    );
};

export default ItemHeaderButton;
