import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import HeaderBarComponent from 'd2-ui/lib/app-header/HeaderBar'
import headerBarStore$ from 'd2-ui/lib/app-header/headerBar.store'
import withStateFrom from 'd2-ui/lib/component-helpers/withStateFrom'
import Snackbar from 'material-ui/Snackbar'

import PageContainer from './PageContainer/PageContainer'
import ControlBarContainer from './ControlBarContainer/ControlBarContainer'
import TitleBarCt from './TitleBar/TitleBar'
import ItemGridCt from './ItemGrid/ItemGrid'
import SnackbarMessage from './SnackbarMessage'

import { fromDashboards, fromUser } from './actions'
import { acCloseSnackbar } from './actions/snackbar'
import { fromSnackbar } from './reducers'

import './App.css'

const HeaderBar = withStateFrom(headerBarStore$, HeaderBarComponent)

// App
class App extends Component {
    componentDidMount() {
        const { store, d2 } = this.context
        store.dispatch(fromUser.acReceivedUser(d2.currentUser))
        store.dispatch(fromDashboards.tSetDashboards())
    }

    getChildContext() {
        return {
            baseUrl: this.props.baseUrl
        }
    }

    onCloseSnackbar = () => {
        this.props.acCloseSnackbar()
    }

    render() {
        return (
            <div className="app-wrapper">
                <HeaderBar />
                <ControlBarContainer />
                <PageContainer>
                    <TitleBarCt />
                    <ItemGridCt />
                </PageContainer>
                <Snackbar
                    open={this.props.snackbarOpen}
                    message={
                        <SnackbarMessage message={this.props.snackbarMessage} />
                    }
                    autoHideDuration={this.props.snackbarDuration}
                    onRequestClose={this.props.onCloseSnackbar}
                />
            </div>
        )
    }
}

const mapStateToProps = state => {
    const { message, duration, open } = fromSnackbar.sGetSnackbar(state)
    return {
        snackbarOpen: open,
        snackbarMessage: message,
        snackbarDuration: duration
    }
}

App.contextTypes = {
    d2: PropTypes.object,
    store: PropTypes.object
}

App.childContextTypes = {
    baseUrl: PropTypes.string
}

const AppCt = connect(
    mapStateToProps,
    {
        acCloseSnackbar
    }
)(App)

export default AppCt
