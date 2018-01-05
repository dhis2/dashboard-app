import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getInstance } from 'd2/lib/d2';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';

import { tLikeInterpretation, tUnlikeInterpretation } from './actions';

const style = {
    author: {
        fontWeight: 'bold',
    },
    created: {
        float: 'right',
    },
    text: {},
    reply: {},
};

class Interpretation extends Component {
    toggleInterpretationLike = id => {
        getInstance()
            .then(d2 => d2.currentUser)
            .then(user => {
                const liked = this.props.item.likedBy.find(
                    liker => liker.id === user.id
                );

                liked
                    ? this.props.unlikeInterpretation(id)
                    : this.props.likeInterpretation(id);
            });
    };

    render() {
        const item = this.props.item;

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

        const comments = item.comments.map(comment => (
            <li key={comment.id}>{interpretationBody(comment)}</li>
        ));

        // return <div />;

        return (
            <div>
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
                        onClick={() => this.toggleInterpretationLike(item.id)}
                    >
                        <SvgIcon icon="ThumbUp" />
                        Like
                    </button>
                    <span>{item.likedBy.length} likes</span>
                </div>
                <ul style={style.list}>{comments}</ul>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        likeInterpretation: data => dispatch(tLikeInterpretation(data)),
        unlikeInterpretation: data => dispatch(tUnlikeInterpretation(data)),
    };
};

const InterpretationContainer = connect(null, mapDispatchToProps)(
    Interpretation
);

export default InterpretationContainer;
