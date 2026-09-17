import i18n from '@dhis2/d2-i18n'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import {
    acSetLayoutColumns,
    tSetDashboardItems,
} from '../../actions/editDashboard.js'
import { sGetLayoutColumns } from '../../reducers/editDashboard.js'
import { LayoutFixedIcon } from './assets/LayoutFixed.jsx'
import { LayoutFreeflowIcon } from './assets/LayoutFreeflow.jsx'
import classes from './styles/FirstRunLayoutChoice.module.css'

const DEFAULT_FIXED_COLUMNS = 3

const FirstRunLayoutChoice = ({ isFixed, onChooseLayout }) => {
    return (
        <div
            className={classes.wrap}
            data-test="first-run-layout-choice"
        >
            <div className={classes.inner}>
                <h2 className={classes.title}>
                    {i18n.t('Start by choosing a layout')}
                </h2>
                <p className={classes.subtitle}>
                    {i18n.t(
                        'You can change this anytime from the Layout panel.'
                    )}
                </p>
                <div className={classes.cards}>
                    <button
                        type="button"
                        className={cx(classes.card, {
                            [classes.active]: !isFixed,
                        })}
                        onClick={() => onChooseLayout(0)}
                    >
                        <LayoutFreeflowIcon />
                        <span className={classes.cardTitle}>
                            {i18n.t('Freeflow')}
                        </span>
                        <span className={classes.cardDesc}>
                            {i18n.t('Place items anywhere, at any size.')}
                        </span>
                    </button>
                    <button
                        type="button"
                        className={cx(classes.card, {
                            [classes.active]: isFixed,
                        })}
                        onClick={() => onChooseLayout(DEFAULT_FIXED_COLUMNS)}
                    >
                        <LayoutFixedIcon />
                        <span className={classes.cardTitle}>
                            {i18n.t('Fixed columns')}
                        </span>
                        <span className={classes.cardDesc}>
                            {i18n.t('Items flow into evenly-sized columns.')}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}

FirstRunLayoutChoice.propTypes = {
    isFixed: PropTypes.bool,
    onChooseLayout: PropTypes.func,
}

const mapStateToProps = (state) => ({
    isFixed: sGetLayoutColumns(state).length > 0,
})

const mapDispatchToProps = {
    onChooseLayout: (count) => (dispatch) => {
        dispatch(
            acSetLayoutColumns([...Array(count).keys()].map((i) => ({ index: i })))
        )
        dispatch(tSetDashboardItems())
    },
}

export default connect(mapStateToProps, mapDispatchToProps)(FirstRunLayoutChoice)
