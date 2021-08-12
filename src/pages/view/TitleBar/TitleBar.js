import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import {
    sGetSelectedDisplayName,
    sGetSelectedDisplayDescription,
} from '../../../reducers/selected'
import { sGetShowDescription } from '../../../reducers/showDescription'
import ActionsBar from './ActionsBar'
import Description from './Description'
import classes from './styles/TitleBar.module.css'

const ViewTitleBar = ({ name, description, showDescription }) => (
    <div className={classes.container}>
        <div className={classes.titleBar} data-test="title-bar">
            <span className={classes.title} data-test="view-dashboard-title">
                {name}
            </span>
            <ActionsBar />
        </div>
        <Description
            description={description}
            showDescription={showDescription}
        />
    </div>
)

ViewTitleBar.propTypes = {
    description: PropTypes.string,
    name: PropTypes.string,
    showDescription: PropTypes.bool,
}

const mapStateToProps = state => ({
    name: sGetSelectedDisplayName(state),
    description: sGetSelectedDisplayDescription(state),
    showDescription: sGetShowDescription(state),
})

export default connect(mapStateToProps)(ViewTitleBar)
