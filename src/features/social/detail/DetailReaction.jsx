import { FlexGrowBox } from "../../../components/Styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark as bookmarkA,
  faComment,
  faHeart as heartA,
} from "@fortawesome/free-regular-svg-icons";
import {
  faBookmark as bookmarkB,
  faShareNodes,
  faHeart as heartB,
} from "@fortawesome/free-solid-svg-icons";
import { useGetReactionCountQuery } from "../socialApiSlice";

const DetailReaction = ({
  socialId,
  like,
  bookmark,
  setFocus,
  setReactions,
}) => {
  const { data: likeCount = { count: 0 } } = useGetReactionCountQuery({
    socialId,
  });

  const onClickComment = () => setFocus((prev) => !prev);

  let content = like ? (
    <FontAwesomeIcon icon={heartB} size="xl" color="#cc2020" />
  ) : (
    <FontAwesomeIcon icon={heartA} size="xl" />
  );

  return (
    <>
      <div className="reaction">
        <button
          className="button btn-effect"
          onClick={() => setReactions("like")}
        >
          {content}
        </button>
        <span className="count">{likeCount.count}</span>
        <button className="button btn-effect" onClick={onClickComment}>
          <FontAwesomeIcon icon={faComment} size="xl" />
        </button>
        <button className="button btn-effect">
          <FontAwesomeIcon icon={faShareNodes} size="xl" />
        </button>
        <FlexGrowBox />
        <button
          className="button btn-effect"
          onClick={() => setReactions("bookmark")}
        >
          <FontAwesomeIcon icon={bookmark ? bookmarkB : bookmarkA} size="xl" />
        </button>
      </div>
    </>
  );
};

export default DetailReaction;
