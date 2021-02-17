import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'

import EditTitleBar from '../TitleBar/EditTitleBar'
import EditItemGrid from '../ItemGrid/EditItemGrid'
import EditBar from '../ControlBar/EditBar'
import NotSupportedNotice from './NotSupportedNotice'
import LayoutPrintPreview from './PrintLayoutDashboard'
import NoContentMessage from '../../widgets/NoContentMessage'
import { acSetEditDashboard } from '../../actions/editDashboard'
import { sGetSelectedId } from '../../reducers/selected'
import {
    sGetDashboardById,
    sGetDashboardItems,
} from '../../reducers/dashboards'
import { sGetIsPrintPreviewView } from '../../reducers/editDashboard'

import classes from './styles/EditDashboard.module.css'

const EditDashboard = props => {
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

    return (
        <>
            <div className={classes.container}>
                <EditBar />
                {props.updateAccess ? (
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
