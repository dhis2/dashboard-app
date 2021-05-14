import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import {
    // Layer,
    // CenteredContent,
    // CircularLoader,
    ComponentCover,
    AlertStack,
    AlertBar,
} from '@dhis2/ui'
import cx from 'classnames'
import { useOnlineStatus } from '../../modules/useOnlineStatus'
import { useCacheableSectionStatus } from '../../modules/useCacheableSectionStatus'

import { TitleBar } from './TitleBar'
import ItemGrid from './ItemGrid'
import FilterBar from './FilterBar/FilterBar'
import DashboardsBar from './DashboardsBar/DashboardsBar'

import DashboardContainer from '../../components/DashboardContainer'
import Notice from '../../components/Notice'

import { sGetPassiveViewRegistered } from '../../reducers/passiveViewRegistered'
import { sGetDashboardById } from '../../reducers/dashboards'
import {
    sGetSelectedId,
    sGetIsNullDashboardItems,
} from '../../reducers/selected'
import { acClearEditDashboard } from '../../actions/editDashboard'
import { acClearPrintDashboard } from '../../actions/printDashboard'
import { acSetIsRecording } from '../../actions/isRecording'
import {
    tSetSelectedDashboardById,
    tSetSelectedDashboardByIdOffline,
} from '../../actions/selected'
import { acSetPassiveViewRegistered } from '../../actions/passiveViewRegistered'

import { apiPostDataStatistics } from '../../api/dataStatistics'
import { setHeaderbarVisible } from '../../modules/setHeaderbarVisible'

import classes from './styles/ViewDashboard.module.css'

const ViewDashboard = props => {
    const [controlbarExpanded, setControlbarExpanded] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState(null)
    const [selectedIsLoaded, setSelectedIsLoaded] = useState(false)
    const { isOnline } = useOnlineStatus()
    const { lastUpdated } = useCacheableSectionStatus(props.id)

    useEffect(() => {
        setHeaderbarVisible(true)
        props.clearEditDashboard()
        props.clearPrintDashboard()
    }, [])

    useEffect(() => {
        Array.from(
            document.getElementsByClassName('dashboard-scroll-container')
        ).forEach(container => {
            container.scroll(0, 0)
        })
    }, [props.id])

    useEffect(() => {
        if (props.isRecording) {
            props.setIsRecording(false)
        }
    }, [props.isRecording])

    useEffect(() => {
        if (isOnline && !props.passiveViewRegistered) {
            apiPostDataStatistics('PASSIVE_DASHBOARD_VIEW', props.id).then(
                () => {
                    props.registerPassiveView()
                }
            )
        }
    }, [props.passiveViewRegistered])

    useEffect(() => {
        const loadDashboard = async () => {
            const alertTimeout = setTimeout(() => {
                if (props.name) {
                    setLoadingMessage(
                        i18n.t('Loading dashboard – {{name}}', {
                            name: props.name,
                        })
                    )
                } else {
                    setLoadingMessage(i18n.t('Loading dashboard'))
                }
            }, 500)

            await props.fetchDashboard(props.id, props.username)

            setSelectedIsLoaded(true)
            clearTimeout(alertTimeout)
            setLoadingMessage(null)
        }

        if (
            (isOnline && props.isRecording) ||
            (isOnline && !props.dashboardLoaded) ||
            (isOnline && props.nullDashboardItems) ||
            (!isOnline && lastUpdated && !props.dashboardLoaded)
        ) {
            // console.log(
            //     isOnline,
            //     !!lastUpdated,
            //     props.dashboardLoaded,
            //     'Load. you are online and recording, or you are online and just switched to a new dashboard, or you are offline and switched to a offline dashboard'
            // )
            loadDashboard()
        } else if (!isOnline && !lastUpdated && !props.dashboardLoaded) {
            //we are offline, switched to a new dashboard that is not an offline dashboard
            // console.log(
            //     isOnline,
            //     !!lastUpdated,
            //     props.dashboardLoaded,
            //     'While offline, you switched to a non-offline dashboard'
            // )
            setSelectedIsLoaded(false)
            props.setSelectedAsOffline(props.id, props.username)
        }
    }, [props.id, props.isRecording, isOnline, props.dashboardLoaded])

    const onExpandedChanged = expanded => setControlbarExpanded(expanded)

    return (
        <>
            <div
                className={cx(classes.container, 'dashboard-scroll-container')}
                data-test="outer-scroll-container"
            >
                <DashboardsBar
                    expanded={controlbarExpanded}
                    onExpandedChanged={onExpandedChanged}
                />
                {!isOnline && !props.dashboardLoaded && !lastUpdated ? (
                    <Notice
                        title={i18n.t('Offline')}
                        message={i18n.t(
                            'This dashboard cannot be loaded while offline. AAA'
                        )}
                    />
                ) : (
                    <DashboardContainer covered={controlbarExpanded}>
                        {controlbarExpanded && (
                            <ComponentCover
                                className={classes.cover}
                                translucent
                                onClick={() => setControlbarExpanded(false)}
                            />
                        )}
                        {selectedIsLoaded ? (
                            <>
                                <TitleBar />
                                <FilterBar />
                                <ItemGrid isRecording={props.isRecording} />
                            </>
                        ) : (
                            <Notice
                                title={i18n.t('Offline')}
                                message={i18n.t(
                                    'This dashboard cannot be loaded while offline.'
                                )}
                            />
                        )}
                    </DashboardContainer>
                )}
            </div>
            <AlertStack>
                {loadingMessage && (
                    <AlertBar
                        onHidden={() => setLoadingMessage(null)}
                        permanent
                    >
                        {loadingMessage}
                    </AlertBar>
                )}
            </AlertStack>
        </>
    )
}

ViewDashboard.propTypes = {
    clearEditDashboard: PropTypes.func,
    clearPrintDashboard: PropTypes.func,
    dashboardLoaded: PropTypes.bool,
    fetchDashboard: PropTypes.func,
    id: PropTypes.string,
    isRecording: PropTypes.bool,
    name: PropTypes.string,
    nullDashboardItems: PropTypes.bool,
    passiveViewRegistered: PropTypes.bool,
    registerPassiveView: PropTypes.func,
    setIsRecording: PropTypes.func,
    setSelectedAsOffline: PropTypes.func,
    username: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => {
    const dashboard = sGetDashboardById(state, ownProps.id) || {}

    return {
        passiveViewRegistered: sGetPassiveViewRegistered(state),
        name: dashboard.displayName || null,
        dashboardLoaded: sGetSelectedId(state) === ownProps.id,
        nullDashboardItems: sGetIsNullDashboardItems(state),
    }
}

export default connect(mapStateToProps, {
    clearEditDashboard: acClearEditDashboard,
    clearPrintDashboard: acClearPrintDashboard,
    registerPassiveView: acSetPassiveViewRegistered,
    fetchDashboard: tSetSelectedDashboardById,
    setSelectedAsOffline: tSetSelectedDashboardByIdOffline,
    setIsRecording: acSetIsRecording,
})(ViewDashboard)
