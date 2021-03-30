import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Divider, colors, spacers } from '@dhis2/ui'
import { useConfig } from '@dhis2/app-runtime'
import DescriptionIcon from './assets/Description'
import DeleteIcon from './assets/Delete'

import { itemTypeMap, getItemUrl } from '../../../modules/itemTypes'
import { orArray } from '../../../modules/util'
import {
    acUpdateDashboardItem,
    acRemoveDashboardItem,
} from '../../../actions/editDashboard'

import ItemHeader from '../ItemHeader/ItemHeader'
import { isEditMode } from '../../../modules/dashboardModes'

import classes from './Item.module.css'

const getItemTitle = item => itemTypeMap[item.type].pluralTitle

const getContentItems = item =>
    orArray(item[itemTypeMap[item.type].propName]).filter(
        (item, index, array) =>
            array.findIndex(el => el.id === item.id) === index
    )

const ListItem = ({ item, dashboardMode, removeItem, updateItem }) => {
    const { baseUrl } = useConfig()
    const contentItems = getContentItems(item)

    const updateDashboardItem = content => {
        const listItemType = itemTypeMap[item.type].propName

        const newContent = item[listItemType].filter(
            item => item.id !== content.id
        )

        if (newContent.length) {
            item[listItemType] = newContent
            updateItem(item)
        } else {
            removeItem(item)
        }
    }

    const getLink = contentItem => {
        const deleteButton = (
            <button
                className={classes.deletebutton}
                onClick={() => updateDashboardItem(contentItem)}
            >
                <DeleteIcon className={classes.deleteicon} />
            </button>
        )

        return (
            <>
                <a
                    className={classes.link}
                    style={{ color: colors.grey900 }}
                    href={getItemUrl(item.type, contentItem, baseUrl)}
                >
                    {contentItem.name}
                </a>
                {isEditMode(dashboardMode) ? deleteButton : null}
            </>
        )
    }

    return (
        <>
            <ItemHeader
                title={getItemTitle(item)}
                itemId={item.id}
                dashboardMode={dashboardMode}
                isShortened={item.shortened}
            />
            <Divider margin={`0 0 ${spacers.dp4} 0`} />
            <div className="dashboard-item-content">
                <ul className={classes.list}>
                    {contentItems.map(contentItem => (
                        <li className={classes.item} key={contentItem.id}>
                            <DescriptionIcon className={classes.itemicon} />
                            {getLink(contentItem)}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

ListItem.propTypes = {
    dashboardMode: PropTypes.string,
    item: PropTypes.object,
    removeItem: PropTypes.func,
    updateItem: PropTypes.func,
}

export default connect(null, {
    removeItem: acRemoveDashboardItem,
    updateItem: acUpdateDashboardItem,
})(ListItem)
