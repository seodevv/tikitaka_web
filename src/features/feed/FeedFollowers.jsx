import { useNavigate } from "react-router-dom";
import Profile from "../../components/Profile";
import { useGetFeedsFollowersQuery } from "./feedApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const FeedFollowers = ({ userId, setFollowers }) => {
  if (!userId) return;

  const navigator = useNavigate();
  const {
    data: followers,
    isSuccess,
    isFetching,
  } = useGetFeedsFollowersQuery({ userId });

  let content;
  const onClickLocationFeed = (id) => {
    setFollowers(false);
    navigator(`/feed/${id}`);
  };
  if (isSuccess && !isFetching) {
    content = followers.map((follower) => {
      return (
        <div
          key={follower.id}
          className="item"
          onClick={() => onClickLocationFeed(follower.id)}
        >
          <Profile
            className="profile"
            type={follower.type}
            profile={follower.profile}
          />
          <div className="hangle">{follower.nick}</div>
        </div>
      );
    });
  }

  return (
    <>
      <div className="modal-container ani-fade-in">
        <div className="feed-followers">
          <p className="title">Followers</p>
          <FontAwesomeIcon
            className="close btn-effect transit-none"
            icon={faXmark}
            size="xl"
            onClick={() => setFollowers(false)}
          />
          <div className="list">{content}</div>
        </div>
      </div>
    </>
  );
};

export default FeedFollowers;
