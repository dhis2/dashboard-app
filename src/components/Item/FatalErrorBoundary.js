import PropTypes from 'prop-types'
import React from 'react'
import { IconWarning24, colors } from '@dhis2/ui'
import { Warning } from './assets/icons.js'
import classes from './styles/FatalErrorBoundary.module.css'
import FatalErrorMessage from './ItemMessage/FatalErrorMessage.js'

class FatalErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            errorFound: false,
        }
    }

    componentDidCatch(error, info) {
        this.setState({
            errorFound: true,
        })
        console.log('error: ', error)
        console.log('info: ', info)
        this.props.onFatalError()
    }

    render() {
        if (this.state.errorFound) {
            return (
                <div className={classes.container}>
                    <FatalErrorMessage message={this.props.message} />
                </div>
            )
        }
        return this.props.children
    }
}

FatalErrorBoundary.propTypes = {
    children: PropTypes.node,
    message: PropTypes.string,
    onFatalError: PropTypes.func,
}

FatalErrorBoundary.defaultProps = {
    onFatalError: Function.prototype,
}

export default FatalErrorBoundary
