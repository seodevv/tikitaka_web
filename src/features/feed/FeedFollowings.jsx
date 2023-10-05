import { useNavigate } from "react-router-dom";
import Profile from "../../components/Profile";
import { useGetFeedsFollowingsQuery } from "./feedApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const FeedFollowings = ({ userId, setFollowings }) => {
  if (!userId) return;

  const navigator = useNavigate();
  const {
    data: followings,
    isSuccess,
    isFetching,
  } = useGetFeedsFollowingsQuery({ userId });

  let content;
  const onClickLocationFeed = (id) => {
    setFollowings(false);
    navigator(`/feed/${id}`);
  };
  if (isSuccess && !isFetching) {
    content = followings.map((following) => {
      return (
        <div
          key={following.id}
          className="item"
          onClick={() => onClickLocationFeed(following.id)}
        >
          <Profile
            className="profile"
            type={following.type}
            profile={following.profile}
          />
          <div className="hangle">{following.nick}</div>
        </div>
      );
    });
  }

  return (
    <>
      <div className="modal-container ani-fade-in">
        <div className="feed-followers">
          <p className="title">Followings</p>
          <FontAwesomeIcon
            className="close btn-effect transit-none"
            icon={faXmark}
            size="xl"
            onClick={() => setFollowings(false)}
          />
          <div className="list">{content}</div>
        </div>
      </div>
    </>
  );
};

export default FeedFollowings;
