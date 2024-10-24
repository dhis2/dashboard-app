import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { Button, ComponentCover, Tooltip, IconAdd24 } from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'
import { sGetAllDashboards } from '../../reducers/dashboards.js'
import { sGetDashboardsFilter } from '../../reducers/dashboardsFilter.js'
import { sGetSelectedId } from '../../reducers/selected.js'
import Chip from './Chip.jsx'
import Filter from './Filter.jsx'
import { getFilteredDashboards } from './getFilteredDashboards.js'
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
    const { isDisconnected: offline } = useDhis2ConnectionStatus()

    const onSelectDashboard = () => {
        const id = getFilteredDashboards(dashboards, filterText)[0]?.id
        if (id) {
            history.push(id)
        }
    }

    const enterNewMode = () => {
        if (!offline) {
            setRedirectUrl('/new')
        }
    }

    const getChips = () =>
        getFilteredDashboards(dashboards, filterText).map((dashboard) => (
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
        <div className={classes.controlsLarge}>
            <div className={classes.buttonPadding}>
                <div className={classes.buttonPosition}>
                    <Tooltip
                        content={
                            offline
                                ? i18n.t(
                                      'Cannot create a dashboard while offline'
                                  )
                                : i18n.t('Create new dashboard')
                        }
                        closeDelay={100}
                        openDelay={400}
                    >
                        <Button
                            className={classes.newButton}
                            disabled={offline}
                            small
                            icon={<IconAdd24 />}
                            onClick={enterNewMode}
                            dataTest="new-button"
                        />
                        {offline && <ComponentCover />}
                    </Tooltip>
                </div>
            </div>
            <Filter
                onKeypressEnter={onSelectDashboard}
                onSearchClicked={onSearchClicked}
                expanded={expanded}
            />
        </div>
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

const mapStateToProps = (state) => ({
    dashboards: sGetAllDashboards(state),
    selectedId: sGetSelectedId(state),
    filterText: sGetDashboardsFilter(state),
})

export default withRouter(connect(mapStateToProps)(Content))
