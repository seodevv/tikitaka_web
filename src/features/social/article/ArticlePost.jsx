import { memo, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFilter, selectViewPort } from '../socialReducer';

const ArticlePost = memo(({ nick, post }) => {
  const [split, setSplit] = useState(post.split(/\r\n|\r|\n/));
  const [more, setMore] = useState(false);

  const nickStyle = /[가-힣]/.test(nick) ? { fontSize: '1rem' } : {};
  const postStyle = /[가-힣]/.test(post) ? { fontSize: '1rem' } : {};

  const dispatch = useDispatch();
  const onClickToggleMore = () => setMore((prev) => !prev);
  const onClickFilterNick = (nick) => {
    dispatch(addFilter({ type: 'user', value: nick }));
  };

  let content;
  if (post) {
    content = split.map((v, i) => {
      if (more && i > 2) return;
      if (more && i === 2) {
        return (
          <span key={i}>
            {v}{' '}
            <span className="more" onClick={onClickToggleMore}>
              더보기...
            </span>
          </span>
        );
      }
      if (!more && i === split.length - 1) {
        return <span key={i}>{v}</span>;
      }
      return (
        <span key={i}>
          {v}
          <br />
        </span>
      );
    });
  }

  useLayoutEffect(() => {
    if (split.length > 3) setMore(true);
  }, [split]);

  return (
    <>
      <div className="post">
        <button
          className="nick btn-effect"
          style={nickStyle}
          onClick={() => onClickFilterNick(nick)}
        >
          {nick}
        </button>
        <div className="d-inline" style={postStyle}>
          {content}
        </div>
      </div>
    </>
  );
});

export default ArticlePost;
