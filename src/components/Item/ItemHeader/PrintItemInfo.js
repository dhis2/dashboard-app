import React from 'react'
import { Tooltip, colors, IconWarning24 } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'

import classes from './styles/PrintItemInfo.module.css'

const PrintWarning = () => (
    <div className={classes.warning}>
        <Tooltip
            content={i18n.t('This item has been shortened to fit on one page')}
            placement="bottom"
        >
            <IconWarning24 color={colors.grey600} />
        </Tooltip>
    </div>
)

export default PrintWarning
