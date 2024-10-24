import {
    isSingleValue,
    isYearOverYear,
    VIS_TYPE_GAUGE,
    VIS_TYPE_PIE,
} from '@dhis2/analytics'
import { useConfig } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import {
    colors,
    Button,
    Menu,
    Popover,
    Divider,
    IconFullscreen16,
    IconFullscreenExit16,
    IconLaunch16,
    IconMessages16,
    IconMore24,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, createRef } from 'react'
import { getVisualizationId } from '../../../../modules/item.js'
import {
    getAppName,
    itemTypeMap,
    getItemTypeForVis,
    EVENT_VISUALIZATION,
} from '../../../../modules/itemTypes.js'
import { isSmallScreen } from '../../../../modules/smallScreen.js'
import MenuItem from '../../../MenuItemWithTooltip.jsx'
import { useSystemSettings } from '../../../SystemSettingsProvider.jsx'
import { useWindowDimensions } from '../../../WindowDimensionsProvider.jsx'
import { isElementFullscreen } from '../isElementFullscreen.js'
import ViewAsMenuItems from './ViewAsMenuItems.jsx'

const ItemContextMenu = (props) => {
    const [menuIsOpen, setMenuIsOpen] = useState(false)
    const { width } = useWindowDimensions()
    const { baseUrl } = useConfig()

    const {
        allowVisOpenInApp,
        allowVisShowInterpretations,
        allowVisViewAs,
        allowVisFullscreen,
    } = useSystemSettings().systemSettings

    const fullscreenAllowed = props.fullscreenSupported && allowVisFullscreen

    const noOptionsEnabled =
        !allowVisOpenInApp &&
        !allowVisShowInterpretations &&
        !allowVisViewAs &&
        !fullscreenAllowed

    if (noOptionsEnabled || (!allowVisOpenInApp && props.loadItemFailed)) {
        return null
    }

    const toggleInterpretations = () => {
        props.onToggleFooter()
        if (menuIsOpen) {
            closeMenu()
        }
    }

    const toggleFullscreen = () => {
        props.onToggleFullscreen()
        closeMenu()
    }

    const onActiveTypeChanged = (type) => {
        closeMenu()
        props.onSelectActiveType(type)
    }

    const openMenu = () => {
        setMenuIsOpen(true)
    }
    const closeMenu = () => setMenuIsOpen(false)

    const { item, visualization, loadItemFailed, activeType } = props
    const type = visualization.type || item.type
    const canViewAs =
        allowVisViewAs &&
        !isSingleValue(type) &&
        !isYearOverYear(type) &&
        item.type !== EVENT_VISUALIZATION &&
        type !== VIS_TYPE_GAUGE &&
        type !== VIS_TYPE_PIE

    const interpretationMenuLabel = props.activeFooter
        ? i18n.t(`Hide details and interpretations`)
        : i18n.t(`Show details and interpretations`)

    const buttonRef = createRef()

    const itemHref = `${baseUrl}/${itemTypeMap[item.type].appUrl(
        getVisualizationId(item)
    )}`

    return isElementFullscreen(item.id) ? (
        <Button small secondary onClick={props.onToggleFullscreen}>
            <span data-testid="exit-fullscreen-button">
                <IconFullscreenExit16 color={colors.grey600} />
            </span>
        </Button>
    ) : (
        <>
            <div ref={buttonRef}>
                <Button
                    small
                    secondary
                    onClick={openMenu}
                    dataTest="dashboarditem-menu-button"
                    icon={<IconMore24 color={colors.grey700} />}
                />
            </div>
            {menuIsOpen && (
                <Popover
                    reference={buttonRef}
                    placement="auto-start"
                    arrow={false}
                    onClickOutside={closeMenu}
                >
                    <Menu dense>
                        {canViewAs && !loadItemFailed && (
                            <>
                                <ViewAsMenuItems
                                    type={getItemTypeForVis(item)}
                                    activeType={activeType}
                                    onActiveTypeChanged={onActiveTypeChanged}
                                    visualization={visualization}
                                />
                                {(allowVisShowInterpretations ||
                                    (allowVisOpenInApp &&
                                        !isSmallScreen(width)) ||
                                    fullscreenAllowed) && (
                                    <span data-testid="divider">
                                        <Divider />
                                    </span>
                                )}
                            </>
                        )}
                        {allowVisOpenInApp && !isSmallScreen(width) && (
                            <MenuItem
                                icon={<IconLaunch16 />}
                                disabledWhenOffline={false}
                                label={i18n.t('Open in {{appName}} app', {
                                    appName: getAppName(item.type),
                                })}
                                href={itemHref}
                                target="_blank"
                            />
                        )}
                        {allowVisShowInterpretations && !loadItemFailed && (
                            <MenuItem
                                icon={<IconMessages16 />}
                                label={interpretationMenuLabel}
                                onClick={toggleInterpretations}
                            />
                        )}
                        {fullscreenAllowed && !loadItemFailed && (
                            <MenuItem
                                disabledWhenOffline={false}
                                icon={<IconFullscreen16 />}
                                label={i18n.t('View fullscreen')}
                                onClick={toggleFullscreen}
                            />
                        )}
                    </Menu>
                </Popover>
            )}
        </>
    )
}

ItemContextMenu.propTypes = {
    activeFooter: PropTypes.bool,
    activeType: PropTypes.string,
    fullscreenSupported: PropTypes.bool,
    item: PropTypes.object,
    loadItemFailed: PropTypes.bool,
    visualization: PropTypes.object,
    onSelectActiveType: PropTypes.func,
    onToggleFooter: PropTypes.func,
    onToggleFullscreen: PropTypes.func,
}

export default ItemContextMenu
