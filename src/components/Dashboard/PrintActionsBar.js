import React from 'react'
import PropTypes from 'prop-types'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import { Link } from 'react-router-dom'
import LessHorizontalIcon from '../../icons/LessHorizontal'
import { useWindowDimensions } from '../WindowDimensionsProvider'
import { isSmallScreen } from '../../modules/smallScreen'

import classes from './styles/PrintActionsBar.module.css'

// set in PrintActionsBar.module.css
export const PRINT_ACTIONS_BAR_HEIGHT = 44
export const PRINT_ACTIONS_BAR_HEIGHT_SM = 36

const PrintActionsBar = ({ id }) => {
    const { width } = useWindowDimensions()
    const isSmall = isSmallScreen(width)

    return (
        <>
            <div className={classes.container}>
                <div className={classes.inner}>
                    <Link className={classes.link} to={`/${id}`}>
                        <Button small={isSmall}>
                            <LessHorizontalIcon />
                            {i18n.t('Exit print preview')}
                        </Button>
                    </Link>
                    <Button small={isSmall} onClick={window.print}>
                        {i18n.t('Print')}
                    </Button>
                </div>
            </div>
            <div className={classes.topMargin} />
        </>
    )
}

PrintActionsBar.propTypes = {
    id: PropTypes.string,
}

export default PrintActionsBar
