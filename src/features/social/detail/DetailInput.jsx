import { useEffect, useRef, useState } from 'react';
import { useAddCommentMutation } from '../socialApiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile, faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import EmojiContainer from '../../../components/EmojiContainer';

const DetailInput = ({ author, userId, socialId, focus, onScrollBottom }) => {
  const inputRef = useRef(null);
  const [input, setInput] = useState('');
  const [emoji, setEmoji] = useState(false);

  const onChangeInput = (e) => setInput(e.target.value);
  const onClickToggleEmoji = () => setEmoji((prev) => !prev);

  const [addComment] = useAddCommentMutation();
  const registComment = async () => {
    if (!input) return;
    try {
      await addComment({
        socialId,
        creator: userId,
        target: author,
        comment: input,
      }).unwrap();
      setInput('');
      onScrollBottom();
    } catch (error) {
      console.error(error);
    }
  };
  const onKeyDownRegistComment = (e) => {
    if (e.keyCode === 13) registComment();
  };
  const onClickRegistComment = () => registComment();

  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 50);
    }
  }, [focus]);

  return (
    <>
      <div className="comment-input">
        <input
          className="input"
          placeholder="댓글을 남겨보세요."
          spellCheck="false"
          ref={inputRef}
          value={input}
          onChange={onChangeInput}
          onKeyDown={onKeyDownRegistComment}
        />
        <div className="button-group">
          <button
            className="button btn-effect emoji"
            onClick={onClickToggleEmoji}
          >
            <FontAwesomeIcon icon={faFaceSmile} />
          </button>
          <button className="button btn-effect" onClick={onClickRegistComment}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
        {emoji && (
          <EmojiContainer
            setInput={setInput}
            inputRef={inputRef}
            setEmoji={setEmoji}
            background="#373737"
            color="#fff"
          />
        )}
      </div>
    </>
  );
};

export default DetailInput;
