import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import ItemHeader from '../ItemHeader/ItemHeader'
import NotInterestedIcon from '@material-ui/icons/NotInterested'

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
            <NotInterestedIcon
                style={{ width: 100, height: 100, align: 'center' }}
                color="disabled"
            />
        </div>
    </>
)

NotSupportedItem.propTypes = {
    dashboardMode: PropTypes.string,
    item: PropTypes.object,
}

export default NotSupportedItem
