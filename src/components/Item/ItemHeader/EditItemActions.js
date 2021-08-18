import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import DeleteItemButton from './DeleteItemButton'
import {
    acRemoveDashboardItem,
    tSetDashboardItems,
} from '../../../actions/editDashboard'

import classes from './styles/ItemHeader.module.css'
import { sGetLayoutColumns } from '../../../reducers/editDashboard'

const EditItemActions = ({ itemId, onDeleteItem }) => {
    return (
        <div className={classes.itemActionsWrap}>
            <DeleteItemButton onClick={() => onDeleteItem(itemId)} />
        </div>
    )
}

EditItemActions.propTypes = {
    // acRemoveDashboardItem: PropTypes.func,
    itemId: PropTypes.string,
    onDeleteItem: PropTypes.func,
}

const mapDispatchToProps = {
    onDeleteItem: itemId => (dispatch, getState) => {
        const columns = sGetLayoutColumns(getState())

        if (columns.length) {
            dispatch(tSetDashboardItems(null, itemId)) // TODO support removal
        } else {
            dispatch(acRemoveDashboardItem(itemId))
        }
    },
}

export default connect(null, mapDispatchToProps)(EditItemActions)
