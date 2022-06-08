import PropTypes from 'prop-types'
import React from 'react'

// import { Plugin } from '@dhis2/app-runtime'
const Plugin = ({ visualization }) => (
    <div>
        <div>Line Listing plugin</div>
        <div>{visualization.id}</div>
        <div>{visualization.name}</div>
    </div>
)

Plugin.propTypes = {
    visualization: PropTypes.object,
}

const LineListingPlugin = (props) => <Plugin {...props} />

export default LineListingPlugin
