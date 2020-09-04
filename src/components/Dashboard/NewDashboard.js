import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import EditBar from '../ControlBar/EditBar'
import TitleBar from '../TitleBar/TitleBar'
import ItemGrid from '../ItemGrid/ItemGrid'
import LayoutPrintPreview from './PrintLayoutDashboard'

import { acSetEditNewDashboard } from '../../actions/editDashboard'
import { sGetIsPrintPreviewView } from '../../reducers/editDashboard'

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
            window.innerHeight - HEADERBAR_HEIGHT - getControlBarHeight(1)

        return (
            <>
                <EditBar />
                {this.props.isPrintPreviewView ? (
                    <LayoutPrintPreview fromEdit={true} />
                ) : (
                    <div className="dashboard-wrapper" style={{ height }}>
                        <TitleBar edit={true} />
                        <ItemGrid edit={true} />
                    </div>
                )}
            </>
        )
    }
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
