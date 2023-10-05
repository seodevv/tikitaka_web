import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import Comment from './Comment';
import EmojiContainer from '../../../components/EmojiContainer';
import { useAddCommentMutation, useGetCommentQuery } from '../socialApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectCreatorId } from '../../login/loginReducer';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { selectViewPort, showArticle } from '../socialReducer';

const ArticleComment = ({ wrtierId, socialId, setComment }) => {
  const viewport = useSelector(selectViewPort);
  const dispatch = useDispatch();

  const {
    data: comments,
    isSuccess,
    isFetching,
  } = useGetCommentQuery({ socialId }, { pollingInterval: 60000 });

  const innerRef = useRef(null);
  const onScrollBottom = () => {
    if (innerRef.current) {
      innerRef.current.scrollTop = innerRef.current.scrollHeight;
    }
  };

  let content;
  if (isSuccess && !isFetching) {
    if (comments.length === 0) {
      content = (
        <div className="comment-noreply">
          <span>댓글이 없습니다.</span>
        </div>
      );
    } else {
      content = comments.map((comment) => (
        <Comment key={comment.id} wrtierId={wrtierId} comment={comment} />
      ));
    }
  }

  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const onChangeInput = (e) => setInput(e.target.value);

  const creator = useSelector(selectCreatorId);
  const [addComment] = useAddCommentMutation();
  const registComment = async () => {
    try {
      await addComment({
        socialId,
        creator,
        target: wrtierId,
        comment: input,
      }).unwrap();
      setInput('');
      onScrollBottom();
    } catch (error) {
      console.error(error);
    }
  };
  const onClickRegistComment = () => registComment();
  const onKeyDownRegistComment = (e) => {
    if (e.keyCode === 13) registComment();
  };

  const [emoji, setEmoji] = useState(false);
  const onClickToggleEmoji = (e) => setEmoji((prev) => !prev);

  useEffect(() => {
    const listener = (e) => {
      if (e.keyCode === 27) {
        setComment(0);
      }
    };
    window.addEventListener('keydown', listener);
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, []);

  useLayoutEffect(() => {
    if (viewport.width < 800) {
      dispatch(showArticle({ id: socialId }));
      setComment('');
    }
  }, [viewport]);

  return (
    <>
      <div className="social-comment ani-fade-in">
        <div className="inner scroll-none" ref={innerRef}>
          <FontAwesomeIcon
            className="comment-close btn-effect"
            icon={faChevronLeft}
            onClick={() => setComment(0)}
          />
          {content}
        </div>
        <div className="comment-input">
          <input
            className="input"
            placeholder="댓글을 남겨보세요."
            value={input}
            ref={inputRef}
            onChange={onChangeInput}
            onKeyDown={onKeyDownRegistComment}
          />
          <div className="button-group">
            <button className="button emoji" onClick={onClickToggleEmoji}>
              <FontAwesomeIcon icon={faFaceSmile} />
            </button>
            <button
              className="button btn-effect"
              onClick={onClickRegistComment}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
          {emoji && (
            <EmojiContainer
              setInput={setInput}
              inputRef={inputRef}
              setEmoji={setEmoji}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ArticleComment;
