import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { colors } from '@dhis2/ui'
import { getId } from './modules/plugin'
import InterpretationsComponent from '@dhis2/d2-ui-interpretations'

const style = {
    scrollContainer: {
        overflowY: 'auto',
        height: '340px',
    },
    line: {
        margin: '-1px 0px 0px',
        height: '1px',
        border: 'none',
        backgroundColor: colors.grey100,
    },
}

class ItemFooter extends Component {
    render() {
        const objectId = getId(this.props.item)

        return (
            <div className="dashboard-item-footer">
                <hr style={style.line} />
                <div style={style.scrollContainer}>
                    <InterpretationsComponent
                        d2={this.context.d2}
                        item={this.props.item}
                        type={this.props.item.type.toLowerCase()}
                        id={objectId}
                        appName="dashboard"
                    />
                </div>
            </div>
        )
    }
}

ItemFooter.contextTypes = {
    d2: PropTypes.object.isRequired,
}

ItemFooter.propTypes = {
    item: PropTypes.object.isRequired,
}

export default ItemFooter
