import React from 'react'
import { connect } from 'react-redux'
import { AlertBar, AlertStack } from '@dhis2/ui'
import PropTypes from 'prop-types'

import { sGetSnackbar } from '../../reducers/snackbar'
import { acCloseSnackbar } from '../../actions/snackbar'

export const SnackbarMessage = ({ open, message, onClose }) =>
    open ? (
        <AlertStack>
            <AlertBar onHidden={onClose} permanent>
                {message}
            </AlertBar>
        </AlertStack>
    ) : null

const mapStateToProps = state => {
    const { message, open } = sGetSnackbar(state)
    return {
        open,
        message,
    }
}

SnackbarMessage.propTypes = {
    message: PropTypes.object,
    open: PropTypes.bool,
    onClose: PropTypes.func,
}

export default connect(mapStateToProps, {
    onClose: acCloseSnackbar,
})(SnackbarMessage)
