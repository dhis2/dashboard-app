import i18n from '@dhis2/d2-i18n'
import {
    colors,
    Button,
    Menu,
    Popover,
    IconFullscreen16,
    IconLaunch16,
    IconMore24,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import { isSmallScreen } from '../../../modules/smallScreen.js'
import MenuItem from '../../MenuItemWithTooltip.js'
import { useSystemSettings } from '../../SystemSettingsProvider.js'
import { useWindowDimensions } from '../../WindowDimensionsProvider.js'

export const ItemContextMenu = ({
    appName,
    appUrl,
    enterFullscreen,
    loadItemFailed,
    tabIndex,
}) => {
    const buttonRef = useRef()
    const [menuIsOpen, setMenuIsOpen] = useState(false)
    const { width } = useWindowDimensions()

    const { allowVisOpenInApp, allowVisFullscreen } =
        useSystemSettings().systemSettings

    const noOptionsEnabled = !allowVisOpenInApp && !allowVisFullscreen

    if (noOptionsEnabled || (!allowVisOpenInApp && loadItemFailed)) {
        return null
    }

    const openMenu = () => {
        setMenuIsOpen(true)
    }
    const closeMenu = () => setMenuIsOpen(false)

    const onEnterFullscreen = () => {
        enterFullscreen()
        closeMenu()
    }

    return (
        <>
            <div ref={buttonRef}>
                <Button
                    small
                    secondary
                    title={i18n.t('Open menu')}
                    onClick={openMenu}
                    dataTest="appitem-menu-button"
                    icon={<IconMore24 color={colors.grey700} />}
                    tabIndex={tabIndex}
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
                        {allowVisFullscreen && !loadItemFailed && (
                            <MenuItem
                                disabledWhenOffline={false}
                                icon={<IconFullscreen16 />}
                                label={i18n.t('View fullscreen')}
                                onClick={onEnterFullscreen}
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
    enterFullscreen: PropTypes.func,
    loadItemFailed: PropTypes.bool,
    tabIndex: PropTypes.string,
}
