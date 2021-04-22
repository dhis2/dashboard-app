import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { MenuItem, Tooltip } from '@dhis2/ui'
import { useOnlineStatus } from '../../../../modules/useOnlineStatus'

const MenuItemWithTooltip = ({ disabledWhenOffline, tooltip, ...rest }) => {
    const { isOnline } = useOnlineStatus()
    console.log('rest', rest)
    console.log('isOnline', isOnline)
    console.log('disabledWhenOffline', disabledWhenOffline)

    if (disabledWhenOffline && !isOnline) {
        return (
            <Tooltip content={i18n.t('Not available offline')} closeDelay={100}>
                <MenuItem dense disabled {...rest} />
            </Tooltip>
        )
    }

    if (tooltip) {
        return (
            <Tooltip content={tooltip} closeDelay={100}>
                <MenuItem dense disabled {...rest} />
            </Tooltip>
        )
    }

    return <MenuItem dense {...rest} />
}

MenuItemWithTooltip.propTypes = {
    disabledWhenOffline: PropTypes.bool,
    tooltip: PropTypes.string,
}

MenuItemWithTooltip.defaultProps = {
    disabledWhenOffline: true,
    tooltip: '',
}

export default MenuItemWithTooltip
