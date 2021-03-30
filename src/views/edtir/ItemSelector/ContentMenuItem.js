import React from 'react'
import { MenuItem, colors } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import { visTypeIcons, VIS_TYPE_SCATTER } from '@dhis2/analytics'

import ScatterIcon from './assets/ScatterIcon'
import LaunchIcon from './assets/Launch'
import { getItemIcon, VISUALIZATION } from '../../../modules/itemTypes'

import classes from './styles/ContentMenuItem.module.css'

const LaunchLink = ({ url }) => (
    <a
        onClick={e => e.stopPropagation()}
        className={classes.launchLink}
        target="_blank"
        rel="noopener noreferrer"
        href={url}
    >
        <LaunchIcon />
    </a>
)

LaunchLink.propTypes = {
    url: PropTypes.string,
}

const InsertButton = () => (
    <button className={classes.buttonInsert}>{i18n.t('Insert')}</button>
)

const ContentMenuItem = ({ type, name, onInsert, url, visType }) => {
    const ItemIcon = getItemIcon(type)

    let renderedItemIcon
    if (type === VISUALIZATION) {
        renderedItemIcon =
            visType === VIS_TYPE_SCATTER ? (
                <ScatterIcon />
            ) : (
                visTypeIcons[visType]
            )
    } else {
        renderedItemIcon = <ItemIcon style={{ fill: colors.grey600 }} />
    }

    return (
        <MenuItem
            dense
            onClick={onInsert}
            label={
                <div className={classes.menuItem}>
                    <div className={classes.label}>
                        <span style={{ marginRight: '6px' }}>
                            {renderedItemIcon}
                        </span>
                        <span>{name}</span>
                        {url ? <LaunchLink url={url} /> : null}
                    </div>
                    <InsertButton />
                </div>
            }
            dataTest={`menu-item-${name}`}
        />
    )
}

ContentMenuItem.propTypes = {
    name: PropTypes.string,
    type: PropTypes.string,
    url: PropTypes.string,
    visType: PropTypes.string,
    onInsert: PropTypes.func,
}

export default ContentMenuItem
