import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import ItemHeader from '../ItemHeader/ItemHeader.jsx'

const style = {
    margin: '21px 28px',
    fontSize: '14px',
    lineHeight: '18px',
    color: colors.grey600,
}

const SpacerItem = (props) => {
    return (
        <>
            <ItemHeader
                title={i18n.t('Spacer')}
                itemId={props.item.id}
                dashboardMode={props.dashboardMode}
                isShortened={props.item.shortened}
            />
            <p style={style}>
                {i18n.t(
                    'Use a spacer to create empty vertical space between other dashboard items.'
                )}
            </p>
        </>
    )
}

SpacerItem.propTypes = {
    dashboardMode: PropTypes.string,
    item: PropTypes.object,
}

export default SpacerItem
