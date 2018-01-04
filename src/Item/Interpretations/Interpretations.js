import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getInstance } from 'd2/lib/d2';

import TextField from 'd2-ui/lib/text-field/TextField';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';

import {
    tLikeInterpretation,
    tUnlikeInterpretation,
    tGetInterpretations,
    tPostInterpretation,
} from './actions';

import * as fromReducers from '../../reducers';
const { sGetSelectedDashboard } = fromReducers;

const style = {
    list: {
        listStyleType: 'none',
    },
    item: {
        borderBottom: '1px solid #DCDCDC',
        marginBottom: 10,
        paddingBottom: 10,
    },
    author: {
        fontWeight: 'bold',
    },
    created: {
        float: 'right',
    },
    text: {},
    reply: {},
};

class Interpretations extends Component {
    state = {
        newInterpretationText: '',
    };

    toggleInterpretationLike = id => {
        getInstance()
            .then(d2 => d2.currentUser)
            .then(user => {
                const liked = this.props.interpretations[id].likedBy.find(
                    liker => liker.id === user.id
                );

                liked
                    ? this.props.unlikeInterpretation(id)
                    : this.props.likeInterpretation(id);
            });
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

    componentWillMount() {
        this.loadInterpretations();
    }

    componentWillReceiveProps() {
        this.loadInterpretations();
    }

    renderItems() {
        let Items = null;
        if (this.interpretationsLoaded()) {
            const interpretationBody = item => {
                return (
                    <div>
                        <div>
                            <span style={style.author}>
                                {item.user.displayName}
                            </span>
                            <span style={style.created}>{item.created}</span>
                        </div>
                        <p style={style.text}>{item.text}</p>
                    </div>
                );
            };

            Items = this.props.ids.map((id, i) => {
                const item = this.props.interpretations[id];
                const comments = item.comments.map(comment => (
                    <li key={comment.id}>{interpretationBody(comment)}</li>
                ));

                return (
                    <li style={style.item} key={item.id}>
                        {interpretationBody(item)}
                        <div>
                            <button>
                                <SvgIcon icon="Launch" />
                                View in Visualizer
                            </button>
                            <button style={style.reply}>
                                <SvgIcon icon="Reply" />
                                Reply
                            </button>
                            <button
                                style={style.like}
                                onClick={() =>
                                    this.toggleInterpretationLike(item.id)
                                }
                            >
                                <SvgIcon icon="ThumbUp" />
                                Like
                            </button>
                            <span>{item.likedBy.length} likes</span>
                        </div>
                        <ul style={style.list}>{comments}</ul>
                    </li>
                );
            });
        }
        return Items;
    }

    render() {
        const Items = this.renderItems();

        return (
            <div>
                <h3 style={style.title}>
                    Interpretations ({this.props.ids.length})
                </h3>
                <ul style={style.list}>{Items}</ul>
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
        likeInterpretation: data => dispatch(tLikeInterpretation(data)),
        unlikeInterpretation: data => dispatch(tUnlikeInterpretation(data)),
        getInterpretations: ids => dispatch(tGetInterpretations(ids)),
        postInterpretation: (data, dashboardId) =>
            dispatch(tPostInterpretation(data, dashboardId)),
    };
};

const InterpretationsContainer = connect(mapStateToProps, mapDispatchToProps)(
    Interpretations
);

export default InterpretationsContainer;
