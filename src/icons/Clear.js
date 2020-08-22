import React from 'react'
import { colors } from '@dhis2/ui'
import PropTypes from 'prop-types'

const ClearIcon = ({ className }) => (
    <svg
        className={className}
        fill={colors.grey800}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
    >
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        <path d="M0 0h24v24H0z" fill="none" />
    </svg>
)

ClearIcon.propTypes = {
    className: PropTypes.string,
}

export default ClearIcon
