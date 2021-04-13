import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { sGetIsRecording } from '../reducers/isRecording'

const CacheableSection = ({ children, isRecording }) => (
    <>{children({ isRecording })}</>
)

CacheableSection.propTypes = {
    children: PropTypes.function,
    isRecording: PropTypes.bool,
}

const mapStateToProps = state => ({
    isRecording: sGetIsRecording(state),
})

export default connect(mapStateToProps)(CacheableSection)
