import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import ItemHeader from '../ItemHeader/ItemHeader'
import NotInterestedIcon from '@material-ui/icons/NotInterested'

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
                isShortened={false}
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
                <NotInterestedIcon
                    style={{ width: 100, height: 100, align: 'center' }}
                    color="disabled"
                />
            </div>
        </>
    )
}

NotSupportedItem.propTypes = {
    dashboardMode: PropTypes.string,
    item: PropTypes.object,
}

export default NotSupportedItem
