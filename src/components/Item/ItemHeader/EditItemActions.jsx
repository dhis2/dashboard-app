import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
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

const EditItemActions = ({ itemId, onDeleteItem }) => {
    return (
        <div className={classes.itemActionsWrap}>
            <DeleteItemButton onClick={() => onDeleteItem(itemId)} />
        </div>
    )
}

EditItemActions.propTypes = {
    itemId: PropTypes.string,
    onDeleteItem: PropTypes.func,
}

const mapDispatchToProps = {
    onDeleteItem: (itemId) => (dispatch, getState) => {
        const columns = sGetLayoutColumns(getState())
        const dashboardItems = sGetEditDashboardItems(getState())

        if (!columns.length || dashboardItems.length === 1) {
            dispatch(acRemoveDashboardItem(itemId))
        } else {
            dispatch(tSetDashboardItems(null, itemId))
        }
    },
}

export default connect(null, mapDispatchToProps)(EditItemActions)
