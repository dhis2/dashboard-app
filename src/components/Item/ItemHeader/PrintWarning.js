import React from 'react'
import { Tooltip } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'

import WarningIcon from '../../../icons/Warning'

import classes from './styles/PrintWarning.module.css'

const PrintWarning = () => (
    <div className={classes.warning}>
        <Tooltip
            content={i18n.t('This item has been shortened to fit on one page')}
            placement="bottom"
        >
            <WarningIcon />
        </Tooltip>
    </div>
)

export default PrintWarning
