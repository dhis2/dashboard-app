import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { acAddDashboardItem } from '../../../actions/editDashboard'
import ContentMenuItem from './ContentMenuItem'
import HeaderMenuItem from './HeaderMenuItem'

const SinglesMenuGroup = ({ acAddDashboardItem, category }) => {
    const addToDashboard =
        ({ type, content }) =>
        () => {
            acAddDashboardItem({ type, content })
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
    acAddDashboardItem: PropTypes.func,
    category: PropTypes.object,
}

export default connect(null, { acAddDashboardItem })(SinglesMenuGroup)
