import {
  faBookmark,
  faCameraRetro,
  faGrip,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { showCreative } from "../social/socialReducer";

const FeedTabs = ({ filter, setFilter }) => {
  const dispatch = useDispatch();

  return (
    <>
      <div className="feed-tabs">
        <button
          className={`button btn-effect ${filter === "feed" ? "select" : ""}`}
          onClick={() => setFilter("feed")}
        >
          <FontAwesomeIcon icon={faGrip} color="#fff" />
        </button>
        <button
          className={`button btn-effect ${
            filter === "bookmark" ? "select" : ""
          }`}
          onClick={() => setFilter("bookmark")}
        >
          <FontAwesomeIcon icon={faBookmark} color="#fff" />
        </button>
        <div className="flex-grow"></div>
        <button
          className="button btn-effect"
          onClick={() => dispatch(showCreative())}
        >
          <FontAwesomeIcon icon={faCameraRetro} color="#fff" />
        </button>
      </div>
    </>
  );
};

export default FeedTabs;
