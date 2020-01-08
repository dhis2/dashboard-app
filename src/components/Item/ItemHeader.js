import React from 'react';
import PropTypes from 'prop-types';

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

ItemHeader.propTypes = {
    actionButtons: PropTypes.node,
    editMode: PropTypes.bool,
    title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default ItemHeader;
