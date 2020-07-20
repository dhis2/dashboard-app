import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { acRemoveDashboardItem } from '../../../actions/editDashboard'
import DeleteItemButton from './DeleteItemButton'

import classes from './styles/ItemHeader.module.css'

const EditItemActions = ({ itemId, acRemoveDashboardItem }) => {
    const handleDeleteItem = () => acRemoveDashboardItem(itemId)

    return (
        <div className={classes.itemActionsWrap}>
            <DeleteItemButton onClick={handleDeleteItem} />
        </div>
    )
}

EditItemActions.propTypes = {
    acRemoveDashboardItem: PropTypes.func,
    itemId: PropTypes.string,
}

const mapDispatchToProps = {
    acRemoveDashboardItem,
}

export default connect(null, mapDispatchToProps)(EditItemActions)
