import i18n from '@dhis2/d2-i18n'
import { Button, Tooltip, colors, IconAdd24 } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'
import { sGetAllDashboards } from '../../../reducers/dashboards'
import { sGetDashboardsFilter } from '../../../reducers/dashboardsFilter'
import { sGetSelectedId } from '../../../reducers/selected'
import Chip from './Chip'
import Filter from './Filter'
import { getFilteredDashboards } from './getFilteredDashboards'
import classes from './styles/Content.module.css'

const Content = ({
    dashboards,
    expanded,
    filterText,
    history,
    selectedId,
    onChipClicked,
    onSearchClicked,
}) => {
    const [redirectUrl, setRedirectUrl] = useState(null)

    const onSelectDashboard = () => {
        const id = getFilteredDashboards(dashboards, filterText)[0]?.id
        if (id) {
            history.push(id)
        }
    }

    const enterNewMode = () => {
        setRedirectUrl('/new')
    }

    const getChips = () =>
        getFilteredDashboards(dashboards, filterText).map(dashboard => (
            <Chip
                key={dashboard.id}
                label={dashboard.displayName}
                starred={dashboard.starred}
                dashboardId={dashboard.id}
                selected={dashboard.id === selectedId}
                onClick={onChipClicked}
            />
        ))

    const getControlsSmall = () => (
        <div className={classes.controlsSmall}>
            <Filter
                onKeypressEnter={onSelectDashboard}
                onSearchClicked={onSearchClicked}
                expanded={expanded}
            />
        </div>
    )

    const getControlsLarge = () => (
        <span className={classes.controlsLarge}>
            <Tooltip content={i18n.t('Create a new dashboard')}>
                <Button
                    className={classes.newButton}
                    small
                    icon={<IconAdd24 color={colors.grey600} />}
                    onClick={enterNewMode}
                    dataTest="new-button"
                />
            </Tooltip>
            <Filter
                onKeypressEnter={onSelectDashboard}
                onSearchClicked={onSearchClicked}
                expanded={expanded}
            />
        </span>
    )

    if (redirectUrl) {
        return <Redirect to={redirectUrl} />
    }

    return (
        <div
            className={cx(
                classes.container,
                expanded ? classes.expanded : classes.collapsed
            )}
        >
            {getControlsSmall()}
            <div className={classes.chipsContainer}>
                {getControlsLarge()}
                {getChips()}
            </div>
        </div>
    )
}

Content.propTypes = {
    dashboards: PropTypes.object,
    expanded: PropTypes.bool,
    filterText: PropTypes.string,
    history: PropTypes.object,
    selectedId: PropTypes.string,
    onChipClicked: PropTypes.func,
    onSearchClicked: PropTypes.func,
}

const mapStateToProps = state => ({
    dashboards: sGetAllDashboards(state),
    selectedId: sGetSelectedId(state),
    filterText: sGetDashboardsFilter(state),
})

export default withRouter(connect(mapStateToProps)(Content))
