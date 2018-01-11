import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import TextField from 'd2-ui/lib/text-field/TextField';
import Button from 'd2-ui/lib/button/Button';
import { colors } from '../../styleGuide';

import {
    tLikeInterpretation,
    tUnlikeInterpretation,
    tAddInterpretationComment,
    tDeleteInterpretationComment,
    tDeleteInterpretation,
} from './actions';

import './Interpretation.css';

const actionButtonClass = 'interpretation-action-button';
const style = {
    author: {
        color: colors.darkGrey,
        fontSize: '13px',
        fontWeight: '500',
        lineHeight: '15px',
    },
    button: {
        background: 'none !important',
        border: 'none',
        color: colors.darkGrey,
        cursor: 'pointer',
        font: 'inherit',
        fontSize: '12px',
        height: '14px',
        lineJeight: '14px',
        marginRight: '10px',
        padding: '0 !important',
        textDecoration: 'underline',
    },
    commentButton: {
        height: '30px',
        width: '16.84px',
        color: colors.charcoalGrey,
        fontFamily: 'inherit',
        fontSize: '13px',
        lineHeight: '15px',
    },
    comment: {
        paddingRight: '6px',
        paddingTop: '7px',
    },
    newCommentText: {
        fontSize: '14px',
        fontStretch: 'normal',
    },
    newComment: {
        width: '80%',
        display: 'inline-block',
    },
    created: {
        color: colors.mediumGrey,
        float: 'right',
        fontSize: '12px',
        lineHeight: '14px',
        textAlign: 'right',
    },
    deleteButton: {
        color: colors.red,
    },
    icon: {
        height: '12px',
        marginBottom: '-2px',
        paddingRight: '3px',
        width: '12px',
    },
    likes: {
        margin: '0 8px',
        color: colors.darkGrey,
        fontSize: '12px',
        lineHeight: '14px',
    },
    line: {
        backgroundColor: `${colors.lightGrey}`,
        border: 'none',
        height: '1px',
        margin: '-1px 0px 0px',
    },
    list: {
        borderLeft: `4px solid ${colors.lightGrey}`,
        borderTop: `1px solid ${colors.lightGrey}`,
        listStyleType: 'none',
        marginTop: '10px',
        paddingLeft: '20px',
    },
    text: {
        color: colors.darkGrey,
        fontSize: '13px',
        lineHeight: '17px',
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

    userLikesInterpretation = () => {
        return this.props.item.likedBy.find(liker =>
            this.userIsOwner(liker.id)
        );
    };

    toggleInterpretationLike = () => {
        const { id } = this.props.item;

        this.userLikesInterpretation()
            ? this.props.unlikeInterpretation(id)
            : this.props.likeInterpretation(id);
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

    deleteInterpretation = () => {
        const data = {
            id: this.props.item.id,
            objectId: this.props.objectId,
            objectType: this.props.objectType,
        };

        this.props.deleteInterpretation(data);
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

    renderActions() {
        const likes = this.props.item.likedBy.length === 1 ? 'like' : 'likes';
        const userOwnsInterpretation = this.userIsOwner(
            this.props.item.user.id
        );
        const deleteStyle = Object.assign({}, style.icon, { fill: colors.red });
        const thumbsUpIcon = this.userLikesInterpretation()
            ? Object.assign({}, style.icon, { fill: colors.accentLightGreen })
            : style.icon;
        const likeText = this.userLikesInterpretation()
            ? 'You like this'
            : 'Like';

        const deleteButtonStyle = Object.assign(
            {},
            style.button,
            style.deleteButton
        );

        return (
            <div>
                <button className={actionButtonClass} style={style.button}>
                    <SvgIcon style={style.icon} icon="Launch" />
                    View in Visualizer
                </button>
                <button
                    className={actionButtonClass}
                    style={style.button}
                    onClick={this.showCommentField}
                >
                    <SvgIcon style={style.icon} icon="Reply" />
                    Reply
                </button>
                <button
                    className={actionButtonClass}
                    style={style.button}
                    onClick={this.toggleInterpretationLike}
                >
                    <SvgIcon style={thumbsUpIcon} icon="ThumbUp" />
                    {likeText}
                </button>
                <span style={style.likes}>
                    {this.props.item.likedBy.length} {likes}
                </span>
                {userOwnsInterpretation ? (
                    <button
                        className={actionButtonClass}
                        style={deleteButtonStyle}
                        onClick={this.deleteInterpretation}
                    >
                        <SvgIcon style={deleteStyle} icon="Delete" />
                        Delete
                    </button>
                ) : null}
            </div>
        );
    }

    renderComments() {
        if (!this.props.item.comments.length) {
            return null;
        }

        const lineStyle = Object.assign({}, style.line, {
            marginTop: '5px',
        });
        const deleteStyle = Object.assign({}, style.icon, { fill: colors.red });

        const deleteButtonStyle = Object.assign(
            {},
            style.button,
            style.deleteButton
        );

        const comments = sortByDate(this.props.item.comments).map(comment => (
            <li style={style.comment} key={comment.id}>
                <div>
                    <span style={style.author}>{comment.user.displayName}</span>
                    <span style={style.created}>
                        {this.renderDateString(comment.created)}
                    </span>
                </div>
                <p style={style.text}>{comment.text}</p>
                {this.userIsOwner(comment.user.id) ? (
                    <button
                        className={actionButtonClass}
                        style={deleteButtonStyle}
                        onClick={() => this.deleteComment(comment.id)}
                    >
                        <SvgIcon style={deleteStyle} icon="Delete" />
                        Delete
                    </button>
                ) : null}
                <hr style={lineStyle} />
            </li>
        ));

        return <ul style={style.list}>{comments}</ul>;
    }

    render() {
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

        return (
            <div>
                {interpretationBody(this.props.item)}
                {this.renderActions()}
                {this.renderComments()}
                {this.state.showCommentField ? (
                    <div>
                        <div style={style.newComment}>
                            <TextField
                                multiLine
                                value={this.state.commentText}
                                rows={1}
                                rowsMax={5}
                                fullWidth
                                style={style.newCommentText}
                                placeholder="Write your reply"
                                onChange={this.onChangeCommentText}
                            />
                        </div>
                        <Button
                            style={style.commentButton}
                            onClick={this.postComment}
                        >
                            Reply
                        </Button>
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
        deleteInterpretation: data => dispatch(tDeleteInterpretation(data)),
    };
};

Interpretation.contextTypes = {
    d2: PropTypes.object,
};

const InterpretationContainer = connect(null, mapDispatchToProps)(
    Interpretation
);

export default InterpretationContainer;
