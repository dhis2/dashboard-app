import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import HeaderMenuItem from './HeaderMenuItem'
import ContentMenuItem from './ContentMenuItem'
import {
    // acAddDashboardItem,
    tSetDashboardItems,
} from '../../../actions/editDashboard'

const SinglesMenuGroup = ({ onAddItem, category }) => {
    const addToDashboard = ({ type, content }) => () => {
        onAddItem({ type, content })
    }

    return (
        <>
            <HeaderMenuItem title={category.header} />
            {category.items.map(item => (
                <ContentMenuItem
                    key={item.type}
                    type={item.type}
                    name={item.name}
                    onInsert={addToDashboard(item)}
                />
            ))}
        </>
    )
}

SinglesMenuGroup.propTypes = {
    // acAddDashboardItem: PropTypes.func,
    category: PropTypes.object,
    onAddItem: PropTypes.func,
}

export default connect(null, {
    onAddItem: item => dispatch => {
        dispatch(tSetDashboardItems(item))
    },
})(SinglesMenuGroup)
