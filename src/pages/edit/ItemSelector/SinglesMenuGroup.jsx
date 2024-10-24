import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { tSetDashboardItems } from '../../../actions/editDashboard.js'
import ContentMenuItem from './ContentMenuItem.jsx'
import HeaderMenuItem from './HeaderMenuItem.jsx'

const SinglesMenuGroup = ({ onAddItem, category }) => {
    const addToDashboard =
        ({ type, content }) =>
        () => {
            onAddItem({ type, content })
        }

    return (
        <>
            <HeaderMenuItem title={category.header} />
            {category.items.map((item) => (
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
    category: PropTypes.object,
    onAddItem: PropTypes.func,
}

export default connect(null, {
    onAddItem: (item) => (dispatch) => {
        dispatch(tSetDashboardItems(item))
    },
})(SinglesMenuGroup)
