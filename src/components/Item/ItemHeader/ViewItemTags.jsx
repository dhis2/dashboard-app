import PropTypes from 'prop-types'
import React from 'react'
import classes from './styles/ItemHeader.module.css'

const ViewItemTags = ({ tags }) =>
    tags ? <div className={classes.itemTagsWrap}>{tags}</div> : null

ViewItemTags.propTypes = {
    tags: PropTypes.node,
}

export default ViewItemTags
