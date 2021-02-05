import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'

import EditBar from '../ControlBar/EditBar'
import EditTitleBar from '../TitleBar/EditTitleBar'
import EditItemGrid from '../ItemGrid/EditItemGrid'
import LayoutPrintPreview from './PrintLayoutDashboard'
import NotSupportedNotice from './NotSupportedNotice'

import { acSetEditNewDashboard } from '../../actions/editDashboard'
import { sGetIsPrintPreviewView } from '../../reducers/editDashboard'

import {
    getControlBarHeight,
    HEADERBAR_HEIGHT,
} from '../ControlBar/controlBarDimensions'

import { useWindowDimensions } from '../WindowDimensionsProvider'
import { isSmallScreen } from '../../modules/smallScreen'

const NewDashboard = props => {
    const { width, height } = useWindowDimensions()

    useEffect(() => {
        props.setNewDashboard()
    }, [])

    const dashboardHeight = height - HEADERBAR_HEIGHT - getControlBarHeight(1)

    const renderNewView = () => (
        <>
            <EditBar />
            {props.isPrintPreviewView ? (
                <LayoutPrintPreview fromEdit={true} />
            ) : (
                <div
                    className="dashboard-wrapper"
                    style={{ height: dashboardHeight }}
                >
                    <EditTitleBar />
                    <EditItemGrid />
                </div>
            )}
        </>
    )

    return (
        <>
            {isSmallScreen(width) ? (
                <NotSupportedNotice
                    message={i18n.t(
                        'Creating dashboards on small screens is not supported.'
                    )}
                />
            ) : (
                renderNewView()
            )}
        </>
    )
}

NewDashboard.propTypes = {
    isPrintPreviewView: PropTypes.bool,
    setNewDashboard: PropTypes.func,
}

const mapStateToProps = state => ({
    isPrintPreviewView: sGetIsPrintPreviewView(state),
})

export default connect(mapStateToProps, {
    setNewDashboard: acSetEditNewDashboard,
})(NewDashboard)
