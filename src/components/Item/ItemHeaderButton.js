import React from 'react';
import PropTypes from 'prop-types';

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

ItemHeaderButton.propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    style: PropTypes.object,
    onClick: PropTypes.func,
};

export default ItemHeaderButton;
