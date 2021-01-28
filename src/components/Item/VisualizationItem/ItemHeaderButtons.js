import React, { useState, createRef } from 'react'
import PropTypes from 'prop-types'
import { useConfig } from '@dhis2/app-runtime'
import {
    isSingleValue,
    isYearOverYear,
    VIS_TYPE_GAUGE,
    VIS_TYPE_PIE,
} from '@dhis2/analytics'
import { Button, Menu, Popover, MenuItem, Divider, colors } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import TableIcon from '@material-ui/icons/ViewList'
import ChartIcon from '@material-ui/icons/InsertChart'
import MapIcon from '@material-ui/icons/Public'
import LaunchIcon from '@material-ui/icons/Launch'

import {
    ThreeDots,
    SpeechBubble,
    Fullscreen,
    ExitFullscreen,
} from './assets/icons'
import { getLink } from './Visualization/plugin'
import {
    CHART,
    MAP,
    REPORT_TABLE,
    EVENT_CHART,
    EVENT_REPORT,
    isTrackerDomainType,
    hasMapView,
    getAppName,
} from '../../../modules/itemTypes'

const iconFill = { fill: colors.grey600 }

const ItemHeaderButtons = props => {
    const [menuIsOpen, setMenuIsOpen] = useState(null)

    const { baseUrl } = useConfig()

    const { item, visualization, onSelectActiveType, activeType } = props

    const isTrackerType = isTrackerDomainType(item.type)

    const onViewTable = () => {
        closeMenu()
        onSelectActiveType(isTrackerType ? EVENT_REPORT : REPORT_TABLE)
    }

    const onViewChart = () => {
        closeMenu()
        onSelectActiveType(isTrackerType ? EVENT_CHART : CHART)
    }

    const onViewMap = () => {
        closeMenu()
        onSelectActiveType(MAP)
    }

    const itemHasMapView = () => hasMapView(item.type)

    const handleInterpretationClick = () => {
        props.onToggleFooter()
        if (menuIsOpen) {
            closeMenu()
        }
    }

    const handleToggleFullscreenClick = () => {
        props.onToggleFullscreen()
        closeMenu()
    }

    const openMenu = () => setMenuIsOpen(true)
    const closeMenu = () => setMenuIsOpen(false)

    const type = visualization.type || item.type
    const canViewAs =
        !isSingleValue(type) &&
        !isYearOverYear(type) &&
        type !== VIS_TYPE_GAUGE &&
        type !== VIS_TYPE_PIE

    const interpretationMenuLabel = props.activeFooter
        ? i18n.t(`Hide interpretations and details`)
        : i18n.t(`Show interpretations and details`)

    const ViewAsMenuItems = () => (
        <>
            {activeType !== CHART && activeType !== EVENT_CHART && (
                <MenuItem
                    dense
                    label={i18n.t('View as Chart')}
                    onClick={onViewChart}
                    icon={<ChartIcon style={iconFill} />}
                />
            )}
            {activeType !== REPORT_TABLE && activeType !== EVENT_REPORT && (
                <MenuItem
                    dense
                    label={i18n.t('View as Table')}
                    onClick={onViewTable}
                    icon={<TableIcon style={iconFill} />}
                />
            )}
            {itemHasMapView() && activeType !== MAP && (
                <MenuItem
                    dense
                    label={i18n.t('View as Map')}
                    onClick={onViewMap}
                    icon={<MapIcon style={iconFill} />}
                />
            )}
        </>
    )

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
                        {canViewAs && (
                            <>
                                <ViewAsMenuItems />
                                <Divider />
                            </>
                        )}
                        <MenuItem
                            dense
                            icon={<LaunchIcon style={{ fill: '#6e7a8a' }} />}
                            label={i18n.t('Open in {{appName}} app', {
                                appName: getAppName(item.type),
                            })}
                            href={getLink(item, baseUrl)}
                            target="_blank"
                        />
                        <MenuItem
                            dense
                            icon={<SpeechBubble />}
                            label={interpretationMenuLabel}
                            onClick={handleInterpretationClick}
                        />
                        {props.fullscreenSupported && (
                            <MenuItem
                                dense
                                icon={<Fullscreen />}
                                label={i18n.t('View fullscreen')}
                                onClick={handleToggleFullscreenClick}
                            />
                        )}
                    </Menu>
                </Popover>
            )}
        </>
    )
}

ItemHeaderButtons.propTypes = {
    activeFooter: PropTypes.bool,
    activeType: PropTypes.string,
    fullscreenSupported: PropTypes.bool,
    isFullscreen: PropTypes.bool,
    item: PropTypes.object,
    visualization: PropTypes.object,
    onSelectActiveType: PropTypes.func,
    onToggleFooter: PropTypes.func,
    onToggleFullscreen: PropTypes.func,
}

export default ItemHeaderButtons
