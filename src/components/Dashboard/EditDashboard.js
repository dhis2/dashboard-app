import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import { NoticeBox, CenteredContent } from '@dhis2/ui'

import TitleBar from '../TitleBar/TitleBar'
import ItemGrid from '../ItemGrid/ItemGrid'
import EditBar from '../ControlBar/EditBar'
import { useWindowDimensions } from '../WindowDimensionsProvider'
import LayoutPrintPreview from './PrintLayoutDashboard'
import NoContentMessage from '../../widgets/NoContentMessage'
import { acSetEditDashboard } from '../../actions/editDashboard'
import { sGetWindowHeight } from '../../reducers/windowHeight'
import { sGetSelectedId } from '../../reducers/selected'
import {
    sGetDashboardById,
    sGetDashboardItems,
} from '../../reducers/dashboards'
import { sGetIsPrintPreviewView } from '../../reducers/editDashboard'
import {
    getControlBarHeight,
    HEADERBAR_HEIGHT,
} from '../ControlBar/controlBarDimensions'

import isSmallScreen from '../../modules/isSmallScreen'

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

        const height =
            props.windowHeight - HEADERBAR_HEIGHT - getControlBarHeight(1)

        return (
            <div className="dashboard-wrapper" style={{ height }}>
                <TitleBar edit={true} />
                <ItemGrid edit={true} />
            </div>
        )
    }

    const renderEditView = () => (
        <>
            <EditBar />
            {props.updateAccess ? (
                renderGrid()
            ) : (
                <NoContentMessage text={i18n.t('No access')} />
            )}
        </>
    )

    return (
        <>
            {isSmallScreen(width) ? (
                <CenteredContent position="top">
                    <NoticeBox title={i18n.t('Not supported')} warning>
                        {i18n.t(
                            'Editing dashboards on small screens is not supported.'
                        )}
                    </NoticeBox>
                </CenteredContent>
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
    windowHeight: PropTypes.number,
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
        windowHeight: sGetWindowHeight(state),
    }
}

export default connect(mapStateToProps, {
    setEditDashboard: acSetEditDashboard,
})(EditDashboard)
