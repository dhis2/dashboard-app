import i18n from '@dhis2/d2-i18n'
import {
    colors,
    Button,
    Menu,
    Popover,
    IconFullscreen16,
    IconLaunch16,
    IconMore16,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import { isSmallScreen } from '../../../modules/smallScreen.js'
import { useSystemSettings } from '../../AppDataProvider/AppDataProvider.js'
import MenuItem from '../../MenuItemWithTooltip.js'
import { useWindowDimensions } from '../../WindowDimensionsProvider.js'

export const ItemContextMenu = ({
    appName,
    appUrl,
    enterFullscreen,
    loadItemFailed,
}) => {
    const buttonRef = useRef()
    const [menuIsOpen, setMenuIsOpen] = useState(false)
    const { width } = useWindowDimensions()

    const { allowVisOpenInApp, allowVisFullscreen } = useSystemSettings()

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
                    icon={<IconMore16 color={colors.grey700} />}
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
}
