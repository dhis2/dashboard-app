import React from 'react';

const ItemHeaderButton = ({ text, onButtonClick, style }) => (
    <button type="button" onClick={onButtonClick} style={style}>
        {text}
    </button>
);

export default ItemHeaderButton;
