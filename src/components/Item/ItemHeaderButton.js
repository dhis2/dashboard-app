import React from 'react';

import './ItemHeaderButton.css';

const ItemHeaderButton = ({ disabled, onClick, children, style }) => {
    return (
        <button
            disabled={disabled}
            type="button"
            className="item-action-button"
            style={style}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default ItemHeaderButton;
