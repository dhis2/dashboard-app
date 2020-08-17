import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import { Link } from 'react-router-dom'

import classes from './PrintActionsBar.module.css'

const PrintActionsBar = ({ id }) => {
    return (
        <div className={classes.container}>
            <Link className={classes.link} to={`/${id}`}>
                <Button>{i18n.t('Exit print preview')}</Button>
            </Link>
            <Button onClick={window.print}>{i18n.t('Print')}</Button>
        </div>
    )
}

PrintActionsBar.propTypes = {
    id: PropTypes.string,
}

export default PrintActionsBar
