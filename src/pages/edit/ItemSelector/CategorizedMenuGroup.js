import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'
import { MenuItem, Divider } from '@dhis2/ui'
import { useConfig } from '@dhis2/app-runtime'

import HeaderMenuItem from './HeaderMenuItem'
import ContentMenuItem from './ContentMenuItem'
import { categorizedItems, listItemTypes } from './selectableItems'
import { tAddListItemContent } from './actions'
import {
    // acAddDashboardItem,
    tSetDashboardItems,
} from '../../../actions/editDashboard'
import { getItemUrl, APP, VISUALIZATION } from '../../../modules/itemTypes'

import classes from './styles/CategorizedMenuGroup.module.css'

// one of the items passed down

// TYPE: "VISUALIZATION"

// attributeValues: []
// created: "2021-08-10T11:29:51.648"
// createdBy: {id: "xE7jOejl9FI", code: null, name: "John Traore", displayName: "John Traore", username: "admin"}
// displayName: "A1 POST"
// externalAccess: false
// favorite: false
// favorites: []
// id: "MEKCqWipb0W"
// lastUpdated: "2021-08-10T11:29:51.648"
// lastUpdatedBy: {id: "xE7jOejl9FI", code: null, name: "John Traore", displayName: "John Traore", username: "admin"}
// name: "A1 POST"
// publicAccess: "--------"
// sharing: {owner: "xE7jOejl9FI", external: false, users: {…}, userGroups: {…}, public: "--------"}
// translations: []
// type: "PIVOT_TABLE"
// user: {id: "xE7jOejl9FI", code: null, name: "John Traore", displayName: "John Traore", username: "admin"}
// userAccesses: []

const CategorizedMenuGroup = ({
    type,
    title,
    items,
    hasMore,
    // acAddDashboardItem,
    onAddItem,
    tAddListItemContent,
    onChangeItemsLimit,
}) => {
    const { baseUrl } = useConfig()
    const [seeMore, setSeeMore] = useState(false)
    console.log('ITEMS', items)
    console.log('TYPE', type)
    const addItem = item => () => {
        if (type === APP) {
            // acAddDashboardItem({ type, content: item.key })
            onAddItem({ type, content: item.key })
        } else {
            const newItem = {
                id: item.id,
                name: item.displayName || item.name,
            }

            if (listItemTypes.includes(type)) {
                tAddListItemContent(type, newItem)
            } else {
                onAddItem({ type, content: newItem })
            }
        }
    }

    const toggleSeeMore = () => {
        setSeeMore(!seeMore)
        onChangeItemsLimit(type)
    }

    return (
        <>
            <HeaderMenuItem title={title} />
            {items.map(item => {
                const itemUrl = getItemUrl(type, item, baseUrl)
                return (
                    <ContentMenuItem
                        key={item.id || item.key}
                        type={type}
                        visType={type === VISUALIZATION ? item.type : type}
                        name={item.displayName || item.name}
                        onInsert={addItem(item)}
                        url={itemUrl}
                    />
                )
            })}
            {hasMore ? (
                <MenuItem
                    dense
                    key={`showmore${title}`}
                    onClick={toggleSeeMore}
                    label={
                        <button className={classes.showMoreButton}>
                            {seeMore
                                ? i18n.t('Show fewer')
                                : i18n.t('Show more')}
                        </button>
                    }
                />
            ) : null}
            <Divider margin="8px 0px" />
        </>
    )
}

CategorizedMenuGroup.propTypes = {
    items: PropTypes.array.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.oneOf(categorizedItems).isRequired,
    onAddItem: PropTypes.func.isRequired,
    onChangeItemsLimit: PropTypes.func.isRequired,
    // acAddDashboardItem: PropTypes.func,
    hasMore: PropTypes.bool,
    tAddListItemContent: PropTypes.func,
}

export default connect(null, {
    // acAddDashboardItem,
    tAddListItemContent,
    onAddItem: item => dispatch => {
        console.group('map dispatch to props')
        console.log('item', item)
        console.log('type', item.type)
        console.groupEnd()
        dispatch(tSetDashboardItems(item))
    },
})(CategorizedMenuGroup)
