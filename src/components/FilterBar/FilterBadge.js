import React, { Component } from 'react'
import PropTypes from 'prop-types'

import i18n from '@dhis2/d2-i18n'

import { colors } from '@dhis2/ui'

const styles = {
    badgeContainer: {
        margin: '2px',
        padding: '0 16px',
        borderRadius: '4px',
        color: colors.white,
        backgroundColor: '#212934',
        height: 36,
        display: 'flex',
        alignItems: 'center',
    },
    badge: {
        fontSize: '13px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
    },
    badgeRemove: {
        fontSize: '12px',
        textDecoration: 'underline',
        marginLeft: '24px',
        cursor: 'pointer',
    },
}

class FilterBadge extends Component {
    onClick = id => () => this.props.onClick(id)
    onRemove = id => () => this.props.onRemove(id)

    render() {
        const { data } = this.props

        return (
            <div style={styles.badgeContainer} data-test="filter-badge">
                <span style={styles.badge} onClick={this.onClick(data.id)}>
                    {`${data.name}: ${
                        data.values.length > 1
                            ? i18n.t('{{count}} selected', {
                                  count: data.values.length,
                              })
                            : data.values[0].name
                    }`}
                </span>
                <span
                    style={styles.badgeRemove}
                    onClick={this.onRemove(data.id)}
                >
                    {i18n.t('Remove')}
                </span>
            </div>
        )
    }
}

FilterBadge.propTypes = {
    data: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
}

FilterBadge.defaultProps = {
    onClick: Function.prototype,
    onRemove: Function.prototype,
}

export default FilterBadge
