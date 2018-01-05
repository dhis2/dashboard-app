import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from 'd2-ui/lib/text-field/TextField';

import Interpretation from './Interpretation';
import { tGetInterpretations, tPostInterpretation } from './actions';
import * as fromReducers from '../../reducers';

const style = {
    container: {
        overflowY: 'scroll',
        height: 320,
        padding: 5,
    },
    list: {
        listStyleType: 'none',
    },
    item: {
        borderBottom: '1px solid #DCDCDC',
        marginBottom: 10,
        paddingBottom: 10,
    },
};

class Interpretations extends Component {
    state = {
        newInterpretationText: '',
    };

    updateNewInterpretationText = newInterpretationText => {
        this.setState({ newInterpretationText });
    };

    postInterpretation = () => {
        const data = {
            objectType: this.props.objectType,
            objectId: this.props.objectId,
            text: this.state.newInterpretationText,
        };

        this.props.postInterpretation(data, this.props.dashboardId);
        this.setState({ newInterpretationText: '' });
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
        console.log('componentDidMount');
        this.loadInterpretations();
    }

    // componentDidUpdate() {
    //     console.log('componentDidUpdate');
    //     this.loadInterpretations();
    // }

    renderItems() {
        let Items = null;
        if (this.interpretationsLoaded()) {
            Items = this.props.ids.map((id, i) => {
                const item = this.props.interpretations[id];
                return (
                    <li style={style.item} key={item.id}>
                        <Interpretation item={item} />
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
                <div>
                    <TextField onChange={this.updateNewInterpretationText} />
                    <button onClick={this.postInterpretation}>POST</button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { fromInterpretations } = fromReducers;
    const { sGetSelectedDashboard } = fromReducers;

    const dashboardId = sGetSelectedDashboard(state).id;
    return {
        dashboardId,
        interpretations: fromInterpretations.sGetInterpretations(
            state,
            ownProps.ids
        ),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getInterpretations: ids => dispatch(tGetInterpretations(ids)),
        postInterpretation: (data, dashboardId) =>
            dispatch(tPostInterpretation(data, dashboardId)),
    };
};

const InterpretationsContainer = connect(mapStateToProps, mapDispatchToProps)(
    Interpretations
);

export default InterpretationsContainer;
