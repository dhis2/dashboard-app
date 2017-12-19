import React from 'react';
import { connect } from 'react-redux';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';

import { Title } from './Title';
import D2TextLink from '../widgets/D2TextLink';
import * as fromReducers from '../reducers';
import { orObject } from '../util';

// Component

const styles = {
    titleBarWrapper: {
        display: 'flex',
        alignItems: 'baseline',
    },
    titleBarIcon: {
        alignSelf: 'flex-end',
        marginLeft: 5,
    },
    titleBarLink: {
        marginLeft: 20,
    },
    textLink: {
        fontSize: 15,
        fontWeight: 500,
        color: '#006ed3',
    },
    textLinkHover: {
        color: '#3399f8',
    },
};

const TitleBar = ({ name, description, edit, starred }) => (
    <div style={styles.titleBarWrapper}>
        <div>
            <Title
                name={name}
                description={description}
                edit={edit}
                starred={starred}
            />
        </div>
        <div style={styles.titleBarIcon}>
            <SvgIcon icon={starred ? 'Star' : 'StarBorder'} />
        </div>
        <div style={styles.titleBarIcon}>
            <SvgIcon icon={'InfoOutline'} />
        </div>
        <div style={styles.titleBarLink}>
            <D2TextLink
                text={'Edit'}
                style={styles.textLink}
                hoverStyle={styles.textLinkHover}
            />
        </div>
        <div style={styles.titleBarLink}>
            <D2TextLink
                text={'Share'}
                style={styles.textLink}
                hoverStyle={styles.textLinkHover}
            />
        </div>
        <div style={styles.titleBarLink}>
            <D2TextLink
                text={'Filter'}
                style={styles.textLink}
                hoverStyle={styles.textLinkHover}
            />
        </div>
    </div>
);

// Container

const mapStateToProps = state => {
    const { fromSelected, sGetSelectedDashboard } = fromReducers;
    const { sGetSelectedEdit } = fromSelected;

    const selectedDashboard = orObject(sGetSelectedDashboard(state));

    return {
        name: selectedDashboard.name,
        description: selectedDashboard.description,
        starred: selectedDashboard.starred,
        edit: sGetSelectedEdit(state),
    };
};

const mapDispatchToProps = () => ({
    onBlur: e => console.log('dashboard name: ', e.target.value),
});

const TitleBarCt = connect(mapStateToProps, mapDispatchToProps)(TitleBar);

export default TitleBarCt;
