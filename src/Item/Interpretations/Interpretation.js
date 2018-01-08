import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import TextField from 'd2-ui/lib/text-field/TextField';
import Button from 'd2-ui/lib/button/Button';

import {
    tLikeInterpretation,
    tUnlikeInterpretation,
    tAddInterpretationComment,
    tDeleteInterpretationComment,
} from './actions';

const style = {
    author: {
        fontWeight: 'bold',
    },
    created: {
        float: 'right',
    },
    text: {},
    link: {
        background: 'none !important',
        color: 'inherit',
        border: 'none',
        padding: '0 !important',
        font: 'inherit',
        textDecoration: 'underline',
        cursor: 'pointer',
    },
    list: {
        listStyleType: 'none',
    },
};

const sortByDate = items => {
    const values = Object.values(items);

    values.sort((a, b) => {
        const aDate = new Date(a.created);
        const bDate = new Date(b.created);

        return aDate - bDate;
    });

    return values;
};

class Interpretation extends Component {
    state = {
        showCommentField: false,
        commentText: '',
        uiLocale: '',
    };

    componentDidMount() {
        this.context.d2.currentUser.userSettings
            .get('keyUiLocale')
            .then(uiLocale => this.setState({ uiLocale }));
    }

    toggleInterpretationLike = () => {
        const item = this.props.item;
        const liked = item.likedBy.find(liker => this.userIsOwner(liker.id));

        liked
            ? this.props.unlikeInterpretation(item.id)
            : this.props.likeInterpretation(item.id);
    };

    showCommentField = () => {
        this.setState({ showCommentField: true });
    };

    postComment = () => {
        const data = {
            id: this.props.item.id,
            text: this.state.commentText,
        };
        this.props.addComment(data);
        this.setState({ showCommentField: false });
        this.setState({ commentText: '' });
    };

    deleteComment = commentId => {
        const data = {
            id: this.props.item.id,
            commentId,
        };

        this.props.deleteComment(data);
    };

    onChangeCommentText = commentText => {
        this.setState({ commentText });
    };

    userIsOwner = id => id === this.context.d2.currentUser.id;

    renderDateString = value => {
        if (typeof global.Intl !== 'undefined' && Intl.DateTimeFormat) {
            const locale = this.state.uiLocale || 'en';
            return new Intl.DateTimeFormat(locale, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }).format(new Date(value));
        }

        return value.substr(0, 19).replace('T', ' ');
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
                        <span style={style.created}>
                            {this.renderDateString(item.created)}
                        </span>
                    </div>
                    <p style={style.text}>{item.text}</p>
                </div>
            );
        };

        const sortedComments = sortByDate(item.comments);
        const comments = sortedComments.map(comment => (
            <li key={comment.id}>
                <div>
                    {this.userIsOwner(comment.user.id) ? (
                        <span onClick={() => this.deleteComment(comment.id)}>
                            <SvgIcon icon="Delete" />
                        </span>
                    ) : null}
                    <span style={style.author}>{comment.user.displayName}</span>
                    <span style={style.created}>
                        {this.renderDateString(comment.created)}
                    </span>
                </div>
                <p style={style.text}>{comment.text}</p>
            </li>
        ));

        return (
            <div>
                {interpretationBody(item)}
                <div>
                    <button style={style.link}>
                        <SvgIcon icon="Launch" />
                        View in Visualizer
                    </button>
                    <button style={style.link} onClick={this.showCommentField}>
                        <SvgIcon icon="Reply" />
                        Reply
                    </button>
                    <button
                        style={style.link}
                        onClick={this.toggleInterpretationLike}
                    >
                        <SvgIcon icon="ThumbUp" />
                        Like
                    </button>
                    <span>{item.likedBy.length} likes</span>
                </div>
                <ul style={style.list}>{comments}</ul>
                {this.state.showCommentField ? (
                    <div>
                        <TextField onChange={this.onChangeCommentText} />
                        <Button onClick={this.postComment}>Reply</Button>
                    </div>
                ) : null}
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        likeInterpretation: data => dispatch(tLikeInterpretation(data)),
        unlikeInterpretation: data => dispatch(tUnlikeInterpretation(data)),
        addComment: data => dispatch(tAddInterpretationComment(data)),
        deleteComment: data => dispatch(tDeleteInterpretationComment(data)),
    };
};

Interpretation.contextTypes = {
    d2: PropTypes.object,
};

const InterpretationContainer = connect(null, mapDispatchToProps)(
    Interpretation
);

export default InterpretationContainer;
