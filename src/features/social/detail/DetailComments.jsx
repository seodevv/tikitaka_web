import Comment from '../article/Comment';
import { useGetCommentQuery } from '../socialApiSlice';

const DetailComments = ({ author, socialId }) => {
  const {
    data: comments,
    isSuccess,
    isFetching,
  } = useGetCommentQuery({ socialId });

  let content;
  if (isSuccess && !isFetching) {
    content = comments.map((comment) => (
      <Comment key={comment.id} wrtierId={author} comment={comment} />
    ));
  }
  return <>{content}</>;
};

export default DetailComments;
