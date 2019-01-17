import React from 'react';

export const HEADER_HEIGHT = 45;

const ItemHeader = props => {
    const { title, actionButtons, editMode } = props;

    return (
        <div className="dashboard-item-header">
            <div
                className="dashboard-item-header-title"
                style={{ userSelect: editMode ? 'none' : 'text' }}
            >
                {title}
            </div>
            {actionButtons}
        </div>
    );
};

export default ItemHeader;
