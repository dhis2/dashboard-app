import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import InputField from './InputField';
import { colors } from '../colors';

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
    comment: {
        paddingRight: '6px',
        paddingTop: '7px',
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

const deleteButton = action => {
    const iconStyle = Object.assign({}, style.icon, { fill: colors.red });
    const buttonStyle = Object.assign({}, style.button, style.deleteButton);

    return (
        <button
            className={actionButtonClass}
            style={buttonStyle}
            onClick={action}
        >
            <SvgIcon style={iconStyle} icon="Delete" />
            Delete
        </button>
    );
};

class Interpretation extends Component {
    state = {
        showCommentField: false,
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

    postComment = text => {
        const { id } = this.props.item;
        this.props.addComment({ id, text });
        this.setState({ showCommentField: false });
    };

    deleteComment = commentId => {
        const { id } = this.props.item;
        this.props.deleteComment({ id, commentId });
    };

    deleteInterpretation = () => {
        const data = {
            id: this.props.item.id,
            objectId: this.props.objectId,
            objectType: this.props.objectType,
        };

        this.props.deleteInterpretation(data);
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

        const thumbsUpIcon = this.userLikesInterpretation()
            ? Object.assign({}, style.icon, { fill: colors.accentLightGreen })
            : style.icon;
        const likeText = this.userLikesInterpretation()
            ? 'You like this'
            : 'Like';

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
                {userOwnsInterpretation
                    ? deleteButton(this.deleteInterpretation)
                    : null}
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

        const comments = sortByDate(this.props.item.comments).map(comment => (
            <li style={style.comment} key={comment.id}>
                <div>
                    <span style={style.author}>{comment.user.displayName}</span>
                    <span style={style.created}>
                        {this.renderDateString(comment.created)}
                    </span>
                </div>
                <p style={style.text}>{comment.text}</p>
                {this.userIsOwner(comment.user.id)
                    ? deleteButton(() => this.deleteComment(comment.id))
                    : null}
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
                    <InputField
                        placeholder="Write your reply"
                        onPost={this.postComment}
                        postText="Reply"
                    />
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
