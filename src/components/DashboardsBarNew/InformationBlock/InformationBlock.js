import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { sGetSelected } from '../../../reducers/selected.js'
import { sGetShowDescription } from '../../../reducers/showDescription.js'
import ActionsBar from './ActionsBar.js'
import Description from './Description.js'
import LastUpdatedTag from './LastUpdatedTag.js'
import classes from './styles/InformationBlock.module.css'

const InformationBlock = ({
    id,
    displayName,
    displayDescription,
    showDescription,
}) => {
    return (
        <div className={classes.container}>
            <div className={classes.titleBar} data-test="title-bar">
                <span
                    className={classes.title}
                    data-test="view-dashboard-title"
                >
                    {displayName}
                </span>
                <ActionsBar />
            </div>
            {showDescription && (
                <Description description={displayDescription} />
            )}
            {<LastUpdatedTag id={id} />}
        </div>
    )
}

InformationBlock.propTypes = {
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

export default connect(mapStateToProps)(InformationBlock)
