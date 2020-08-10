import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'

import ItemHeader from '../ItemHeader/ItemHeader'
import { PRINT } from '../../Dashboard/dashboardModes'

const PageBreakItem = props => {
    return (
        <>
            <ItemHeader
                title={i18n.t('Page Break')}
                itemId={props.item.id}
                dashboardMode={PRINT}
            />
        </>
    )
}

PageBreakItem.propTypes = {
    item: PropTypes.object,
}

export default PageBreakItem
