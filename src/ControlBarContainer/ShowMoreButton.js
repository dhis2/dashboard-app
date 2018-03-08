import React from 'react';
import i18n from 'dhis2-i18n';
import { colors } from '../colors';

const ShowMoreButton = ({ onToggleMaxHeight, isMaxHeight }) => (
    <div style={{ textAlign: 'center' }}>
        <div
            onClick={onToggleMaxHeight}
            style={{
                paddingTop: 3,
                fontSize: 11,
                fontWeight: 700,
                color: colors.royalBlue,
                textTransform: 'uppercase',
                cursor: 'pointer',
                visibility: 'visible',
            }}
        >
            {isMaxHeight ? i18n.t('Show less') : i18n.t('Show more')}
        </div>
    </div>
);

export default ShowMoreButton;
