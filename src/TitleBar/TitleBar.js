import React from 'react';
import { connect } from 'react-redux';

import './TitleBar.css';
import { Title } from './Title';
import * as fromReducers from '../reducers';
import { orObject } from '../util';

// Component

const SomeButton = ({ text }) => text;

const TitleBar = ({ name, description, edit, starred }) => (
    <div className="titlebar-wrapper">
        <div className="titlebar-item">
            <Title
                name={name}
                description={description}
                edit={edit}
                starred={starred}
            />
        </div>
        <div className="titlebar-item">
            <SomeButton text={starred ? 'STARRED' : 'UNSTARRED'} />
        </div>
        <div className="titlebar-item">
            <SomeButton text={'i'} />
        </div>
        <div className="titlebar-item">
            <SomeButton text={'Edit'} />
        </div>
        <div className="titlebar-item">
            <SomeButton text={'Share'} />
        </div>
        <div className="titlebar-item">
            <SomeButton text={'Filter'} />
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
