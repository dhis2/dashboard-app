import React from 'react';

const DashboardItemHeaderButton = ({ text, onButtonClick }) => (
    <button type="button" onClick={onButtonClick}>
        {text}
    </button>
);

export default DashboardItemHeaderButton;
