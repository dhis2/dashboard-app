import i18n from '@dhis2/d2-i18n'
import { SegmentedControl } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import {
    acSetLayoutColumns,
    tSetDashboardItems,
} from '../../actions/editDashboard.js'
import { sGetLayoutColumns } from '../../reducers/editDashboard.js'
import classes from './styles/FirstRunLayoutChoice.module.css'

const DEFAULT_FIXED_COLUMNS = 3

const DashboardGlyph = () => (
    <svg
        className={classes.glyph}
        viewBox="0 0 48 48"
        width="48"
        height="48"
        aria-hidden="true"
    >
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <rect x="28" y="4" width="16" height="16" rx="3" />
        <rect x="4" y="28" width="16" height="16" rx="3" />
        <rect x="28" y="28" width="16" height="16" rx="3" />
    </svg>
)

const FirstRunLayoutChoice = ({ isFixed, onChooseLayout }) => {
    const description = isFixed
        ? i18n.t('Items are set to a fixed width')
        : i18n.t('Flexible items can be placed anywhere.')

    return (
        <div className={classes.wrap} data-test="first-run-layout-choice">
            <div className={classes.inner}>
                <DashboardGlyph />
                <h2 className={classes.title}>{i18n.t('New dashboard')}</h2>
                <p className={classes.subtitle}>
                    {i18n.t(
                        'Start adding visualizations, reports, and more from the toolbar above'
                    )}
                </p>
                <div className={classes.control}>
                    <SegmentedControl
                        ariaLabel={i18n.t('Layout mode')}
                        options={[
                            {
                                label: i18n.t('Flexible layout'),
                                value: 'FREEFLOW',
                            },
                            {
                                label: i18n.t('Fixed layout'),
                                value: 'FIXED',
                            },
                        ]}
                        selected={isFixed ? 'FIXED' : 'FREEFLOW'}
                        onChange={({ value }) =>
                            onChooseLayout(
                                value === 'FIXED' ? DEFAULT_FIXED_COLUMNS : 0
                            )
                        }
                    />
                </div>
                <p className={classes.description}>{description}</p>
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
            acSetLayoutColumns(
                [...Array(count).keys()].map((i) => ({ index: i }))
            )
        )
        dispatch(tSetDashboardItems())
    },
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FirstRunLayoutChoice)
