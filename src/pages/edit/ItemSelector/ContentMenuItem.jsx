import { visTypeIcons } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import { MenuItem, colors, IconLaunch16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { getItemIcon, VISUALIZATION } from '../../../modules/itemTypes.js'
import classes from './styles/ContentMenuItem.module.css'

const LaunchLink = ({ url }) => (
    <a
        onClick={(e) => e.stopPropagation()}
        className={classes.launchLink}
        target="_blank"
        rel="noopener noreferrer"
        href={url}
        aria-label={i18n.t('Open visualization in new tab')}
    >
        <IconLaunch16 color={colors.grey700} />
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
        const VisualizationIcon = visTypeIcons[visType]
        renderedItemIcon = <VisualizationIcon color={colors.grey600} />
    } else {
        renderedItemIcon = <ItemIcon color={colors.grey600} />
    }

    return (
        <MenuItem
            onClick={onInsert}
            icon={renderedItemIcon}
            label={
                <div className={classes.menuItem}>
                    <div className={classes.label}>
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
