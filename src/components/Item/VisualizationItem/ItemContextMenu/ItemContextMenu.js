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

import {
    ThreeDots,
    SpeechBubble,
    Fullscreen,
    ExitFullscreen,
} from '../assets/icons'
import { getLink } from '../Visualization/plugin'
import { getAppName } from '../../../../modules/itemTypes'
import { useSystemSettings } from '../../../SystemSettingsProvider'

import classes from './styles/ItemContextMenu.module.css'

const ItemContextMenu = props => {
    const [menuIsOpen, setMenuIsOpen] = useState(props.isOpen)

    const { baseUrl } = useConfig()

    const { item, visualization, onSelectActiveType, activeType } = props

    const {
        openInRelevantApp,
        showInterpretationsAndDetails,
        switchViewType,
        fullscreenAllowedInSettings,
    } = useSystemSettings().settings

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
        onSelectActiveType(type)
    }

    const openMenu = () => setMenuIsOpen(true)
    const closeMenu = () => setMenuIsOpen(false)

    const type = visualization.type || item.type
    const canViewAs =
        switchViewType &&
        !isSingleValue(type) &&
        !isYearOverYear(type) &&
        type !== VIS_TYPE_GAUGE &&
        type !== VIS_TYPE_PIE

    const interpretationMenuLabel = props.activeFooter
        ? i18n.t(`Hide interpretations and details`)
        : i18n.t(`Show interpretations and details`)

    const buttonRef = createRef()

    const fullscreenAllowed =
        props.fullscreenSupported && fullscreenAllowedInSettings

    if (
        !openInRelevantApp &&
        !showInterpretationsAndDetails &&
        !switchViewType &&
        !fullscreenAllowed
    ) {
        return null
    }
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
                        {canViewAs && (
                            <>
                                <ViewAsMenuItems
                                    type={item.type}
                                    activeType={activeType}
                                    onActiveTypeChanged={onActiveTypeChanged}
                                />
                                {(showInterpretationsAndDetails ||
                                    openInRelevantApp ||
                                    fullscreenAllowed) && <Divider />}
                            </>
                        )}
                        {openInRelevantApp && (
                            <MenuItem
                                className={classes.openInAppMenuItem}
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
                        {false && (
                            <MenuItem
                                dense
                                icon={<SpeechBubble />}
                                label={interpretationMenuLabel}
                                onClick={toggleInterpretations}
                            />
                        )}
                        {false && (
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
    isOpen: PropTypes.bool,
    item: PropTypes.object,
    visualization: PropTypes.object,
    onSelectActiveType: PropTypes.func,
    onToggleFooter: PropTypes.func,
    onToggleFullscreen: PropTypes.func,
}

export default ItemContextMenu
