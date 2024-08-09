// eslint-disable-next-line import/no-unresolved
import { Plugin } from '@dhis2/app-runtime/experimental'
import i18n from '@dhis2/d2-i18n'
import { Divider, colors, spacers, IconQuestion24 } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { connect, useSelector } from 'react-redux'
import { EDIT, isEditMode } from '../../../modules/dashboardModes.js'
import { useCacheableSection } from '../../../modules/useCacheableSection.js'
import {
    sGetItemFiltersRoot,
    DEFAULT_STATE_ITEM_FILTERS,
} from '../../../reducers/itemFilters.js'
import { sGetSelectedId } from '../../../reducers/selected.js'
import ItemHeader from '../ItemHeader/ItemHeader.js'
import { getIframeSrc } from './getIframeSrc.js'
import styles from './styles/AppItem.module.css'

const AppItem = ({ dashboardMode, item, itemFilters, apps, isFullscreen }) => {
    const dashboardId = useSelector(sGetSelectedId)

    const { isCached } = useCacheableSection(dashboardId)

    let appDetails

    const appKey = item.appKey

    if (appKey) {
        appDetails = apps.find((app) => app.key === appKey)
    }

    const hideTitle =
        appDetails?.settings?.dashboardWidget?.hideTitle &&
        dashboardMode !== EDIT

    const iframeSrc = getIframeSrc(appDetails, item, itemFilters)

    return iframeSrc ? (
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

            {appDetails.appType === 'APP' ? (
                // new plugins
                <Plugin
                    pluginSource={iframeSrc}
                    dashboardItemId={item.id}
                    cacheId={`${dashboardId}-${item.id}`}
                    isParentCached={isCached}
                />
            ) : (
                // legacy widgets
                <iframe
                    title={appDetails.name}
                    src={iframeSrc}
                    className={cx(styles.content, {
                    [styles.hiddenTitle]: hideTitle,
                    [styles.fullscreen]: isFullscreen,
                })}
                    style={{ border: 'none' }}
                />
            )}
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
