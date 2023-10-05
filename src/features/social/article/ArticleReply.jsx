import { memo } from "react";
import { useGetCommentCountQuery } from "../socialApiSlice";

const ArticleReply = memo(({ socialId, comment, setComment }) => {
  const {
    data: commentCount,
    isSuccess,
    isFetching,
  } = useGetCommentCountQuery({ socialId });
  let count;
  if (isSuccess && !isFetching) {
    count = commentCount.count;
  } else {
    count = 0;
  }

  const onClickOpenComment = () => {
    if (comment === socialId) {
      setComment("");
      return;
    }
    setComment(socialId);
  };
  return (
    <>
      <div className="reply" onClick={onClickOpenComment}>
        <p>{count} 개의 댓글이 있습니다.</p>
      </div>
    </>
  );
});

export default ArticleReply;
