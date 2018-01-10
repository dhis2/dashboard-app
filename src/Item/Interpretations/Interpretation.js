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
    tDeleteInterpretation,
} from './actions';

import './Interpretation.css';

const redColor = '#E53935';
const lightGray = '#ECEFF1';
const style = {
    author: {
        fontWeight: 'bold',
    },
    created: {
        float: 'right',
    },
    text: {},
    list: {
        listStyleType: 'none',
        paddingLeft: '20px',
        borderLeft: `4px solid ${lightGray}`,
        marginTop: '10px',
        borderTop: `1px solid ${lightGray}`,
    },
    icon: {
        width: '12px',
        height: '12px',
        marginBottom: '-2px',
        paddingRight: '3px',
    },
    likes: {
        margin: '0 8px',
    },
    deleteButton: {
        color: redColor,
    },
    comment: {
        paddingTop: '7px',
        paddingRight: '6px',
    },
    line: {
        margin: '-1px 0px 0px',
        height: '1px',
        border: 'none',
        backgroundColor: `${lightGray}`,
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
        const buttonClass = 'interpretation-action-button';
        const likes = this.props.item.likedBy.length === 1 ? 'like' : 'likes';
        const userOwnsInterpretation = this.userIsOwner(
            this.props.item.user.id
        );
        const deleteStyle = Object.assign({}, style.icon, { fill: redColor });
        const thumbsUpIcon = this.userLikesInterpretation()
            ? Object.assign({}, style.icon, { fill: '#48A999' })
            : style.icon;
        const likeText = this.userLikesInterpretation()
            ? 'You like this'
            : 'Like';

        return (
            <div>
                <button className={buttonClass}>
                    <SvgIcon style={style.icon} icon="Launch" />
                    View in Visualizer
                </button>
                <button className={buttonClass} onClick={this.showCommentField}>
                    <SvgIcon style={style.icon} icon="Reply" />
                    Reply
                </button>
                <button
                    className={buttonClass}
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
                        className={buttonClass}
                        style={style.deleteButton}
                        onClick={this.deleteInterpretation}
                    >
                        <SvgIcon style={deleteStyle} icon="Delete" />
                        Delete
                    </button>
                ) : null}
            </div>
        );
    }

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

        const deleteStyle = Object.assign({}, style.icon, { fill: redColor });
        const comments = sortByDate(item.comments).map(comment => (
            <li style={style.comment} key={comment.id}>
                <div>
                    <span style={style.author}>{comment.user.displayName}</span>
                    <span style={style.created}>
                        {this.renderDateString(comment.created)}
                    </span>
                </div>
                <p style={style.text}>{comment.text}</p>
                {this.userIsOwner(comment.user.id) ? (
                    <span onClick={() => this.deleteComment(comment.id)}>
                        <SvgIcon style={deleteStyle} icon="Delete" />
                    </span>
                ) : null}
                <hr style={style.line} />
            </li>
        ));

        return (
            <div>
                {interpretationBody(item)}
                {this.renderActions()}
                {item.comments.length ? (
                    <ul style={style.list}>{comments}</ul>
                ) : null}
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
