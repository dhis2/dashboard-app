import {
    useDataEngine,
    useAlert,
} from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { acSetDashboardStarred } from '../../../actions/dashboards.js'
import { sGetDashboardStarred } from '../../../reducers/dashboards.js'
import { sGetSelected } from '../../../reducers/selected.js'
import { sGetShowDescription } from '../../../reducers/showDescription.js'
import FilterBar from '../FilterBar/FilterBar.js'
import ActionsBar from './ActionsBar.js'
import { apiStarDashboard } from './apiStarDashboard.js'
import Description from './Description.js'
import LastUpdatedTag from './LastUpdatedTag.js'
import StarDashboardButton from './StarDashboardButton.js'
import classes from './styles/TitleBar.module.css'

const ViewTitleBar = ({
    id,
    displayName,
    displayDescription,
    showDescription,
    starred,
    setDashboardStarred,

}) => {

    const dataEngine = useDataEngine()
    const { show } = useAlert(
        ({ msg }) => msg,
        ({ isCritical }) =>
            isCritical ? { critical: true } : { warning: true }
    )


    const onToggleStarredDashboard = (cb) =>
        apiStarDashboard(dataEngine, id, !starred)
            .then(() => {
                setDashboardStarred(id, !starred)
                cb && cb()
            })
            .catch(() => {
                const msg = starred
                    ? i18n.t('Failed to unstar the dashboard')
                    : i18n.t('Failed to star the dashboard')
                show({ msg, isCritical: false })
            })

    return (
        <>
            <div className={classes.container}>
                <div className={classes.titleBar} data-test="title-bar">
                    <div className={classes.infoWrap}>
                        <div className={classes.titleWrap}>
                            <span
                                className={classes.title}
                                data-test="view-dashboard-title"
                            >
                                {displayName}
                            </span>
                            <StarDashboardButton
                                starred={starred}
                                onClick={onToggleStarredDashboard}
                            />
                        </div>
                    </div>
                    <div className={classes.detailWrap}>
                        <FilterBar />
                        <div className={classes.innerDetails}>
                            <div className={classes.groupedLastUpdated}>
                                {<LastUpdatedTag id={id} />}
                            </div>
                            <ActionsBar starred={starred} onToggleStarredDashboard={onToggleStarredDashboard} />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <div className={classes.inlineLastUpdated}>
                    {<LastUpdatedTag id={id} />}
                </div>
                {showDescription && (
                    <Description description={displayDescription} />
                )}
            </div>
        </>
    )
}

ViewTitleBar.propTypes = {
    displayDescription: PropTypes.string,
    displayName: PropTypes.string,
    id: PropTypes.string,
    setDashboardStarred: PropTypes.func,
    showDescription: PropTypes.bool,
    starred: PropTypes.bool,
}

const mapStateToProps = (state) => {
    const dashboard = sGetSelected(state)

    return {
        ...dashboard,
        starred: dashboard.id
            ? sGetDashboardStarred(state, dashboard.id)
            : false,
        showDescription: sGetShowDescription(state),
    }
}

export default connect(mapStateToProps, {
    setDashboardStarred: acSetDashboardStarred,
})(ViewTitleBar)
