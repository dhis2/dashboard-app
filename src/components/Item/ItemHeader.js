import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { sGetIsEditing } from '../../reducers/editDashboard';
import { acRemoveDashboardItem } from '../../actions/editDashboard';
import DeleteItemButton from './DeleteItemButton';

import classes from './styles/ItemHeader.module.css';

// This is the margin-top + margin-bottom defined in the css file
export const HEADER_MARGIN_HEIGHT = 12;

const ItemHeader = props => {
    const {
        title,
        editMode,
        actionButtons,
        itemId,
        acRemoveDashboardItem,
        forwardedRef,
    } = props;

    const handleDeleteItem = () => acRemoveDashboardItem(itemId);

    return (
        <div className={classes.itemHeaderWrap} ref={forwardedRef}>
            <p className={classes.itemTitle}>{title}</p>
            {editMode ? (
                <div className={classes.itemActionsWrap}>
                    <DeleteItemButton onClick={handleDeleteItem} />
                </div>
            ) : (
                actionButtons && (
                    <div className={classes.itemActionsWrap}>
                        {actionButtons}
                    </div>
                )
            )}
        </div>
    );
};

ItemHeader.propTypes = {
    acRemoveDashboardItem: PropTypes.func,
    actionButtons: PropTypes.node,
    editMode: PropTypes.bool,
    forwardedRef: PropTypes.object,
    itemId: PropTypes.string,
    title: PropTypes.string,
};

ItemHeader.defaultProps = {
    forwardedRef: {},
};

const mapStateToProps = state => ({
    editMode: sGetIsEditing(state),
});

const mapDispatchToProps = {
    acRemoveDashboardItem,
};

const ConnectedItemHeader = connect(
    mapStateToProps,
    mapDispatchToProps
)(ItemHeader);

// TODO this is a false positive that is fixed in eslint-plugin-react v7.15
// github.com/yannickcr/eslint-plugin-react/blob/master/CHANGELOG.md
/* eslint-disable react/display-name */
export default React.forwardRef((props, ref) => (
    <ConnectedItemHeader {...props} forwardedRef={ref} />
));
/* eslint-enable react/display-name */
