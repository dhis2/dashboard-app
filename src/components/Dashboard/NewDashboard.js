import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import DashboardVerticalOffset from './DashboardVerticalOffset'
import EditBar from '../ControlBar/EditBar'
import TitleBar from '../TitleBar/TitleBar'
import ItemGrid from '../ItemGrid/ItemGrid'
import LayoutPrintPreview from './PrintLayoutDashboard'

import { acSetEditNewDashboard } from '../../actions/editDashboard'
import { sGetIsPrintPreviewView } from '../../reducers/editDashboard'

class NewDashboard extends Component {
    componentDidMount() {
        this.props.setNewDashboard()
    }

    render() {
        return (
            <>
                <EditBar />
                <DashboardVerticalOffset editMode={true} />
                {this.props.isPrintPreviewView ? (
                    <LayoutPrintPreview fromEdit={true} />
                ) : (
                    <div className="dashboard-wrapper">
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
