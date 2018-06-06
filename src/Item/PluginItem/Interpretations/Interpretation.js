import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import i18n from 'd2-i18n';
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
    tEditInterpretation,
    tDeleteInterpretationComment,
    tDeleteInterpretation,
    tEditInterpretationComment,
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
        paddingRight: '2px',
        width: '12px',
    },
    likes: {
        margin: '0 10px 0 0',
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

const editButton = action => {
    return (
        <button className={actionButtonClass} onClick={action}>
            <SvgIcon style={style.icon} icon="Create" />
            {i18n.t('Edit')}
        </button>
    );
};

class Interpretation extends Component {
    state = {
        showCommentField: false,
        uiLocale: '',
        visualizerHref: '',
        editing: [],
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
        this.setState({ showCommentField: !this.state.showCommentField });
    };

    postComment = text => {
        const { id } = this.props.interpretation;
        this.props.addComment({ id, text });
        this.setState({ showCommentField: false });
    };

    // new: joakim -> Update original interpretation, or comment related to the interpretation.
    editComment = (commentId, text) => {
        // Ignore posting empty edits, forcing user to delete the comment instead.
        if (text.length > 0) {
            const { id } = this.props.interpretation;
            id === commentId
                ? this.props.updateInterpretation({ id, text })
                : this.props.updateInterpretationComment({
                      id,
                      commentId,
                      text,
                  });
        }
        this.toggleEdit(commentId);
    };

    // new: joakim (find better name) -> Render InputField or existing text, if ID is present in Array.
    renderCommentOrEditField = item => {
        return this.state.editing.includes(item.id) ? (
            <InputField
                editing
                placeholder={item.text}
                commentId={item.id}
                postText={'Post'}
                onEdit={this.editComment}
            />
        ) : (
            <p style={style.text}>{item.text}</p>
        );
    };

    // new: joakim -> Toggle Edit function
    toggleEdit = commentId => {
        !this.state.editing.includes(commentId)
            ? this.setState({ editing: [...this.state.editing, commentId] })
            : this.setState({
                  editing: this.state.editing.filter(entry => {
                      return entry !== commentId;
                  }),
              });
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
            ? i18n.t('You like this')
            : i18n.t('Like');

        const canModifyInterpretation = () =>
            this.userIsOwner(this.props.interpretation.user.id) ||
            this.props.interpretation.access.delete ||
            this.props.userIsSuperuser;

        return (
            <div>
                <a
                    href={this.state.visualizerHref}
                    style={{
                        height: 16,
                        color: '#494949',
                        fontSize: '12px',
                        marginRight: '10px',
                    }}
                >
                    <SvgIcon style={style.icon} icon="Launch" />
                    {i18n.t('View in Visualizer')}
                </a>
                {canModifyInterpretation() &&
                    editButton(() =>
                        this.toggleEdit(this.props.interpretation.id)
                    )}
                <button
                    className={actionButtonClass}
                    onClick={this.showCommentField}
                >
                    <SvgIcon style={style.icon} icon="Reply" />
                    {i18n.t('Reply')}
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
                {canModifyInterpretation() &&
                    deleteButton(this.deleteInterpretation)}
            </div>
        );
    }

    renderComments() {
        if (!this.props.interpretation.comments.length) {
            return null;
        }
        const canModifyComment = ownerId =>
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
                {this.renderCommentOrEditField(comment)}
                {canModifyComment(comment.user.id) && (
                    <div>
                        {editButton(() => this.toggleEdit(comment.id))}
                        {deleteButton(() => this.deleteComment(comment.id))}
                    </div>
                )}
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
                    {this.renderCommentOrEditField(item)}
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
                    <div style={{ marginLeft: '37px' }}>
                        <InputField
                            placeholder={i18n.t('Add your reply')}
                            commentId={this.props.interpretation.id}
                            onPost={this.postComment}
                            postText={i18n.t('Reply')}
                        />
                    </div>
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
    updateInterpretation: data => dispatch(tEditInterpretation(data)), // new: Joakim
    updateInterpretationComment: data =>
        dispatch(tEditInterpretationComment(data)), // new: joakim
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
