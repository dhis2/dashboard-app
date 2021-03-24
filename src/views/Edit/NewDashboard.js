import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'

import DashboardContainer from '../../components/DashboardContainer'
import ActionsBar from './ActionsBar'
import TitleBar from './TitleBar'
import ItemGrid from './ItemGrid'
import LayoutPrintPreview from '../print/PrintLayoutDashboard'
import NotSupportedNotice from './NotSupportedNotice'

import { acSetEditNewDashboard } from '../../actions/editDashboard'
import { sGetIsPrintPreviewView } from '../../reducers/editDashboard'

import classes from './styles/NewDashboard.module.css'

const NewDashboard = props => {
    useEffect(() => {
        props.setNewDashboard()
    }, [])

    return (
        <>
            <div
                className={cx(classes.container, 'dashboard-scroll-container')}
            >
                <ActionsBar />
                {props.isPrintPreviewView ? (
                    <LayoutPrintPreview fromEdit={true} />
                ) : (
                    <DashboardContainer>
                        <TitleBar />
                        <ItemGrid />
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
