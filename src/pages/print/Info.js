import { colors, IconInfo24 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { Component } from 'react'

class Info extends Component {
    show = false

    toggle() {
        this.show = !this.show
        return this.show
    }

    render() {
        return (
            <div onClick={() => this.props.onClick(this.toggle())}>
                <IconInfo24 color={colors.grey600} />
            </div>
        )
    }
}

Info.propTypes = {
    onClick: PropTypes.func,
}

export default Info
