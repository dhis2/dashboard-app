import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { colors, IconQuestion24 } from '@dhis2/ui'
import ItemHeader from '../ItemHeader/ItemHeader'

const NotSupportedItem = props => (
    <>
        <ItemHeader
            title={i18n.t('Item type "{{type}}" not supported', {
                type: props.item.type,
            })}
            itemId={props.item.id}
            dashboardMode={props.dashboardMode}
            isShortened={props.item.shortened}
        />
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '90%',
            }}
        >
            <IconQuestion24 color={colors.grey500} />
        </div>
    </>
)

NotSupportedItem.propTypes = {
    dashboardMode: PropTypes.string,
    item: PropTypes.object,
}

export default NotSupportedItem
