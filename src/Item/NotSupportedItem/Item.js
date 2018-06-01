import React, { Fragment } from 'react'
import ItemHeader from '../ItemHeader'
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon'

const NotSupportedItem = props => (
    <Fragment>
        <ItemHeader title={`Item type not supported: ${props.item.type}`} />
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '90%'
            }}
        >
            <SvgIcon
                icon="NotInterested"
                style={{ width: 100, height: 100, align: 'center' }}
                disabled
            />
        </div>
    </Fragment>
)

export default NotSupportedItem
