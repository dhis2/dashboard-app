import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Divider, IconFileDocument16, colors, spacers } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import {
    acUpdateDashboardItem,
    acRemoveDashboardItem,
} from '../../../actions/editDashboard.js'
import { isEditMode } from '../../../modules/dashboardModes.js'
import { itemTypeMap, getItemUrl } from '../../../modules/itemTypes.js'
import { orArray } from '../../../modules/util.js'
import ItemHeader from '../ItemHeader/ItemHeader.jsx'
import classes from './Item.module.css'

const getItemTitle = (item) => itemTypeMap[item.type].pluralTitle

const getContentItems = (item) =>
    orArray(item[itemTypeMap[item.type].propName]).filter(
        (item, index, array) =>
            array.findIndex((el) => el.id === item.id) === index
    )

const ListItem = ({
    item,
    dashboardMode,
    removeItem,
    updateItem,
    isFullscreen,
    isSlideshowView,
}) => {
    const { baseUrl } = useConfig()
    const contentItems = getContentItems(item)

    const updateDashboardItem = (content) => {
        const listItemType = itemTypeMap[item.type].propName

        const newContent = item[listItemType].filter(
            (item) => item.id !== content.id
        )

        if (newContent.length) {
            item[listItemType] = newContent
            updateItem(item)
        } else {
            removeItem(item)
        }
    }

    const getLink = (contentItem) => {
        const removeButton = (
            <button
                className={classes.removeButton}
                onClick={() => updateDashboardItem(contentItem)}
            >
                {i18n.t('Remove')}
            </button>
        )

        return (
            <>
                <a
                    className={classes.link}
                    style={{ color: colors.grey900 }}
                    href={getItemUrl(item.type, contentItem, baseUrl)}
                    tabIndex={isSlideshowView ? '-1' : '0'}
                    target="_top"
                    rel="noreferrer"
                >
                    {contentItem.name}
                </a>
                {isEditMode(dashboardMode) ? removeButton : null}
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
            <div
                className={cx(classes.content, {
                    [classes.fullscreen]: isFullscreen,
                })}
            >
                <ul className={classes.list}>
                    {contentItems.map((contentItem) => (
                        <li className={classes.item} key={contentItem.id}>
                            <span className={classes.itemContent}>
                                <IconFileDocument16 color={colors.grey600} />
                                {getLink(contentItem)}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

ListItem.propTypes = {
    dashboardMode: PropTypes.string,
    isFullscreen: PropTypes.bool,
    isSlideshowView: PropTypes.bool,
    item: PropTypes.object,
    removeItem: PropTypes.func,
    updateItem: PropTypes.func,
}

export default connect(null, {
    removeItem: acRemoveDashboardItem,
    updateItem: acUpdateDashboardItem,
})(ListItem)
