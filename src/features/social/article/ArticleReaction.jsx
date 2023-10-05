import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookmark as bookmarkA,
  faComment,
  faHeart as heartA,
} from '@fortawesome/free-regular-svg-icons';
import {
  faBookmark as bookmarkB,
  faShareNodes,
  faHeart as heartB,
} from '@fortawesome/free-solid-svg-icons';
import { FlexGrowBox } from '../../../components/Styled';
import { memo } from 'react';
import { useGetReactionCountQuery } from '../socialApiSlice';

const ArticleReaction = memo(
  ({ socialId, comment, setComment, like, bookmark, setReactions }) => {
    const { data: likeCount = { count: 0 } } = useGetReactionCountQuery({
      socialId,
    });

    let content = like ? (
      <FontAwesomeIcon icon={heartB} size="lg" color="#cc2020" />
    ) : (
      <FontAwesomeIcon icon={heartA} size="lg" />
    );

    const onClickOpenComment = () => {
      if (comment === socialId) {
        setComment('');
        return;
      }
      setComment(socialId);
    };
    return (
      <>
        <div className="reaction">
          <button
            className="button btn-effect"
            onClick={() => {
              setReactions('like');
            }}
          >
            {content}
          </button>
          <span className="count">{likeCount && likeCount.count}</span>
          <button className="button btn-effect" onClick={onClickOpenComment}>
            <FontAwesomeIcon icon={faComment} size="lg" />
          </button>
          <button className="button btn-effect">
            <FontAwesomeIcon icon={faShareNodes} size="lg" />
          </button>
          <FlexGrowBox />
          <button
            className="button btn-effect"
            onClick={() => {
              setReactions('bookmark');
            }}
          >
            <FontAwesomeIcon
              icon={bookmark ? bookmarkB : bookmarkA}
              size="lg"
            />
          </button>
        </div>
      </>
    );
  }
);

export default ArticleReaction;
