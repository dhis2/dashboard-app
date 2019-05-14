import React from 'react';
import { MenuItem, colors } from '@dhis2/ui-core';
import i18n from '@dhis2/d2-i18n';

import { getItemIcon } from '../../modules/itemTypes';
import LaunchIcon from '../../icons/Launch';

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

const InsertButton = () => (
    <button className={classes.buttonInsert}>{i18n.t('Insert')}</button>
);

const ContentMenuItem = ({ type, name, onInsert, url }) => {
    const ItemIcon = getItemIcon(type);
    return (
        <MenuItem
            dense
            onClick={onInsert}
            label={
                <div className={classes.menuItem}>
                    <div className={classes.label}>
                        <ItemIcon
                            style={{ margin: '6px', fill: colors.grey600 }}
                        />
                        <span>{name}</span>
                        {url ? <LaunchLink url={url} /> : null}
                    </div>
                    <InsertButton />
                </div>
            }
        />
    );
};

export default ContentMenuItem;
