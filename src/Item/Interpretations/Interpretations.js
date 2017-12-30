import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getInstance } from 'd2/lib/d2';

import { tLikeInterpretation, tUnlikeInterpretation } from './actions';
import { sGetSelectedDashboard } from '../../reducers';

import TextField from 'd2-ui/lib/text-field/TextField';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';

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
    toggleInterpretationLike = id => {
        getInstance()
            .then(d2 => d2.currentUser)
            .then(user => {
                const interpretation = this.props.interpretations.find(
                    i => i.id === id
                );
                const liked = interpretation.likedBy.find(
                    liker => liker.id === user.id
                );

                const data = {
                    interpretationId: id,
                    dashboardId: this.props.dashboardId,
                };

                liked
                    ? this.props.unlikeInterpretation(data)
                    : this.props.likeInterpretation(data);
            });
    };

    render() {
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

        const Items = this.props.interpretations.map(item => {
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
                    <div>
                        <TextField />
                        <button>POST</button>
                    </div>
                </li>
            );
        });

        return (
            <div>
                <h3 style={style.title}>
                    Interpretations ({this.props.interpretations.length})
                </h3>
                <ul style={style.list}>{Items}</ul>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        dashboardId: sGetSelectedDashboard(state).id,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        likeInterpretation: data => dispatch(tLikeInterpretation(data)),
        unlikeInterpretation: data => dispatch(tUnlikeInterpretation(data)),
    };
};

const InterpretationsContainer = connect(mapStateToProps, mapDispatchToProps)(
    Interpretations
);

export default InterpretationsContainer;
