import React, { Component } from 'react'
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined'
import { colors } from '@dhis2/ui-core'
import PropTypes from 'prop-types'

class Info extends Component {
    show = false

    toggle() {
        this.show = !this.show
        return this.show
    }

    render() {
        return (
            <div onClick={() => this.props.onClick(this.toggle())}>
                <InfoOutlineIcon style={{ fill: colors.grey600 }} />
            </div>
        )
    }
}

Info.propTypes = {
    onClick: PropTypes.func,
}

export default Info
