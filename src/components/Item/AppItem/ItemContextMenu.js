import i18n from '@dhis2/d2-i18n'
import {
    colors,
    Button,
    Menu,
    Popover,
    IconFullscreen16,
    IconFullscreenExit16,
    IconLaunch16,
    IconMore24,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, createRef } from 'react'
import { isSmallScreen } from '../../../modules/smallScreen.js'
import MenuItem from '../../MenuItemWithTooltip.js'
import { useSystemSettings } from '../../SystemSettingsProvider.js'
import { useWindowDimensions } from '../../WindowDimensionsProvider.js'
import { isElementFullscreen } from '../fullscreenUtil.js'

export const ItemContextMenu = ({
    appName,
    appUrl,
    item,
    fullscreenSupported,
    onToggleFullscreen,
    loadItemFailed,
}) => {
    const [menuIsOpen, setMenuIsOpen] = useState(false)
    const { width } = useWindowDimensions()

    const { allowVisOpenInApp, allowVisFullscreen } =
        useSystemSettings().systemSettings

    const fullscreenAllowed = fullscreenSupported && allowVisFullscreen

    const noOptionsEnabled = !allowVisOpenInApp && !fullscreenAllowed

    if (noOptionsEnabled || (!allowVisOpenInApp && loadItemFailed)) {
        return null
    }

    const toggleFullscreen = () => {
        onToggleFullscreen()
        closeMenu()
    }

    const openMenu = () => {
        setMenuIsOpen(true)
    }
    const closeMenu = () => setMenuIsOpen(false)

    console.log('AppItem', item)

    const buttonRef = createRef()

    return isElementFullscreen(item.id) ? (
        <Button small secondary onClick={onToggleFullscreen}>
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
                        {allowVisOpenInApp && !isSmallScreen(width) && (
                            <MenuItem
                                icon={<IconLaunch16 />}
                                disabledWhenOffline={false}
                                label={i18n.t('Open in {{appName}}', {
                                    appName,
                                })}
                                href={appUrl}
                                target="_blank"
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
    appName: PropTypes.string,
    appUrl: PropTypes.string,
    fullscreenSupported: PropTypes.bool,
    item: PropTypes.object,
    loadItemFailed: PropTypes.bool,
    onToggleFullscreen: PropTypes.func,
}
