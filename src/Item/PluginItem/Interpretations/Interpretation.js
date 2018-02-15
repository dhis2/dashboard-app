import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SvgIcon from 'd2-ui/lib/svg-icon/SvgIcon';
import { fromUser } from '../../../reducers';
import InputField from './InputField';
import { colors } from '../../../colors';
import { formatDate, sortByDate } from '../../../util';
import { getLink } from '../plugin';

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
        listStyleType: 'none',
        marginTop: '10px',
        marginLeft: '37px',
        paddingLeft: '0px',
    },
    text: {
        color: colors.darkGrey,
        fontSize: '13px',
        lineHeight: '17px',
        whiteSpace: 'pre-line',
    },
};

const deleteButton = action => {
    const iconStyle = Object.assign({}, style.icon, { fill: colors.red });

    return (
        <button
            className={actionButtonClass}
            style={style.deleteButton}
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
        visualizerHref: '',
    };

    componentDidMount() {
        this.context.d2.currentUser.userSettings
            .get('keyUiLocale')
            .then(uiLocale => this.setState({ uiLocale }));

        const visualizerHref = `${getLink(
            this.props.object,
            this.context.d2
        )}&interpretationid=${this.props.interpretation.id}`;
        this.setState({ visualizerHref });
    }

    userLikesInterpretation = () => {
        return this.props.interpretation.likedBy.find(liker =>
            this.userIsOwner(liker.id)
        );
    };

    toggleInterpretationLike = () => {
        const { id } = this.props.interpretation;

        this.userLikesInterpretation()
            ? this.props.unlikeInterpretation(id)
            : this.props.likeInterpretation(id);
    };

    showCommentField = () => {
        this.setState({ showCommentField: true });
    };

    postComment = text => {
        const { id } = this.props.interpretation;
        this.props.addComment({ id, text });
        this.setState({ showCommentField: false });
    };

    deleteComment = commentId => {
        const { id } = this.props.interpretation;
        this.props.deleteComment({ id, commentId });
    };

    deleteInterpretation = () => {
        const data = {
            id: this.props.interpretation.id,
            objectId: this.props.objectId,
            objectType: this.props.object.type,
        };

        this.props.deleteInterpretation(data);
    };

    userIsOwner = ownerId => ownerId === this.props.userId;

    renderActions() {
        const likes =
            this.props.interpretation.likedBy.length === 1 ? 'like' : 'likes';

        const thumbsUpIcon = this.userLikesInterpretation()
            ? Object.assign({}, style.icon, { fill: colors.lightGreen })
            : style.icon;
        const likeText = this.userLikesInterpretation()
            ? 'You like this'
            : 'Like';

        const canDeleteInterpretation = () =>
            this.userIsOwner(this.props.interpretation.user.id) ||
            this.props.interpretation.access.delete ||
            this.props.userIsSuperuser;

        return (
            <div>
                <a href={this.state.visualizerHref} style={{ height: 16 }}>
                    <SvgIcon style={style.icon} icon="Launch" />
                    View in Visualizer
                </a>
                <button
                    className={actionButtonClass}
                    onClick={this.showCommentField}
                >
                    <SvgIcon style={style.icon} icon="Reply" />
                    Reply
                </button>
                <button
                    className={actionButtonClass}
                    onClick={this.toggleInterpretationLike}
                >
                    <SvgIcon style={thumbsUpIcon} icon="ThumbUp" />
                    {likeText}
                </button>
                <span style={style.likes}>
                    {this.props.interpretation.likedBy.length} {likes}
                </span>
                {canDeleteInterpretation()
                    ? deleteButton(this.deleteInterpretation)
                    : null}
            </div>
        );
    }

    renderComments() {
        if (!this.props.interpretation.comments.length) {
            return null;
        }

        const canDeleteComment = ownerId =>
            this.userIsOwner(ownerId) || this.props.userIsSuperuser;

        const comments = sortByDate(
            this.props.interpretation.comments,
            'created'
        ).map(comment => (
            <li
                className="comment-container"
                style={style.comment}
                key={comment.id}
            >
                <div>
                    <span style={style.author}>{comment.user.displayName}</span>
                    <span style={style.created}>
                        {formatDate(comment.created, this.state.uiLocale)}
                    </span>
                </div>
                <p style={style.text}>{comment.text}</p>
                {canDeleteComment(comment.user.id)
                    ? deleteButton(() => this.deleteComment(comment.id))
                    : null}
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
                            {formatDate(item.created, this.state.uiLocale)}
                        </span>
                    </div>
                    <p style={style.text}>{item.text}</p>
                </div>
            );
        };

        return (
            <div>
                <div className="interpretation-container">
                    {interpretationBody(this.props.interpretation)}
                    {this.renderActions()}
                </div>
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

const mapStateToProps = state => ({
    userId: fromUser.sGetUserId(state),
    userIsSuperuser: fromUser.sGetIsSuperuser(state),
});

const mapDispatchToProps = dispatch => ({
    likeInterpretation: data => dispatch(tLikeInterpretation(data)),
    unlikeInterpretation: data => dispatch(tUnlikeInterpretation(data)),
    addComment: data => dispatch(tAddInterpretationComment(data)),
    deleteComment: data => dispatch(tDeleteInterpretationComment(data)),
    deleteInterpretation: data => dispatch(tDeleteInterpretation(data)),
});

Interpretation.contextTypes = {
    d2: PropTypes.object,
};

const InterpretationContainer = connect(mapStateToProps, mapDispatchToProps)(
    Interpretation
);

export default InterpretationContainer;
