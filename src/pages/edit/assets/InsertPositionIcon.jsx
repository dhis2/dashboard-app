import PropTypes from 'prop-types'
import React from 'react'

// "Add to start" (arrow at the top of a list); flipped for "add to end".
// Uses currentColor so it follows the toggle's text colour.
export const InsertPositionIcon = ({ end = false }) => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={end ? { transform: 'scaleY(-1)' } : undefined}
    >
        <rect x="9" y="3" width="4" height="1" fill="currentColor" />
        <rect x="3" y="8" width="10" height="1" fill="currentColor" />
        <rect x="3" y="12" width="10" height="1" fill="currentColor" />
        <path d="M3 6V1L7 3.5L3 6Z" fill="currentColor" />
    </svg>
)

InsertPositionIcon.propTypes = {
    end: PropTypes.bool,
}
