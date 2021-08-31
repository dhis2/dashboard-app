import i18n from '@dhis2/d2-i18n'
import {
    Layer,
    CenteredContent,
    CircularLoader,
    AlertStack,
    AlertBar,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { acClearEditDashboard } from '../../actions/editDashboard'
import { acSetPassiveViewRegistered } from '../../actions/passiveViewRegistered'
import { acClearPrintDashboard } from '../../actions/printDashboard'
import { tSetSelectedDashboardById } from '../../actions/selected'
import { apiPostDataStatistics } from '../../api/dataStatistics'
import DashboardContainer from '../../components/DashboardContainer'
import { setHeaderbarVisible } from '../../modules/setHeaderbarVisible'
import { sGetDashboardById } from '../../reducers/dashboards'
import { sGetPassiveViewRegistered } from '../../reducers/passiveViewRegistered'
import { sGetSelectedId } from '../../reducers/selected'
import DashboardsBar from './DashboardsBar/DashboardsBar'
import FilterBar from './FilterBar/FilterBar'
import ItemGrid from './ItemGrid'
import classes from './styles/ViewDashboard.module.css'
import TitleBar from './TitleBar/TitleBar'

const ViewDashboard = props => {
    const [controlbarExpanded, setControlbarExpanded] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState(null)

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
        if (!props.passiveViewRegistered) {
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

            clearTimeout(alertTimeout)
            setLoadingMessage(null)
        }

        if (!props.dashboardLoaded) {
            loadDashboard()
        }
    }, [props.id, props.dashboardLoaded])

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
                {!props.dashboardLoaded ? (
                    <Layer translucent>
                        <CenteredContent>
                            <CircularLoader />
                        </CenteredContent>
                    </Layer>
                ) : (
                    <DashboardContainer covered={controlbarExpanded}>
                        {controlbarExpanded && (
                            <div
                                className={classes.cover}
                                onClick={() => setControlbarExpanded(false)}
                            />
                        )}
                        <>
                            <TitleBar />
                            <FilterBar />
                            <ItemGrid />
                        </>
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
    name: PropTypes.string,
    passiveViewRegistered: PropTypes.bool,
    registerPassiveView: PropTypes.func,
    username: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => {
    const dashboard = sGetDashboardById(state, ownProps.id) || {}

    return {
        passiveViewRegistered: sGetPassiveViewRegistered(state),
        name: dashboard.displayName || null,
        dashboardLoaded: sGetSelectedId(state) === ownProps.id,
    }
}

export default connect(mapStateToProps, {
    clearEditDashboard: acClearEditDashboard,
    clearPrintDashboard: acClearPrintDashboard,
    registerPassiveView: acSetPassiveViewRegistered,
    fetchDashboard: tSetSelectedDashboardById,
})(ViewDashboard)
