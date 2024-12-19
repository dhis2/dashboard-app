import i18n from '@dhis2/d2-i18n'
import { Divider, colors, spacers, IconQuestion24 } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { EDIT, isEditMode } from '../../../modules/dashboardModes.js'
import {
    sGetItemFiltersRoot,
    DEFAULT_STATE_ITEM_FILTERS,
} from '../../../reducers/itemFilters.js'
import ItemHeader from '../ItemHeader/ItemHeader.js'
import { getIframeSrc } from './getIframeSrc.js'
import styles from './styles/AppItem.module.css'

const AppItem = ({ dashboardMode, item, itemFilters, apps, isFullscreen }) => {
    let appDetails

    const appKey = item.appKey

    if (appKey) {
        appDetails = apps.find((app) => app.key === appKey)
    }

    const hideTitle =
        appDetails?.settings?.dashboardWidget?.hideTitle &&
        dashboardMode !== EDIT

    return appDetails && appDetails.name && appDetails.launchUrl ? (
        <>
            {!hideTitle && (
                <>
                    <ItemHeader
                        title={appDetails.name}
                        itemId={item.id}
                        dashboardMode={dashboardMode}
                        isShortened={item.shortened}
                    />
                    <Divider margin={`0 0 ${spacers.dp4} 0`} />
                </>
            )}
            <iframe
                title={appDetails.name}
                src={getIframeSrc(appDetails, item, itemFilters)}
                className={cx(styles.content, {
                    [styles.hiddenTitle]: hideTitle,
                    [styles.fullscreen]: isFullscreen,
                })}
                style={{ border: 'none' }}
            />
        </>
    ) : (
        <>
            <ItemHeader
                title={i18n.t('{{appKey}} app not found', { appKey })}
            />
            <Divider margin={`0 0 ${spacers.dp4} 0`} />
            <div
                className={cx(styles.content, styles.centered, {
                    [styles.fullscreen]: isFullscreen,
                })}
            >
                <IconQuestion24 color={colors.grey500} />
            </div>
        </>
    )
}

AppItem.propTypes = {
    apps: PropTypes.array,
    dashboardMode: PropTypes.string,
    isFullscreen: PropTypes.bool,
    item: PropTypes.object,
    itemFilters: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => {
    const itemFilters = !isEditMode(ownProps.dashboardMode)
        ? sGetItemFiltersRoot(state)
        : DEFAULT_STATE_ITEM_FILTERS

    return { itemFilters }
}

export default connect(mapStateToProps)(AppItem)
