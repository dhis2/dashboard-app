import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'

import DashboardContainer from './DashboardContainer'
import EditBar from '../ControlBar/EditBar'
import EditTitleBar from '../TitleBar/EditTitleBar'
import EditItemGrid from '../ItemGrid/EditItemGrid'
import LayoutPrintPreview from './PrintLayoutDashboard'
import NotSupportedNotice from './NotSupportedNotice'

import { acSetEditNewDashboard } from '../../actions/editDashboard'
import { sGetIsPrintPreviewView } from '../../reducers/editDashboard'

import classes from './styles/NewDashboard.module.css'

const NewDashboard = props => {
    useEffect(() => {
        props.setNewDashboard()
    }, [])

    return (
        <div>
            <div className={classes.container}>
                <EditBar />
                {props.isPrintPreviewView ? (
                    <LayoutPrintPreview fromEdit={true} />
                ) : (
                    <DashboardContainer>
                        <EditTitleBar />
                        <EditItemGrid />
                    </DashboardContainer>
                )}
            </div>
            <div className={classes.notice}>
                <NotSupportedNotice
                    className={classes.notSupportedNotice}
                    message={i18n.t(
                        'Creating dashboards on small screens is not supported. Resize your screen to return to create mode.'
                    )}
                />
            </div>
        </div>
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
