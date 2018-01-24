import React from 'react';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';

const ItemButton = ({ icon, onClick, style }) => (
    <div style={{ cursor: 'pointer' }} onClick={onClick}>
        <SvgIcon icon={icon} style={style} />
    </div>
);

export default ItemButton;
