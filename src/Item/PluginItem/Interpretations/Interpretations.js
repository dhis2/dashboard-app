import React, { Component } from 'react';
import { connect } from 'react-redux';
import i18n from '@dhis2/d2-i18n';

import Interpretation from './Interpretation';
import InputField from './InputField';
import { tGetInterpretations, tPostInterpretation } from './actions';
import * as fromReducers from '../../../reducers';
import { colors } from '../../../colors';
import { sortByDate } from '../../../util';

const style = {
    container: {
        padding: '5px',
        marginTop: '5px',
    },
    interpretation: {
        marginBottom: '10px',
        maxWidth: '560px',
        marginRight: '20px',
    },
    list: {
        listStyleType: 'none',
        paddingLeft: '0px',
    },
    title: {
        color: colors.black,
        fontSize: '13px',
        fontWeight: 'bold',
        height: '19px',
        lineHeight: '19px',
    },
};

class Interpretations extends Component {
    state = {
        newInterpretationText: '',
    };

    postInterpretation = text => {
        const { object, objectId } = this.props;
        this.props.postInterpretation({
            objectType: object.type,
            objectId,
            text,
        });
    };

    interpretationsLoaded = () => {
        const isLoaded =
            this.props.ids.length &&
            this.props.ids.length ===
                Object.keys(this.props.interpretations).length;

        return isLoaded;
    };

    loadInterpretations = () => {
        if (!this.interpretationsLoaded()) {
            const idsToGet = this.props.ids.filter(
                id => !this.props.interpretations[id]
            );

            this.props.getInterpretations(idsToGet);
        }
    };

    componentDidMount() {
        this.loadInterpretations();
    }

    renderItems() {
        let Items = null;
        if (this.interpretationsLoaded()) {
            const sorted = sortByDate(
                this.props.interpretations,
                'created',
                false
            );
            Items = sorted.map(interpretation => {
                return (
                    <li style={style.interpretation} key={interpretation.id}>
                        <Interpretation
                            interpretation={interpretation}
                            object={this.props.object}
                            objectId={this.props.objectId}
                        />
                    </li>
                );
            });
        }
        return Items;
    }
    render() {
        return (
            <div style={style.container}>
                <h3 style={style.title}>
                    {i18n.t('Interpretations')} ({this.props.ids.length})
                </h3>
                <ul style={style.list}>{this.renderItems()}</ul>
                <InputField
                    placeholder={i18n.t('Add your interpretation')}
                    onSubmit={this.postInterpretation}
                    postText="Post"
                />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { fromVisualizations, fromInterpretations } = fromReducers;
    const ids = fromVisualizations
        .sGetVisInterpretations(state, ownProps.objectId)
        .map(i => i.id);

    return {
        ids,
        interpretations: fromInterpretations.sGetInterpretations(state, ids),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getInterpretations: ids => dispatch(tGetInterpretations(ids)),
        postInterpretation: data => dispatch(tPostInterpretation(data)),
    };
};

const InterpretationsContainer = connect(mapStateToProps, mapDispatchToProps)(
    Interpretations
);

export default InterpretationsContainer;
