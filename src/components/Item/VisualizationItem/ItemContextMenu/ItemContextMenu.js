import React, { useState, createRef } from 'react'
import PropTypes from 'prop-types'
import { useConfig } from '@dhis2/app-runtime'
import {
    isSingleValue,
    isYearOverYear,
    VIS_TYPE_GAUGE,
    VIS_TYPE_PIE,
} from '@dhis2/analytics'
import { Button, Menu, Popover, MenuItem, Divider } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import LaunchIcon from '@material-ui/icons/Launch'
import ViewAsMenuItems from './ViewAsMenuItems'
import { useWindowDimensions } from '../../../WindowDimensionsProvider'
import { isSmallScreen } from '../../../../modules/smallScreen'

import {
    ThreeDots,
    SpeechBubble,
    Fullscreen,
    ExitFullscreen,
} from '../assets/icons'
import { getLink } from '../Visualization/plugin'
import { getAppName } from '../../../../modules/itemTypes'
import { useSystemSettings } from '../../../SystemSettingsProvider'

const ItemContextMenu = props => {
    const [menuIsOpen, setMenuIsOpen] = useState(false)
    const { width } = useWindowDimensions()
    const { baseUrl } = useConfig()

    const {
        allowVisOpenInApp,
        allowVisShowInterpretations,
        allowVisViewAs,
        allowVisFullscreen,
    } = useSystemSettings().settings

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

    const onActiveTypeChanged = type => {
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
        type !== VIS_TYPE_GAUGE &&
        type !== VIS_TYPE_PIE

    const interpretationMenuLabel = props.activeFooter
        ? i18n.t(`Hide interpretations and details`)
        : i18n.t(`Show interpretations and details`)

    const buttonRef = createRef()

    return props.isFullscreen ? (
        <Button small secondary onClick={props.onToggleFullscreen}>
            <ExitFullscreen />
        </Button>
    ) : (
        <>
            <div ref={buttonRef}>
                <Button
                    small
                    secondary
                    onClick={openMenu}
                    dataTest="dashboarditem-menu-button"
                >
                    <ThreeDots />
                </Button>
            </div>
            {menuIsOpen && (
                <Popover
                    reference={buttonRef}
                    placement="auto-start"
                    arrow={false}
                    onClickOutside={closeMenu}
                >
                    <Menu>
                        {canViewAs && !loadItemFailed && (
                            <>
                                <ViewAsMenuItems
                                    type={item.type}
                                    activeType={activeType}
                                    onActiveTypeChanged={onActiveTypeChanged}
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
                                dense
                                icon={
                                    <LaunchIcon style={{ fill: '#6e7a8a' }} />
                                }
                                label={i18n.t('Open in {{appName}} app', {
                                    appName: getAppName(item.type),
                                })}
                                href={getLink(item, baseUrl)}
                                target="_blank"
                            />
                        )}
                        {allowVisShowInterpretations && !loadItemFailed && (
                            <MenuItem
                                dense
                                icon={<SpeechBubble />}
                                label={interpretationMenuLabel}
                                onClick={toggleInterpretations}
                            />
                        )}
                        {fullscreenAllowed && !loadItemFailed && (
                            <MenuItem
                                dense
                                icon={<Fullscreen />}
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
    isFullscreen: PropTypes.bool,
    item: PropTypes.object,
    loadItemFailed: PropTypes.bool,
    visualization: PropTypes.object,
    onSelectActiveType: PropTypes.func,
    onToggleFooter: PropTypes.func,
    onToggleFullscreen: PropTypes.func,
}

export default ItemContextMenu
