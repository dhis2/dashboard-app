import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from '@dhis2/ui-core';
import i18n from '@dhis2/d2-i18n';

import { orObject } from '../../modules/util';
import { sGetSelectedId } from '../../reducers/selected';
import { sGetDashboardById } from '../../reducers/dashboards';
import { acAddDashboardItem } from '../../actions/editDashboard';

import { PAGEBREAK } from '../../modules/itemTypes';

const PrintTitleBar = props => {
    const { name, style } = props;

    const titleStyle = Object.assign({}, style.title, {
        cursor: 'default',
        userSelect: 'text',
        top: '7px',
    });

    const addPageBreak = (event, other) => {
        console.log('event', event.clientX, event.clientY);
        console.log('other', other.target);
        props.addDashboardItem({ type: PAGEBREAK });
    };

    return (
        <>
            <span style={titleStyle}>{name}</span>
            <Button className="page-break-button" onClick={addPageBreak}>
                {i18n.t('Add page break')}
            </Button>
        </>
    );
};

PrintTitleBar.propTypes = {
    addDashboardItem: PropTypes.func,
    name: PropTypes.string,
    style: PropTypes.object,
};

PrintTitleBar.defaultProps = {
    name: '',
    description: '',
};

const mapStateToProps = state => {
    const id = sGetSelectedId(state);
    const dashboard = orObject(sGetDashboardById(state, id));

    return {
        name: dashboard.displayName,
        description: dashboard.displayDescription,
    };
};

const mapDispatchToProps = { addDashboardItem: acAddDashboardItem };

export default connect(mapStateToProps, mapDispatchToProps)(PrintTitleBar);
