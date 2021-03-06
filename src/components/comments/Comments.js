import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import useHttp from '../../hooks/use-http';
import { getAllComments } from '../../lib/api';
import NewCommentForm from './NewCommentForm';
import LoadingSpinner from '../UI/LoadingSpinner';
import CommentsList from './CommentsList'

import classes from './Comments.module.css';

const Comments = () => {
    const [isAddingComment, setIsAddingComment] = useState(false);

    const params = useParams();
    const { quoteId } = params;     // etAllComments fn needs only quoteId, so choose quoteId only from params 

    const { sendRequest, status, data: loadedComments } = useHttp(getAllComments);

    useEffect(() => {
        sendRequest(quoteId);
    }, [sendRequest, quoteId]);  // quoteId which is destructed from params makes to useEffect re-run as precise as possible 

    const startAddCommentHandler = () => {
        setIsAddingComment(true);
    };

    // addedCommentHandler fn is passed to NewCommentForm component, and use as a dependency of useEffect, 
    // so need useCallback with dependancies.
    // if we dosen't use useCallback here, NewCommentForm is re-created when Comments component re-rendered, may create the infinite loop.
    const addedCommentHandler = useCallback(() => {
        sendRequest(quoteId);
    }, [sendRequest, quoteId]);

    let comments;

    if (status === 'pending') {
        comments = (
            <div className='centered'>
                <LoadingSpinner />
            </div>
        );
    }

    if (status === 'completed' && (loadedComments && loadedComments.length > 0)) {
        comments = <CommentsList comments={loadedComments} />;
    }

    if (status === 'completed' && (!loadedComments || loadedComments.length === 0)) {
        comments = <p className='centered'>No comments were added yet!</p>;
    }

    return (
        <section className={classes.comments}>
            <h2>User Comments</h2>
            {!isAddingComment && (
                <button className='btn' onClick={startAddCommentHandler}>
                    Add a Comment
                </button>
            )}
            {isAddingComment && <NewCommentForm quoteId={quoteId} onAddedComment={addedCommentHandler} />}
            {comments}
        </section>
    );
};

export default Comments;
