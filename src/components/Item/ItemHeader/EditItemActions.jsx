import PropTypes from 'prop-types'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    acRemoveDashboardItem,
    tSetDashboardItems,
} from '../../../actions/editDashboard.js'
import {
    sGetEditDashboardItems,
    sGetLayoutColumns,
} from '../../../reducers/editDashboard.js'
import DeleteItemButton from './DeleteItemButton.jsx'
import classes from './styles/ItemHeader.module.css'

const EditItemActions = ({ itemId, onDelete }) => {
    const dispatch = useDispatch()
    const columns = useSelector(sGetLayoutColumns)
    const dashboardItems = useSelector(sGetEditDashboardItems)

    const onDeleteItem = (itemId) => {
        onDelete()
            .catch((e) => {
                console.warn('Error in the onRemove plugin callback', e)
            })
            .finally(() => {
                if (!columns.length || dashboardItems.length === 1) {
                    dispatch(acRemoveDashboardItem(itemId))
                } else {
                    dispatch(tSetDashboardItems(null, itemId))
                }
            })
    }

    return (
        <div className={classes.itemActionsWrap}>
            <DeleteItemButton onClick={() => onDeleteItem(itemId)} />
        </div>
    )
}

EditItemActions.defaultProps = {
    onDelete: () => Promise.resolve(),
}

EditItemActions.propTypes = {
    itemId: PropTypes.string,
    onDelete: PropTypes.func,
}

export default EditItemActions
