import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { sGetSelected } from '../../../reducers/selected.js'
import { sGetShowDescription } from '../../../reducers/showDescription.js'
import FilterBar from '../FilterBar/FilterBar.js'
import ActionsBar from './ActionsBar.js'
import Description from './Description.js'
import LastUpdatedTag from './LastUpdatedTag.js'
import StarDashboardButton from './StarDashboardButton.js'
import classes from './styles/TitleBar.module.css'

const ViewTitleBar = ({
    id,
    displayName,
    displayDescription,
    showDescription,
}) => {
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
                            {/* Todo: Re-add starring functionality */}
                            <StarDashboardButton />
                        </div>
                    </div>
                    <div className={classes.detailWrap}>
                        <FilterBar />
                        <div className={classes.innerDetails}>
                            <div className={classes.groupedLastUpdated}>
                                {<LastUpdatedTag id={id} />}
                            </div>
                            <ActionsBar />
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
    showDescription: PropTypes.bool,
}

const mapStateToProps = (state) => {
    const dashboard = sGetSelected(state)

    return {
        ...dashboard,
        showDescription: sGetShowDescription(state),
    }
}

export default connect(mapStateToProps)(ViewTitleBar)
