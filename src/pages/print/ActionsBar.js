import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import { Link } from 'react-router-dom'
import LessHorizontalIcon from './assets/LessHorizontal'

import classes from './styles/PrintActionsBar.module.css'

// set in PrintActionsBar.module.css
export const PRINT_ACTIONS_BAR_HEIGHT = 44
export const PRINT_ACTIONS_BAR_HEIGHT_SM = 36

const PrintActionsBar = ({ id }) => {
    const getExitPrintButton = isSmall => (
        <Button
            className={isSmall ? classes.buttonSmall : classes.buttonLarge}
            small={isSmall}
        >
            <LessHorizontalIcon />
            {i18n.t('Exit print preview')}
        </Button>
    )

    const getPrintButton = isSmall => (
        <Button
            className={isSmall ? classes.buttonSmall : classes.buttonLarge}
            small={isSmall}
            onClick={window.print}
        >
            {i18n.t('Print')}
        </Button>
    )

    return (
        <div className={classes.container}>
            <div className={classes.actions}>
                <Link className={classes.link} to={`/${id}`}>
                    {getExitPrintButton(true)}
                    {getExitPrintButton(false)}
                </Link>
                {getPrintButton(true)}
                {getPrintButton(false)}
            </div>
        </div>
    )
}

PrintActionsBar.defaultValues = {
    id: '/',
}

PrintActionsBar.propTypes = {
    id: PropTypes.string,
}

export default PrintActionsBar
