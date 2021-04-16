import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import cx from 'classnames'
import { Redirect } from 'react-router-dom'
import { useDataEngine } from '@dhis2/app-runtime'

import DashboardContainer from '../../components/DashboardContainer'
import { apiFetchDashboard } from '../../api/fetchDashboard'
import TitleBar from './TitleBar'
import ItemGrid from './ItemGrid'
import ActionsBar from './ActionsBar'
import NotSupportedNotice from './NotSupportedNotice'
import LayoutPrintPreview from '../print/PrintLayoutDashboard'
import NoContentMessage from '../../components/NoContentMessage'
import { acSetEditDashboard } from '../../actions/editDashboard'
import { EDIT } from '../../modules/dashboardModes'

import { withShape } from '../../modules/gridUtil'
import { getCustomDashboards } from '../../modules/getCustomDashboards'
import { sGetIsPrintPreviewView } from '../../reducers/editDashboard'
import { setHeaderbarVisible } from '../../modules/setHeaderbarVisible'

import { useWindowDimensions } from '../../components/WindowDimensionsProvider'
import { isSmallScreen } from '../../modules/smallScreen'

import classes from './styles/EditDashboard.module.css'

const EditDashboard = props => {
    const dataEngine = useDataEngine()
    const { width } = useWindowDimensions()
    const [redirectUrl, setRedirectUrl] = useState(null)
    const [isInvalid, setIsInvalid] = useState(false)
    const [hasUpdateAccess, setHasUpdateAccess] = useState(null)

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const dboard = await apiFetchDashboard(
                    dataEngine,
                    props.id,
                    EDIT
                )
                const dashboard = getCustomDashboards(dboard)[0]
                props.setEditDashboard(
                    Object.assign({}, dashboard, {
                        dashboardItems: withShape(dashboard.dashboardItems),
                    })
                )
                setHasUpdateAccess(dboard.access?.update || false)
            } catch (error) {
                setIsInvalid(true)
            }
        }

        if (isSmallScreen(width)) {
            const redirectUrl = props.id ? `/${props.id}` : '/'
            setRedirectUrl(redirectUrl)
            return
        }
        setHeaderbarVisible(true)

        if (props.id) {
            loadDashboard()
        }
    }, [props.id])

    if (redirectUrl) {
        return <Redirect to={redirectUrl} />
    }

    if (isInvalid) {
        return (
            <>
                <NoContentMessage
                    text={i18n.t('Requested dashboard not found')}
                />
            </>
        )
    }

    const renderGrid = () => {
        if (props.isPrintPreviewView) {
            return <LayoutPrintPreview fromEdit={true} />
        }
        return (
            <DashboardContainer>
                <TitleBar />
                <ItemGrid />
            </DashboardContainer>
        )
    }

    return (
        <>
            <div
                className={cx(classes.container, 'dashboard-scroll-container')}
                data-test="outer-scroll-container"
            >
                <ActionsBar />
                {hasUpdateAccess ? (
                    renderGrid()
                ) : (
                    <NoContentMessage text={i18n.t('No access')} />
                )}
            </div>
            <div className={classes.notice}>
                <NotSupportedNotice
                    message={i18n.t(
                        'Editing dashboards on small screens is not supported. Resize your screen to return to edit mode.'
                    )}
                />
            </div>
        </>
    )
}

EditDashboard.propTypes = {
    id: PropTypes.string,
    isPrintPreviewView: PropTypes.bool,
    setEditDashboard: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => ({
    id: ownProps.match?.params?.dashboardId || null,
    isPrintPreviewView: sGetIsPrintPreviewView(state),
})

export default connect(mapStateToProps, {
    setEditDashboard: acSetEditDashboard,
})(EditDashboard)
