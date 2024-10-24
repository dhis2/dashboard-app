import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { MenuItem, Divider } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { tSetDashboardItems } from '../../../actions/editDashboard.js'
import { getItemUrl, APP, VISUALIZATION } from '../../../modules/itemTypes.js'
import { tAddListItemContent } from './actions.js'
import ContentMenuItem from './ContentMenuItem.jsx'
import HeaderMenuItem from './HeaderMenuItem.jsx'
import { categorizedItems, listItemTypes } from './selectableItems.js'
import classes from './styles/CategorizedMenuGroup.module.css'

const CategorizedMenuGroup = ({
    type,
    title,
    items,
    hasMore,
    onAddItem,
    tAddListItemContent,
    onChangeItemsLimit,
}) => {
    const { baseUrl } = useConfig()
    const [seeMore, setSeeMore] = useState(false)

    const addItem = (item) => () => {
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
            {items.map((item) => {
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
    hasMore: PropTypes.bool,
    tAddListItemContent: PropTypes.func,
}

export default connect(null, {
    tAddListItemContent,
    onAddItem: (item) => (dispatch) => {
        dispatch(tSetDashboardItems(item))
    },
})(CategorizedMenuGroup)
