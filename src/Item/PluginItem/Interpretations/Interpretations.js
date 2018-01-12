import React, { Component } from 'react';
import { connect } from 'react-redux';

import Interpretation from './Interpretation';
import InputField from './InputField';
import { tGetInterpretations, tPostInterpretation } from './actions';
import * as fromReducers from '../../../reducers';
import { colors } from '../colors';

const style = {
    container: {
        overflowY: 'scroll',
        height: '320px',
        padding: '5px',
        marginTop: '5px',
    },
    item: {
        borderBottom: `1px solid ${colors.lightGrey}`,
        marginBottom: '10px',
        paddingBottom: '10px',
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
        const { objectType, objectId } = this.props;
        this.props.postInterpretation({ objectType, objectId, text });
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

    sortByDate = () => {
        const values = Object.values(this.props.interpretations);

        values.sort((a, b) => {
            const aDate = new Date(a.created);
            const bDate = new Date(b.created);

            return aDate - bDate;
        });

        return values;
    };

    renderItems() {
        let Items = null;
        if (this.interpretationsLoaded()) {
            const sorted = this.sortByDate();
            Items = sorted.map(item => {
                return (
                    <li style={style.item} key={item.id}>
                        <Interpretation
                            item={item}
                            objectId={this.props.objectId}
                            objectType={this.props.objectType}
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
                    Interpretations ({this.props.ids.length})
                </h3>
                <ul style={style.list}>{this.renderItems()}</ul>
                <InputField
                    placeholder="Write your own interpretation"
                    onPost={this.postInterpretation}
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
