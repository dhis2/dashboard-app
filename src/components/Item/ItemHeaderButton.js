import React from 'react';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';

import './ItemHeaderButton.css';

const ItemHeaderButton = ({ icon, disabled, onClick, style = {} }) => {
    return (
        <button
            disabled={disabled}
            type="button"
            className="item-action-button"
            style={style.container}
            onClick={onClick}
        >
            <SvgIcon icon={icon} style={style.icon} />
        </button>
    );
};

export default ItemHeaderButton;
