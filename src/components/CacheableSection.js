import React from 'react'
import PropTypes from 'prop-types'

const CacheableSection = ({ children }) => {
    return <>{children}</>
}

CacheableSection.propTypes = {
    children: PropTypes.node,
}

export default CacheableSection
