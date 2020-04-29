import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { Warning } from './assets/icons'

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
    }
    render() {
        if (this.state.errorFound) {
            return (
                <p className={classes.container}>
                    <span className={classes.icon}>
                        <Warning />
                    </span>
                    <span className={classes.message}>
                        {i18n.t(
                            'There was a problem loading this dashboard item'
                        )}
                    </span>
                </p>
            )
        }
        return this.props.children
    }
}

FatalErrorBoundary.propTypes = {
    children: PropTypes.node,
}

export default FatalErrorBoundary
