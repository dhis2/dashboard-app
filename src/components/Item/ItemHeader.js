import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { sGetIsEditing } from '../../reducers/editDashboard';
import { acRemoveDashboardItem } from '../../actions/editDashboard';
import DeleteItemButton from './DeleteItemButton';

import classes from './styles/ItemHeader.module.css';

const ItemHeader = props => {
    const {
        title,
        editMode,
        actionButtons,
        itemId,
        acRemoveDashboardItem,
    } = props;

    const handleDeleteItem = () => acRemoveDashboardItem(itemId);

    return (
        <div className={classes.itemHeaderWrap}>
            <p className={classes.itemTitle}>{title}</p>
            <div className={classes.itemActionsWrap}>
                {editMode ? (
                    <DeleteItemButton onClick={handleDeleteItem} />
                ) : (
                    actionButtons
                )}
            </div>
        </div>
    );
};

ItemHeader.propTypes = {
    acRemoveDashboardItem: PropTypes.func,
    actionButtons: PropTypes.node,
    editMode: PropTypes.bool,
    itemId: PropTypes.string,
    title: PropTypes.string,
};

const mapStateToProps = state => ({
    editMode: sGetIsEditing(state),
});

const mapDispatchToProps = {
    acRemoveDashboardItem,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemHeader);
