import React from 'react'
import { connect } from 'react-redux'
import { AlertBar, AlertStack } from '@dhis2/ui'
import PropTypes from 'prop-types'

import { sGetAlertMessage } from '../../reducers/alert'
import { acClearAlertMessage } from '../../actions/alert'

export const Alert = ({ message, onClose }) =>
    message ? (
        <AlertStack>
            <AlertBar onHidden={onClose} permanent>
                {message}
            </AlertBar>
        </AlertStack>
    ) : null

Alert.propTypes = {
    message: PropTypes.string,
    onClose: PropTypes.func,
}

const mapStateToProps = state => ({
    message: sGetAlertMessage(state),
})

export default connect(mapStateToProps, {
    onClose: acClearAlertMessage,
})(Alert)
