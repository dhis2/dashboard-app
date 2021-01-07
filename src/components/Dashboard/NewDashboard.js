import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import EditBar from '../ControlBar/EditBar'
import TitleBar from '../TitleBar/TitleBar'
import EditItemGrid from '../ItemGrid/EditItemGrid'
import LayoutPrintPreview from './PrintLayoutDashboard'

import { acSetEditNewDashboard } from '../../actions/editDashboard'
import { sGetIsPrintPreviewView } from '../../reducers/editDashboard'
import { sGetWindowHeight } from '../../reducers/windowHeight'

import {
    getControlBarHeight,
    HEADERBAR_HEIGHT,
} from '../ControlBar/controlBarDimensions'

class NewDashboard extends Component {
    componentDidMount() {
        this.props.setNewDashboard()
    }

    render() {
        const height =
            this.props.windowHeight - HEADERBAR_HEIGHT - getControlBarHeight(1)

        return (
            <>
                <EditBar />
                {this.props.isPrintPreviewView ? (
                    <LayoutPrintPreview fromEdit={true} />
                ) : (
                    <div className="dashboard-wrapper" style={{ height }}>
                        <TitleBar edit={true} />
                        <EditItemGrid />
                    </div>
                )}
            </>
        )
    }
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
