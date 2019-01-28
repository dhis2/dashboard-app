import React from 'react';
import i18n from 'd2-i18n';

import { colors } from '../../modules/colors';

const ShowMoreButton = ({ onClick, isMaxHeight }) => (
    <div style={{ textAlign: 'center' }}>
        <div
            onClick={onClick}
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
