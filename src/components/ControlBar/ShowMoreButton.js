import React from 'react';
import PropTypes from 'prop-types';
import i18n from '@dhis2/d2-i18n';

import classes from './styles/ShowMoreButton.module.css';

export const SHOWMORE_BAR_HEIGHT = 16;

export const ShowMoreButton = ({ onClick, isMaxHeight, disabled }) => {
    return (
        <div style={{ textAlign: 'center' }}>
            {disabled ? (
                <div className={classes.disabled}>{i18n.t('Show more')}</div>
            ) : (
                <div className={classes.showMore} onClick={onClick}>
                    {isMaxHeight ? i18n.t('Show less') : i18n.t('Show more')}
                </div>
            )}
        </div>
    );
};

ShowMoreButton.propTypes = {
    disabled: PropTypes.bool,
    isMaxHeight: PropTypes.bool,
    onClick: PropTypes.func,
};

export default ShowMoreButton;
