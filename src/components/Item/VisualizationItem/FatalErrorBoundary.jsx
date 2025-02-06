import PropTypes from 'prop-types'
import React from 'react'
import { Warning } from './assets/icons.jsx'
import classes from './styles/FatalErrorBoundary.module.css'

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
                <p className={classes.container}>
                    <span className={classes.icon}>
                        <Warning />
                    </span>
                    <span className={classes.message}>
                        {this.props.message}
                    </span>
                </p>
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
