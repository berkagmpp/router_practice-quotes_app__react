import { useRef, useEffect } from 'react';

import useHttp from '../../hooks/use-http';
import { addComment } from '../../lib/api';
import LoadingSpinner from '../UI/LoadingSpinner';

import classes from './NewCommentForm.module.css';

const NewCommentForm = (props) => {
    const commentTextRef = useRef();

    const { sendRequest, status, error } = useHttp(addComment);

    const { onAddedComment } = props;   // send to Comments(parent) component

    useEffect(() => {
        if (status === 'completed' && !error) {
            onAddedComment();
        }
    }, [status, error, onAddedComment]);

    const submitFormHandler = (event) => {
        event.preventDefault();

        // optional: Could validate here

        // send comment to server
        const enteredText = commentTextRef.current.value;
        sendRequest({ commentData: { enteredText }, quoteId: props.quoteId });     // de-structured quotId is also okey from useParams() intead of props.quoteId
    };

    return (
        <form className={classes.form} onSubmit={submitFormHandler}>
            {status === 'pending' && (
                <div className='centered'>
                    <LoadingSpinner />
                </div>
            )}
            <div className={classes.control} onSubmit={submitFormHandler}>
                <label htmlFor='comment'>Your Comment</label>
                <textarea id='comment' rows='5' ref={commentTextRef}></textarea>
            </div>
            <div className={classes.actions}>
                <button className='btn'>Add Comment</button>
            </div>
        </form>
    );
};

export default NewCommentForm;
