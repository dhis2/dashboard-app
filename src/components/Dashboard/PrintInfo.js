import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { a4LandscapeWidthPx } from '../../modules/printUtils'

import classes from './styles/PrintInfo.module.css'

const PrintInfo = ({ isLayout }) => {
    const maxWidth =
        a4LandscapeWidthPx < window.innerWidth
            ? a4LandscapeWidthPx
            : window.innerWidth

    const infoHeader = isLayout
        ? i18n.t('dashboard layout')
        : i18n.t('one item per page')

    return (
        <div className={classes.infoWrapper}>
            <p className={classes.infoHeader}>
                {`${i18n.t('Print Preview')}: ${infoHeader}`}
            </p>
            <div style={{ maxWidth }}>
                <p className={classes.info}>
                    {`${i18n.t('For best print results')}:`}
                </p>
                <div className={classes.info}>
                    <ul className={classes.infoList}>
                        <li>{i18n.t('Use Chrome or Edge web browser')}</li>
                        <li>
                            {i18n.t(
                                'Wait for all dashboard items to load before printing'
                            )}
                        </li>
                        <li>
                            {i18n.t(
                                'Use A4 landscape paper size and default margin settings in the browser print dialog'
                            )}
                        </li>
                    </ul>
                </div>
            </div>
            <hr className={classes.divider} />
        </div>
    )
}

PrintInfo.propTypes = {
    isLayout: PropTypes.bool,
}

export default PrintInfo
