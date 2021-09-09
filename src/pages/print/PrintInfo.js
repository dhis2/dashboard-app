import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/PrintInfo.module.css'

const PrintInfo = ({ isLayout }) => {
    const layoutStyle = isLayout
        ? i18n.t('dashboard layout')
        : i18n.t('one item per page')

    return (
        <div className={classes.container}>
            <p className={classes.title}>
                {`${i18n.t('Print Preview')}: ${layoutStyle}`}
            </p>
            <div className={classes.printSuggestions}>
                <p>{`${i18n.t('For best print results')}:`}</p>
                <ul>
                    <li>{i18n.t('Use Chrome or Edge web browser')}</li>
                    <li>
                        {i18n.t(
                            'Wait for all dashboard items to load before printing'
                        )}
                    </li>
                    <li>
                        {i18n.t(
                            'Use A4 landscape paper size, default margin settings and turn on background graphics in the browser print dialog'
                        )}
                    </li>
                </ul>
            </div>
            <hr className={classes.divider} />
        </div>
    )
}

PrintInfo.propTypes = {
    isLayout: PropTypes.bool,
}

export default PrintInfo
