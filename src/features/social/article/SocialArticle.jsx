import { useRef } from 'react';
import ArticleComment from './ArticleComment';
import ArticleHeader from './ArticleHeader';
import ArticleMedia from './ArticleMedia';
import ArticlePost from './ArticlePost';
import ArticleReaction from './ArticleReaction';
import ArticleReply from './ArticleReply';
import ArticleTags from './ArticleTags';
import {
  useGetReactionQuery,
  useToggleReactionMutation,
} from '../socialApiSlice';
import { useSelector } from 'react-redux';
import { selectCreatorId } from '../../login/loginReducer';

const SocialArticle = ({ scrollRef, ids, data, comment, setComment }) => {
  const contentRef = useRef(null);
  if (comment === data.id && scrollRef.current && contentRef.current) {
    const scrollY = scrollRef.current.getBoundingClientRect().y;
    const contentY = contentRef.current.getBoundingClientRect().y;
    if (contentY < scrollY) {
      scrollRef.current.scrollTo({
        top: contentRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  }

  const creator = useSelector(selectCreatorId);
  const initialReactions = { like: false, bookmark: false };
  const { data: reactions = initialReactions } = useGetReactionQuery(
    {
      socialId: data.id,
      userId: creator,
    },
    { skip: creator ? false : true }
  );

  const [toggleReaction] = useToggleReactionMutation();
  const onClickLikeToggle = async (type) => {
    try {
      await toggleReaction({
        type,
        socialId: data.id,
        userId: creator,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <article className="social-content" ref={contentRef}>
        <ArticleHeader socialId={data.id} ids={ids} data={data} />
        <ArticleMedia
          author={data.userId}
          type={data.type}
          thumbnail={data.thumbnail}
          media={data.media}
          like={reactions ? (reactions.like ? true : false) : false}
          setLike={onClickLikeToggle}
        />
        <div className="content">
          <ArticleReaction
            socialId={data.id}
            comment={comment}
            setComment={setComment}
            like={reactions ? (reactions.like ? true : false) : false}
            bookmark={reactions ? (reactions.bookmark ? true : false) : false}
            setReactions={onClickLikeToggle}
          />
          <ArticlePost nick={data.nick} post={data.content} />
          <ArticleTags tags={data.tags} />
          <ArticleReply
            socialId={data.id}
            comment={comment}
            setComment={setComment}
          />
        </div>
        {comment === data.id && (
          <ArticleComment
            wrtierId={data.userId}
            socialId={data.id}
            setComment={setComment}
          />
        )}
      </article>
    </>
  );
};

export default SocialArticle;
