import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { NoticeBox, CenteredContent } from '@dhis2/ui'

import EditBar from '../ControlBar/EditBar'
import TitleBar from '../TitleBar/TitleBar'
import ItemGrid from '../ItemGrid/ItemGrid'
import LayoutPrintPreview from './PrintLayoutDashboard'

import { acSetEditNewDashboard } from '../../actions/editDashboard'
import { sGetIsPrintPreviewView } from '../../reducers/editDashboard'
import { sGetWindowHeight } from '../../reducers/windowHeight'

import {
    getControlBarHeight,
    HEADERBAR_HEIGHT,
} from '../ControlBar/controlBarDimensions'

import { useWindowDimensions } from '../WindowDimensionsProvider'
import isSmallScreen from '../../modules/isSmallScreen'

const NewDashboard = props => {
    const { width } = useWindowDimensions()

    useEffect(() => {
        props.setNewDashboard()
    }, [])

    const height =
        props.windowHeight - HEADERBAR_HEIGHT - getControlBarHeight(1)

    const renderNewView = () => (
        <>
            <EditBar />
            {props.isPrintPreviewView ? (
                <LayoutPrintPreview fromEdit={true} />
            ) : (
                <div className="dashboard-wrapper" style={{ height }}>
                    <TitleBar edit={true} />
                    <ItemGrid edit={true} />
                </div>
            )}
        </>
    )

    return (
        <>
            {isSmallScreen(width) ? (
                <CenteredContent position="top">
                    <NoticeBox title={i18n.t('Not supported')} warning>
                        {i18n.t(
                            'Creating dashboards on small screens is not supported.'
                        )}
                    </NoticeBox>
                </CenteredContent>
            ) : (
                renderNewView()
            )}
        </>
    )
}

NewDashboard.propTypes = {
    isPrintPreviewView: PropTypes.bool,
    setNewDashboard: PropTypes.func,
    windowHeight: PropTypes.number,
}

const mapStateToProps = state => ({
    isPrintPreviewView: sGetIsPrintPreviewView(state),
    windowHeight: sGetWindowHeight(state),
})

export default connect(mapStateToProps, {
    setNewDashboard: acSetEditNewDashboard,
})(NewDashboard)
