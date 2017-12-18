import React from 'react';

const ItemHeaderButton = ({ text, onButtonClick }) => (
    <button type="button" onClick={onButtonClick}>
        {text}
    </button>
);

export default ItemHeaderButton;
