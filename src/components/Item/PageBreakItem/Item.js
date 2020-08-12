import React from 'react'
import i18n from '@dhis2/d2-i18n'

import classes from './styles/PageBreakItem.module.css'

const PageBreakItem = () => (
    <p className={classes.text}>
        {i18n.t('Page break marker - will not appear on the printed dashboard')}
    </p>
)

export default PageBreakItem
