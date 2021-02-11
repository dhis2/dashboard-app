import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'

import EditTitleBar from '../TitleBar/EditTitleBar'
import EditItemGrid from '../ItemGrid/EditItemGrid'
import EditBar from '../ControlBar/EditBar'
import NotSupportedNotice from './NotSupportedNotice'
import { useWindowDimensions } from '../WindowDimensionsProvider'
import LayoutPrintPreview from './PrintLayoutDashboard'
import NoContentMessage from '../../widgets/NoContentMessage'
import { acSetEditDashboard } from '../../actions/editDashboard'
import { sGetSelectedId } from '../../reducers/selected'
import {
    sGetDashboardById,
    sGetDashboardItems,
} from '../../reducers/dashboards'
import { sGetIsPrintPreviewView } from '../../reducers/editDashboard'

import { isSmallScreen } from '../../modules/smallScreen'

import classes from './styles/EditDashboard.module.css'

const EditDashboard = props => {
    const { width } = useWindowDimensions()

    useEffect(() => {
        if (props.dashboard) {
            props.setEditDashboard(props.dashboard, props.items)
        }
    }, [props.dashboard])

    const renderGrid = () => {
        if (props.isPrintPreviewView) {
            return <LayoutPrintPreview fromEdit={true} />
        }
        return (
            <div className="dashboard-wrapper">
                <EditTitleBar />
                <EditItemGrid />
            </div>
        )
    }

    const renderEditView = () => (
        <div className={classes.container}>
            <EditBar />
            {props.updateAccess ? (
                renderGrid()
            ) : (
                <NoContentMessage text={i18n.t('No access')} />
            )}
        </div>
    )

    return (
        <>
            {isSmallScreen(width) ? (
                <NotSupportedNotice
                    message={i18n.t(
                        'Editing dashboards on small screens is not supported. Resize your screen to return to edit mode.'
                    )}
                />
            ) : (
                renderEditView()
            )}
        </>
    )
}

EditDashboard.propTypes = {
    dashboard: PropTypes.object,
    isPrintPreviewView: PropTypes.bool,
    items: PropTypes.array,
    setEditDashboard: PropTypes.func,
    updateAccess: PropTypes.bool,
}

const mapStateToProps = state => {
    const id = sGetSelectedId(state)
    const dashboard = id ? sGetDashboardById(state, id) : null

    const updateAccess =
        dashboard && dashboard.access ? dashboard.access.update : false

    return {
        dashboard,
        updateAccess,
        items: sGetDashboardItems(state),
        isPrintPreviewView: sGetIsPrintPreviewView(state),
    }
}

export default connect(mapStateToProps, {
    setEditDashboard: acSetEditDashboard,
})(EditDashboard)
