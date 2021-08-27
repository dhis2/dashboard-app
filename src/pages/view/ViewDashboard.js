import { useOnlineStatus, useCacheableSection } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { AlertStack, AlertBar } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { acClearEditDashboard } from '../../actions/editDashboard'
import { acSetPassiveViewRegistered } from '../../actions/passiveViewRegistered'
import { acClearPrintDashboard } from '../../actions/printDashboard'
import {
    tSetSelectedDashboardById,
    tSetSelectedDashboardByIdOffline,
} from '../../actions/selected'
import { apiPostDataStatistics } from '../../api/dataStatistics'
import DashboardContainer from '../../components/DashboardContainer'
import LoadingMask from '../../components/LoadingMask'
import Notice from '../../components/Notice'
import { setHeaderbarVisible } from '../../modules/setHeaderbarVisible'
import { sGetDashboardById } from '../../reducers/dashboards'
import { sGetPassiveViewRegistered } from '../../reducers/passiveViewRegistered'
import { sGetSelectedId } from '../../reducers/selected'
import DashboardsBar from './DashboardsBar/DashboardsBar'
import FilterBar from './FilterBar/FilterBar'
import ItemGrid from './ItemGrid'
import classes from './styles/ViewDashboard.module.css'
import { TitleBar } from './TitleBar'

const ViewDashboard = props => {
    const [controlbarExpanded, setControlbarExpanded] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const [loadFailed, setLoadFailed] = useState(false)
    const { online } = useOnlineStatus()
    const { isCached, recordingState } = useCacheableSection(props.requestedId)

    useEffect(() => {
        setHeaderbarVisible(true)
        props.clearEditDashboard()
        props.clearPrintDashboard()
    }, [])

    useEffect(() => {
        setLoaded(false)

        Array.from(
            document.getElementsByClassName('dashboard-scroll-container')
        ).forEach(container => {
            container.scroll(0, 0)
        })
    }, [props.requestedId])

    useEffect(() => {
        if (!props.passiveViewRegistered && online) {
            apiPostDataStatistics('PASSIVE_DASHBOARD_VIEW', props.requestedId)
                .then(() => {
                    props.registerPassiveView()
                })
                .catch(error => console.info(error))
        }
    }, [props.passiveViewRegistered])

    useEffect(() => {
        const loadDashboard = async () => {
            const alertTimeout = setTimeout(() => {
                if (props.requestedDashboardName) {
                    setLoadingMessage(
                        i18n.t('Loading dashboard – {{name}}', {
                            name: props.requestedDashboardName,
                        })
                    )
                } else {
                    setLoadingMessage(i18n.t('Loading dashboard'))
                }
            }, 500)

            try {
                setLoaded(true)
                await props.fetchDashboard(props.requestedId, props.username)

                setLoadFailed(false)
                setLoadingMessage(null)
                clearTimeout(alertTimeout)
            } catch (e) {
                setLoaded(false)
                setLoadFailed(true)
                setLoadingMessage(null)
                clearTimeout(alertTimeout)
                props.setSelectedAsOffline(props.requestedId, props.username)
            }
        }

        const requestedIsAvailable = online || isCached
        const switchingDashboard = props.requestedId !== props.currentId
        if (
            requestedIsAvailable &&
            (recordingState === 'recording' || !loaded)
        ) {
            loadDashboard()
        } else if (!requestedIsAvailable && switchingDashboard) {
            setLoaded(false)
            props.setSelectedAsOffline(props.requestedId, props.username)
        }
    }, [props.requestedId, props.currentId, loaded, recordingState, online])

    const onExpandedChanged = expanded => setControlbarExpanded(expanded)

    const getContent = () => {
        if (
            !online &&
            !isCached &&
            (props.requestedId !== props.currentId || !loaded)
        ) {
            return (
                <Notice
                    title={i18n.t('Offline')}
                    message={i18n.t(
                        'This dashboard cannot be loaded while offline.'
                    )}
                />
            )
        }

        if (loadFailed) {
            return (
                <Notice
                    title={i18n.t('Load dashboard failed')}
                    message={i18n.t(
                        'This dashboard could not be loaded. Please try again later.'
                    )}
                />
            )
        }

        return props.requestedId !== props.currentId ? (
            <LoadingMask />
        ) : (
            <>
                <TitleBar />
                <FilterBar />
                <ItemGrid />
            </>
        )
    }

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
                        <div
                            className={classes.cover}
                            onClick={() => setControlbarExpanded(false)}
                        />
                    )}
                    {getContent()}
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
    currentId: PropTypes.string,
    fetchDashboard: PropTypes.func,
    passiveViewRegistered: PropTypes.bool,
    registerPassiveView: PropTypes.func,
    requestedDashboardName: PropTypes.string,
    requestedId: PropTypes.string,
    setSelectedAsOffline: PropTypes.func,
    username: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => {
    const dashboard = sGetDashboardById(state, ownProps.requestedId) || {}

    return {
        passiveViewRegistered: sGetPassiveViewRegistered(state),
        requestedDashboardName: dashboard.displayName || null,
        currentId: sGetSelectedId(state),
    }
}

export default connect(mapStateToProps, {
    clearEditDashboard: acClearEditDashboard,
    clearPrintDashboard: acClearPrintDashboard,
    registerPassiveView: acSetPassiveViewRegistered,
    fetchDashboard: tSetSelectedDashboardById,
    setSelectedAsOffline: tSetSelectedDashboardByIdOffline,
})(ViewDashboard)
