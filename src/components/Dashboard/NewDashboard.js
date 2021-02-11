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

import { useWindowDimensions } from '../WindowDimensionsProvider'
import { isSmallScreen } from '../../modules/smallScreen'

import classes from './styles/NewDashboard.module.css'

const NewDashboard = props => {
    const { width } = useWindowDimensions()

    useEffect(() => {
        props.setNewDashboard()
    }, [])

    const renderNewView = () => (
        <div className={classes.container}>
            <EditBar />
            {props.isPrintPreviewView ? (
                <LayoutPrintPreview fromEdit={true} />
            ) : (
                <div className="dashboard-wrapper">
                    <EditTitleBar />
                    <EditItemGrid />
                </div>
            )}
        </div>
    )

    return (
        <>
            {isSmallScreen(width) ? (
                <NotSupportedNotice
                    message={i18n.t(
                        'Creating dashboards on small screens is not supported. Resize your screen to return to create mode.'
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
