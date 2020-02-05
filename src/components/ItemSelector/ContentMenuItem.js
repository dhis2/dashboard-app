import React from 'react';
import { MenuItem, colors } from '@dhis2/ui-core';
import i18n from '@dhis2/d2-i18n';
import PropTypes from 'prop-types';

import { getItemIcon, VISUALIZATION } from '../../modules/itemTypes';
import LaunchIcon from '../../icons/Launch';
import VisIcon from '../../icons/VisTypes';

import classes from './styles/ContentMenuItem.module.css';

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
);

LaunchLink.propTypes = {
    url: PropTypes.string,
};

const InsertButton = () => (
    <button className={classes.buttonInsert}>{i18n.t('Insert')}</button>
);

const ContentMenuItem = ({ type, name, onInsert, url, visType }) => {
    const ItemIcon = getItemIcon(type);

    const renderedItemIcon =
        type === VISUALIZATION ? (
            <VisIcon
                name={visType}
                style={{ margin: '6px', fill: colors.grey600 }}
            />
        ) : (
            <ItemIcon style={{ margin: '6px', fill: colors.grey600 }} />
        );

    return (
        <MenuItem
            dense
            onClick={onInsert}
            label={
                <div className={classes.menuItem}>
                    <div className={classes.label}>
                        {renderedItemIcon}
                        <span>{name}</span>
                        {url ? <LaunchLink url={url} /> : null}
                    </div>
                    <InsertButton />
                </div>
            }
        />
    );
};

ContentMenuItem.propTypes = {
    name: PropTypes.string,
    type: PropTypes.string,
    url: PropTypes.string,
    onInsert: PropTypes.func,
    visType: PropTypes.string,
};

export default ContentMenuItem;
