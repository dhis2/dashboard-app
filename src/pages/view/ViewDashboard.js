import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { ComponentCover, AlertStack, AlertBar } from '@dhis2/ui'
import cx from 'classnames'
import { useOnlineStatus } from '../../modules/useOnlineStatus'
import { useCacheableSectionStatus } from '../../modules/useCacheableSectionStatus'

import Notice from '../../components/Notice'
import { TitleBar } from './TitleBar'
import ItemGrid from './ItemGrid'
import FilterBar from './FilterBar/FilterBar'
import DashboardsBar from './DashboardsBar/DashboardsBar'
import DashboardContainer from '../../components/DashboardContainer'
import { sGetPassiveViewRegistered } from '../../reducers/passiveViewRegistered'
import { sGetDashboardById } from '../../reducers/dashboards'
import { acClearEditDashboard } from '../../actions/editDashboard'
import { acClearPrintDashboard } from '../../actions/printDashboard'
import { acSetIsRecording } from '../../actions/isRecording'
import { tSetSelectedDashboardById } from '../../actions/selected'
import { acSetPassiveViewRegistered } from '../../actions/passiveViewRegistered'
import { apiPostDataStatistics } from '../../api/dataStatistics'
import { setHeaderbarVisible } from '../../modules/setHeaderbarVisible'

import classes from './styles/ViewDashboard.module.css'

const ViewDashboard = props => {
    const [controlbarExpanded, setControlbarExpanded] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState(null)
    const { isOnline } = useOnlineStatus()
    const { lastUpdated } = useCacheableSectionStatus(props.id)
    // const [dashboardIsLoaded, setDashboardIsLoaded] = useState(false)

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
            // setDashboardIsLoaded(true)

            clearTimeout(alertTimeout)
            setLoadingMessage(null)
        }

        if (props.id || props.isRecording) {
            loadDashboard()
        }
    }, [props.id, props.isRecording])

    // useEffect(() => {
    //     setDashboardIsLoaded(false)
    // }, [props.id])

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
                <DashboardContainer covered={controlbarExpanded}>
                    {controlbarExpanded && (
                        <ComponentCover
                            className={classes.cover}
                            translucent
                            onClick={() => setControlbarExpanded(false)}
                        />
                    )}
                    {isOnline || lastUpdated ? (
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
    // dashboardIsLoaded: PropTypes.bool,
    fetchDashboard: PropTypes.func,
    id: PropTypes.string,
    isRecording: PropTypes.bool,
    name: PropTypes.string,
    passiveViewRegistered: PropTypes.bool,
    registerPassiveView: PropTypes.func,
    setIsRecording: PropTypes.func,
    username: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => {
    const dashboard = sGetDashboardById(state, ownProps.id) || {}
    return {
        passiveViewRegistered: sGetPassiveViewRegistered(state),
        name: dashboard.displayName || null,
        // dashboardIsLoaded: !!dashboard.dashboardItems, //sGetSelectedDashboardItems(state)
    }
}

export default connect(mapStateToProps, {
    clearEditDashboard: acClearEditDashboard,
    clearPrintDashboard: acClearPrintDashboard,
    registerPassiveView: acSetPassiveViewRegistered,
    fetchDashboard: tSetSelectedDashboardById,
    setIsRecording: acSetIsRecording,
})(ViewDashboard)
