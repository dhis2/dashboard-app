import i18n from '@dhis2/d2-i18n'
import { colors, IconQuestion24 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import ItemHeader from '../ItemHeader/ItemHeader.jsx'

const NotSupportedItem = ({ item, dashboardMode }) => {
    const message = item.type
        ? i18n.t('Item type "{{type}}" is not supported', {
              type: item.type,
          })
        : i18n.t('The item type is missing')

    return (
        <>
            <ItemHeader
                itemId={item.id}
                dashboardMode={dashboardMode}
                isShortened={item.shortened}
            />
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '90%',
                }}
            >
                <p>{message}</p>
                <IconQuestion24 color={colors.grey500} />
            </div>
        </>
    )
}

NotSupportedItem.propTypes = {
    dashboardMode: PropTypes.string,
    item: PropTypes.object,
}

export default NotSupportedItem
