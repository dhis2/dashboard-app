import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { sGetIsEditing } from '../../reducers/editDashboard'
import { acRemoveDashboardItem } from '../../actions/editDashboard'
import DeleteItemButton from './DeleteItemButton'

import classes from './styles/ItemHeader.module.css'

// This is the margin-top + margin-bottom defined in the css file
export const HEADER_MARGIN_HEIGHT = 12

const ItemHeader = React.forwardRef(
    (
        { itemId, acRemoveDashboardItem, actionButtons, title, editMode },
        ref
    ) => {
        const handleDeleteItem = () => acRemoveDashboardItem(itemId)

        return (
            <div className={classes.itemHeaderWrap} ref={ref}>
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
        )
    }
)

ItemHeader.displayName = 'ItemHeader'

ItemHeader.propTypes = {
    acRemoveDashboardItem: PropTypes.func,
    actionButtons: PropTypes.node,
    editMode: PropTypes.bool,
    itemId: PropTypes.string,
    title: PropTypes.string,
}

const mapStateToProps = state => ({
    editMode: sGetIsEditing(state),
})

const mapDispatchToProps = {
    acRemoveDashboardItem,
}

export default connect(mapStateToProps, mapDispatchToProps, null, {
    forwardRef: true,
})(ItemHeader)
